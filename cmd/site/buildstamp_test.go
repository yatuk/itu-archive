package main

import (
	"encoding/json"
	"os"
	"path/filepath"
	"testing"
)

func writeTree(t *testing.T, root string, files map[string]string) {
	t.Helper()
	for rel, body := range files {
		p := filepath.Join(root, filepath.FromSlash(rel))
		if err := os.MkdirAll(filepath.Dir(p), 0o755); err != nil {
			t.Fatal(err)
		}
		if err := os.WriteFile(p, []byte(body), 0o644); err != nil {
			t.Fatal(err)
		}
	}
}

func TestBuildStampDeterministicAndContentBound(t *testing.T) {
	root := t.TempDir()
	writeTree(t, root, map[string]string{
		"index.html":       "<h1>x</h1>",
		"data/status.json": `{"a":1}`,
		"assets/app.js":    "export {}",
	})
	first, err := writeBuildStamp(root)
	if err != nil {
		t.Fatal(err)
	}
	if len(first.Build) != buildStampLen || first.Files != 3 {
		t.Fatalf("damga: %+v", first)
	}

	// build.json kendisi ve nokta dosyaları damgayı etkilemez; ikinci koşu aynı sonucu verir.
	writeTree(t, root, map[string]string{".DS_Store": "junk", ".cache/x": "y"})
	again, err := writeBuildStamp(root)
	if err != nil {
		t.Fatal(err)
	}
	if again != first {
		t.Fatalf("aynı ağaç farklı damga verdi: %+v != %+v", again, first)
	}
	var onDisk buildStamp
	b, err := os.ReadFile(filepath.Join(root, buildStampFile))
	if err != nil {
		t.Fatal(err)
	}
	if err := json.Unmarshal(b, &onDisk); err != nil || onDisk != first {
		t.Fatalf("build.json içeriği: %s (%v)", b, err)
	}

	// Yalnız veri dosyası değişse bile damga değişmeli (yayın farklı).
	writeTree(t, root, map[string]string{"data/status.json": `{"a":2}`})
	changed, err := computeBuildStamp(root)
	if err != nil {
		t.Fatal(err)
	}
	if changed.Build == first.Build {
		t.Fatal("veri değişikliği damgayı değiştirmedi")
	}

	// Dosya adı değişikliği de damgayı değiştirmeli.
	if err := os.Rename(filepath.Join(root, "index.html"), filepath.Join(root, "index2.html")); err != nil {
		t.Fatal(err)
	}
	renamed, err := computeBuildStamp(root)
	if err != nil {
		t.Fatal(err)
	}
	if renamed.Build == changed.Build {
		t.Fatal("yeniden adlandırma damgayı değiştirmedi")
	}
}
