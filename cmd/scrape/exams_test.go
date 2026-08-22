package main

import (
	"os"
	"path/filepath"
	"testing"

	"itu-scraper/internal/model"
	"itu-scraper/internal/store"
)

// OBS'nin sınav ucunda dönem parametresi yok; dönem döndükten sonra yeni dönemin
// takvimi ilan edilene kadar ÖNCEKİ dönemin takvimi gelir. Yaşanmış hata:
// 2025-2026 Yaz finalleri 2026-2027 Güz etiketiyle yayınlandı.
//
// Ayırt edici sinyal, sınav CRN'lerinin dönemin kendi şubelerinde bulunması.

func donemYaz(t *testing.T, kok, slug string, crns []string) {
	t.Helper()
	dir := filepath.Join(kok, "data", "terms", slug)
	if err := os.MkdirAll(dir, 0o755); err != nil {
		t.Fatal(err)
	}
	govde := "CRN,Ders Kodu\n"
	for _, c := range crns {
		govde += c + ",BLG 101\n"
	}
	// BOM baytla yazilir: gercek all.csv UTF-8 BOM ile baslar.
	ham := append([]byte{0xEF, 0xBB, 0xBF}, []byte(govde)...)
	if err := os.WriteFile(filepath.Join(dir, "all.csv"), ham, 0o644); err != nil {
		t.Fatal(err)
	}
}

func sinavlar(crns ...string) []model.Exam {
	ex := make([]model.Exam, 0, len(crns))
	for _, c := range crns {
		ex = append(ex, model.Exam{CRN: c, Code: "BLG 101", Type: "Final Sınavı"})
	}
	return ex
}

func TestExamCRNOverlap(t *testing.T) {
	kok := t.TempDir()
	st := store.New(kok)

	// Dönemin kendi şubeleri.
	donemYaz(t, kok, "2026-2027-guz", []string{"10001", "10002", "10003", "10004", "10005"})

	t.Run("dönemin kendi takvimi yazılır", func(t *testing.T) {
		oran, olculdu := examCRNOverlap(st, "2026-2027-guz", sinavlar("10001", "10002", "10003", "10004"))
		if !olculdu {
			t.Fatal("ölçüm yapılamadı")
		}
		if oran < examOverlapMin {
			t.Fatalf("örtüşme %.2f, eşiğin (%.2f) altında — doğru takvim engellenirdi", oran, examOverlapMin)
		}
	})

	t.Run("başka dönemin takvimi engellenir", func(t *testing.T) {
		// Yaz finalleri: CRN'ler güz döneminin şubelerinde yok.
		oran, olculdu := examCRNOverlap(st, "2026-2027-guz", sinavlar("30054", "30055", "30056", "30057"))
		if !olculdu {
			t.Fatal("ölçüm yapılamadı")
		}
		if oran >= examOverlapMin {
			t.Fatalf("örtüşme %.2f, eşiğin (%.2f) üstünde — yanlış takvim yazılırdı", oran, examOverlapMin)
		}
	})

	t.Run("dönem dökümü yoksa karar verilmez", func(t *testing.T) {
		// Çağıran bu durumda fail-closed davranır ve sınav dosyası yazmaz.
		if _, olculdu := examCRNOverlap(st, "2099-2100-guz", sinavlar("10001")); olculdu {
			t.Fatal("döküm yokken ölçüm yapıldı sayıldı; koruma yanlışlıkla devreye girer")
		}
	})

	t.Run("sınav listesi boşsa karar verilmez", func(t *testing.T) {
		if _, olculdu := examCRNOverlap(st, "2026-2027-guz", nil); olculdu {
			t.Fatal("boş listede ölçüm yapıldı sayıldı")
		}
	})
}

func TestVerifyExamTermFailsClosed(t *testing.T) {
	kok := t.TempDir()
	st := store.New(kok)

	if _, _, err := verifyExamTerm(st, "2026-2027-guz", sinavlar("10001")); err == nil {
		t.Fatal("dönem dökümü yokken doğrulama başarılı sayıldı")
	}

	donemYaz(t, kok, "2026-2027-guz", []string{"10001", "10002", "10003", "10004"})
	yaz, oran, err := verifyExamTerm(st, "2026-2027-guz", sinavlar("30001", "30002"))
	if err != nil || yaz || oran != 0 {
		t.Fatalf("başka dönem verisi engellenmeliydi: yaz=%v oran=%.2f err=%v", yaz, oran, err)
	}
	yaz, oran, err = verifyExamTerm(st, "2026-2027-guz", sinavlar("10001", "10002"))
	if err != nil || !yaz || oran != 1 {
		t.Fatalf("doğru dönem verisi kabul edilmeliydi: yaz=%v oran=%.2f err=%v", yaz, oran, err)
	}
}
