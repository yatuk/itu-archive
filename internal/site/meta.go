package site

// Ders ve hoca sayfalarının <title> ve meta description metinleri. Arama
// sonucunda tıklamayı belirleyen tek görünür metin bunlar olduğu için
// sayfanın içerdiği somut verilerden (açıldığı dönemler, son dönem hocaları,
// not dağılımı oranı) kurulur. Hepsi sayfanın kendisinde de görünen
// bilgilerdir; sayfada olmayan bir şey vaat edilmez.

import (
	"fmt"
	"sort"
	"strconv"
	"strings"
	"unicode/utf8"

	"itu-scraper/internal/term"
)

// descMaxRunes, arama sonucunda kesilmeden görünen yaklaşık açıklama uzunluğu.
const descMaxRunes = 160

// appendIfFits, isteğe bağlı kapanış cümlesini yalnızca açıklama sığarsa ekler.
func appendIfFits(desc, tail string) string {
	if utf8.RuneCountInString(desc+tail) <= descMaxRunes {
		return desc + tail
	}
	return desc
}

// trNum, binlik ayırıcı olarak nokta kullanan Türkçe sayı biçimi.
func trNum(n int) string {
	s := strconv.Itoa(n)
	if n < 0 || len(s) <= 3 {
		return s
	}
	var out strings.Builder
	pre := len(s) % 3
	if pre > 0 {
		out.WriteString(s[:pre])
	}
	for i := pre; i < len(s); i += 3 {
		if out.Len() > 0 {
			out.WriteByte('.')
		}
		out.WriteString(s[i : i+3])
	}
	return out.String()
}

// shortTermLabel, "2026-2027 Güz Dönemi" -> "2026-2027 Güz".
func shortTermLabel(label string) string {
	return strings.TrimSuffix(strings.TrimSpace(label), " Dönemi")
}

// latestGradeRecord, bir dersin en son açıklanan (toplamı > 0) not dağılımı.
func latestGradeRecord(records map[string]gradeFileRow) (gradeFileRow, bool) {
	var best gradeFileRow
	found := false
	for _, r := range records {
		if r.Total <= 0 {
			continue
		}
		if !found || r.Donem > best.Donem || (r.Donem == best.Donem && r.Term > best.Term) {
			best, found = r, true
		}
	}
	return best, found
}

// courseMeta, ders sayfasının başlığını ve açıklamasını üretir.
func (b *Builder) courseMeta(code string, hc *histCourse, termLabels map[string]string) (title, desc string) {
	name := strings.TrimSpace(hc.Name)
	head := code
	if name != "" {
		head = code + " " + name
	}
	grade, hasGrades := latestGradeRecord(b.gradesIndex[code])
	if hasGrades {
		title = head + " · İTÜ not dağılımı, hocalar ve şubeler"
	} else {
		title = head + " · İTÜ ders geçmişi, hocalar ve şubeler"
	}

	terms := map[string]struct{}{}
	latest := ""
	for _, t := range hc.Terms {
		terms[t] = struct{}{}
	}
	for _, r := range hc.Rows {
		if r.Term != "" {
			terms[r.Term] = struct{}{}
		}
	}
	for t := range terms {
		if latest == "" || term.SortKey(t) > term.SortKey(latest) {
			latest = t
		}
	}
	var instructors []string
	seen := map[string]bool{}
	for _, r := range hc.Rows {
		if r.Term != latest || isPlaceholderInstructor(r.Instructor) || !isIndexableInstructorName(r.Instructor) || seen[r.Instructor] {
			continue
		}
		seen[r.Instructor] = true
		instructors = append(instructors, strings.TrimSpace(r.Instructor))
	}
	sort.Strings(instructors)
	instrText := ""
	switch {
	case len(instructors) > 3:
		instrText = fmt.Sprintf(" (%s ve %d hoca daha)", strings.Join(instructors[:2], ", "), len(instructors)-2)
	case len(instructors) > 0:
		instrText = " (" + strings.Join(instructors, ", ") + ")"
	}
	latestLabel := latest
	if l := termLabels[latest]; l != "" {
		latestLabel = shortTermLabel(l)
	}

	var sb strings.Builder
	fmt.Fprintf(&sb, "%s: İTÜ'de %d dönem açıldı", head, len(terms))
	if latest != "" {
		fmt.Fprintf(&sb, ", son olarak %s%s", latestLabel, instrText)
	}
	sb.WriteString(".")
	if hasGrades {
		top, _ := gradeHeadlineRates(grade.Grades, grade.Total)
		fmt.Fprintf(&sb, " %s not dağılımında AA/BA oranı %%%d (%s not).", shortTermLabel(grade.Term), top, trNum(grade.Total))
	}
	return title, appendIfFits(sb.String(), " Şubeler, kontenjan ve dönem geçmişi.")
}

