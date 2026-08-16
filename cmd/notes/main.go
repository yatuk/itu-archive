// Command notes, Not Kutusu kayıtlarını yönetir.
//
// Üç iş yapar, hepsi ayrı bayrakla:
//
//	-from-issue <dosya>   GitHub issue formundan gelen gövdeyi ayrıştırıp
//	                      doğrular ve docs/data/notes/<BRANŞ>.json'a ekler.
//	                      Workflow bunu çağırır; başarısızlıkta sıfırdan farklı
//	                      kodla çıkar, böylece issue'ya hata yorumu düşülür.
//	-check                Kayıtlı bağlantılara HEAD atar, kalıcı olarak yok
//	                      olanları dead:true işaretler. Haftalık koşar.
//	-validate             Var olan tüm kayıtları yeniden denetler (CI).
//
// Arşiv dosya barındırmaz; ayrıntılı gerekçe internal/notes paket yorumunda.
package main

import (
	"context"
	"encoding/json"
	"flag"
	"fmt"
	"log"
	"net/http"
	"os"
	"path/filepath"
	"sort"
	"time"

	"itu-scraper/internal/model"
	"itu-scraper/internal/notes"
)

func main() {
	out := flag.String("out", "docs", "çıktı kök dizini")
	fromIssue := flag.String("from-issue", "", "issue gövdesini içeren dosya")
	issueNo := flag.Int("issue", 0, "katkının geldiği issue numarası")
	check := flag.Bool("check", false, "kayıtlı bağlantıları denetle")
	validate := flag.Bool("validate", false, "mevcut kayıtları doğrula")
	rps := flag.Float64("rps", 6, "saniyedeki istek üst sınırı (-check)")
	flag.Parse()

	var err error
	switch {
	case *fromIssue != "":
		err = runFromIssue(*out, *fromIssue, *issueNo)
	case *check:
		err = runCheck(*out, *rps)
	case *validate:
		err = runValidate(*out)
	default:
		err = fmt.Errorf("bir işlem seçin: -from-issue, -check ya da -validate")
	}
	if err != nil {
		log.Fatalf("hata: %v", err)
	}
}

/* ---------- issue -> kayıt ---------- */

func runFromIssue(root, bodyPath string, issueNo int) error {
	raw, err := os.ReadFile(bodyPath)
	if err != nil {
		return err
	}
	n := notes.FromIssue(notes.ParseIssueBody(string(raw)))
	n.Issue = issueNo
	n.AddedAt = time.Now().UTC().Format(time.RFC3339)

	known, err := knownCourses(root)
	if err != nil {
		return err
	}
	if err := notes.Validate(n, known); err != nil {
		return err
	}

	list, err := notes.LoadBranch(root, n.Branch)
	if err != nil {
		return err
	}
	if notes.Duplicate(list, n.Code, n.URL) {
		return fmt.Errorf("bu bağlantı %s için zaten kayıtlı", n.Code)
	}
	n.ID = notes.NextID(n.Code, list)

	list = append(list, n)
	if err := notes.SaveBranch(root, n.Branch, list); err != nil {
		return err
	}
	all, err := notes.LoadAll(root)
	if err != nil {
		return err
	}
	if err := notes.WriteIndex(root, all, time.Now()); err != nil {
		return err
	}
	fmt.Printf("eklendi: %s · %s · %s (%s)\n", n.ID, n.Code, n.Title, n.Host)
	return nil
}

// knownCourses, arşivde geçen tüm ders kodlarını toplar (geçmiş indeksi).
// Uydurma koda not eklenmesini engeller. Dosya yoksa nil döner: doğrulama
// kod varlığını atlar, biçim denetimi yine çalışır.
func knownCourses(root string) (map[string]struct{}, error) {
	b, err := os.ReadFile(filepath.Join(root, "data", "history", "codes.json"))
	if os.IsNotExist(err) {
		return nil, nil
	}
	if err != nil {
		return nil, err
	}
	var rows [][]json.RawMessage
	if err := json.Unmarshal(b, &rows); err != nil {
		return nil, err
	}
	out := make(map[string]struct{}, len(rows))
	for _, r := range rows {
		if len(r) == 0 {
			continue
		}
		var code string
		if json.Unmarshal(r[0], &code) == nil && code != "" {
			out[code] = struct{}{}
		}
	}
	return out, nil
}

/* ---------- doğrulama ---------- */

func runValidate(root string) error {
	all, err := notes.LoadAll(root)
	if err != nil {
		return err
	}
	known, err := knownCourses(root)
	if err != nil {
		return err
	}
	seen := map[string]string{} // id -> code
	var problems []string
	for _, n := range all {
		if err := notes.Validate(n, known); err != nil {
			problems = append(problems, fmt.Sprintf("%s: %v", n.ID, err))
		}
		if prev, dup := seen[n.ID]; dup {
			problems = append(problems, fmt.Sprintf("%s: kimlik iki kez kullanılmış (%s, %s)", n.ID, prev, n.Code))
		}
		seen[n.ID] = n.Code
	}
	sort.Strings(problems)
	for _, p := range problems {
		fmt.Fprintln(os.Stderr, "· "+p)
	}
	fmt.Printf("%d kayıt denetlendi, %d sorun\n", len(all), len(problems))
	if len(problems) > 0 {
		return fmt.Errorf("%d kayıt geçersiz", len(problems))
	}
	return nil
}

/* ---------- bağlantı denetimi ---------- */

func runCheck(root string, rps float64) error {
	all, err := notes.LoadAll(root)
	if err != nil {
		return err
	}
	if len(all) == 0 {
		fmt.Println("kayıt yok")
		return nil
	}

	cl := &http.Client{Timeout: 20 * time.Second}
	ctx := context.Background()
	gap := time.Duration(float64(time.Second) / rps)
	now := time.Now().UTC().Format(time.RFC3339)

	byBranch := map[string][]model.Note{}
	var revived, died int
	for i, n := range all {
		if i > 0 {
			time.Sleep(gap)
		}
		res := notes.Check(ctx, cl, n.URL)
		n.CheckedAt = now
		switch {
		case !res.Alive && !n.Dead:
			n.Dead = true
			died++
			fmt.Printf("ölü: %s · %s (%d)\n", n.ID, n.URL, res.Code)
		case res.Alive && n.Dead:
			n.Dead = false
			revived++
			fmt.Printf("döndü: %s · %s\n", n.ID, n.URL)
		}
		byBranch[n.Branch] = append(byBranch[n.Branch], n)
	}

	for branch, list := range byBranch {
		if err := notes.SaveBranch(root, branch, list); err != nil {
			return err
		}
	}
	updated, err := notes.LoadAll(root)
	if err != nil {
		return err
	}
	if err := notes.WriteIndex(root, updated, time.Now()); err != nil {
		return err
	}
	fmt.Printf("%d bağlantı denetlendi · %d yeni ölü · %d geri döndü\n", len(all), died, revived)
	return nil
}
