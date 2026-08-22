package main

import "testing"

func TestPartialGateBoundary(t *testing.T) {
	if err := partialGate(21, []string{"BLG: timeout"}); err != nil {
		t.Fatalf("%%5 altı kısmi tarama kabul edilmeliydi: %v", err)
	}
	if err := partialGate(20, []string{"BLG: timeout"}); err == nil {
		t.Fatal("tam %%5 hata oranı yayın kapısını geçti")
	}
	if err := partialGate(0, []string{"BLG: timeout"}); err == nil {
		t.Fatal("boş branş listesi başarılı sayıldı")
	}
	if err := partialGate(0, nil); err != nil {
		t.Fatalf("hatasız boş girdi gereksiz yere reddedildi: %v", err)
	}
}
