package main

import (
	"fmt"
	"os"
	"path/filepath"
	"strings"

	"github.com/tdewolff/minify/v2"
	"github.com/tdewolff/minify/v2/css"
	"github.com/tdewolff/minify/v2/js"
)

// minifyAssets, assets-src/ altındaki elle yazılan CSS/JS kaynağını
// küçültülmüş haliyle <out>/assets/ altına yazar. docs/assets/*.js ve
// style.css artık üretilen çıktıdır — kaynak olarak elle düzenlenmez
// (repo kökündeki assets-src/ düzenlenir). Vendor fontlar ve
// core.test.js (Node'un doğrudan çalıştırdığı test dosyası, tarayıcıya
// hiç gitmez) bu adımın dışında, docs/assets altında olduğu gibi kalır.
func minifyAssets(srcDir, outAssetsDir string) error {
	m := minify.New()
	m.AddFunc("text/css", css.Minify)
	m.AddFunc("application/javascript", js.Minify)

	return filepath.WalkDir(srcDir, func(path string, d os.DirEntry, err error) error {
		if err != nil {
			return err
		}
		if d.IsDir() {
			return nil
		}
		ext := strings.ToLower(filepath.Ext(path))
		if ext != ".js" && ext != ".css" {
			return nil
		}
		rel, err := filepath.Rel(srcDir, path)
		if err != nil {
			return err
		}
		in, err := os.ReadFile(path)
		if err != nil {
			return err
		}
		mimetype := "text/css"
		if ext == ".js" {
			mimetype = "application/javascript"
		}
		out, err := m.Bytes(mimetype, in)
		if err != nil {
			return fmt.Errorf("%s küçültülemedi: %w", rel, err)
		}
		dst := filepath.Join(outAssetsDir, rel)
		if err := os.MkdirAll(filepath.Dir(dst), 0o755); err != nil {
			return err
		}
		return os.WriteFile(dst, out, 0o644)
	})
}