// instructorMeta, hoca sayfasının başlığını ve açıklamasını üretir. Arşivde
// hoca puanı (oy) verisi yoktur; başlık bu yüzden puan vaat etmez, resmî not
// dağılımı ve ders geçmişini öne çıkarır.
func instructorMeta(hi *histInstr, gp instructorGradeProfile, hm *hmEntry, courseCount int, latestLabel string) (title, desc string) {
	hmText := ""
	if hm.hasData() && hm.Overall != nil {
		hmText = "hocametre " + strings.Replace(strconv.FormatFloat(*hm.Overall, 'f', 1, 64), ".", ",", 1) + "/5"
	}
	if gp.Total > 0 {
		title = hi.Name + " · İTÜ not dağılımı ve verdiği dersler"
	} else {
		title = hi.Name + " · İTÜ'de verdiği dersler ve dönemleri"
	}
	// Oy sayısı yeterliyse puan başlıkta da görünür; sığmazsa kısa biçim.
	if hmText != "" && hm.Votes >= hmFewVotes {
		var options []string
		if gp.Total > 0 {
			options = []string{
				hi.Name + " · " + hmText + ", İTÜ not dağılımı ve dersleri",
				hi.Name + " · " + hmText + " · İTÜ not dağılımı",
			}
		} else {
			options = []string{
				hi.Name + " · " + hmText + " · İTÜ'de verdiği dersler",
				hi.Name + " · " + hmText + " · İTÜ dersleri",
			}
		}
		for _, o := range options {
			if utf8.RuneCountInString(o) <= 65 {
				title = o
				break
			}
		}
	}
	latestLabel = shortTermLabel(latestLabel)
	const disclaimer = " Resmî personel profili değildir."
	var sb strings.Builder
	frequent := frequentCourses(hi.Rows, 3)
	if courseCount == 1 && len(frequent) == 1 {
		fmt.Fprintf(&sb, "%s, İTÜ'de %s dersini %d dönem verdi; son kayıt %s.", hi.Name, frequent[0].Code, hi.Terms, latestLabel)
	} else {
		fmt.Fprintf(&sb, "%s, İTÜ'de %d dönemde %d ders verdi; son kayıt %s.", hi.Name, hi.Terms, courseCount, latestLabel)
	}
	d := sb.String()
	room := func(tail string) string {
		// Sonda her zaman feragat cümlesine yer kalsın.
		if utf8.RuneCountInString(d+tail+disclaimer) <= descMaxRunes {
			return d + tail
		}
		return d
	}
	if hmText != "" {
		d = room(fmt.Sprintf(" H%s (%s oy).", strings.TrimPrefix(hmText, "h"), trNum(hm.Votes)))
	}
	if gp.Total > 0 {
		top := (gp.Counts["AA"] + gp.Counts["BA+"] + gp.Counts["BA"]) * 100 / gp.Total
		fail := (gp.Counts["FF"] + gp.Counts["VF"]) * 100 / gp.Total
		// Uzundan kısaya: sığan ilk not özeti kullanılır.
		for _, tail := range []string{
			fmt.Sprintf(" Not dağılımı: AA/BA %%%d, FF/VF %%%d (%s not).", top, fail, trNum(gp.Total)),
			fmt.Sprintf(" AA/BA oranı %%%d, FF/VF %%%d.", top, fail),
			fmt.Sprintf(" AA/BA oranı %%%d.", top),
		} {
			if next := room(tail); next != d {
				d = next
				break
			}
		}
	} else if courseCount > 1 && len(frequent) > 0 {
		codes := make([]string, 0, len(frequent))
		for _, c := range frequent {
			codes = append(codes, c.Code)
		}
		d = room(fmt.Sprintf(" Dersleri: %s.", strings.Join(codes, ", ")))
	}
	return title, d + disclaimer
}
