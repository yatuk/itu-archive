// Command validate, docs/data altındaki üretilmiş veriyi bütünlük açısından
// denetler. Workflow'a eklenebilir: hatalar varsa sıfırdan farklı kodla çıkar
// ve kazıyıcının sessizce bozuk veri yazmasını önler.
//
//	go run ./cmd/validate            # docs/ üzerinde
//	go run ./cmd/validate -out docs
package main

import (
	"flag"
	"fmt"
	"os"

	"itu-scraper/internal/validate"
)

func main() {
	out := flag.String("out", "docs", "veri kök dizini")
	flag.Parse()

	res := validate.All(*out)

	for _, w := range res.Warnings {
		fmt.Fprintf(os.Stderr, "· uyarı: %s\n", w)
	}
	for _, e := range res.Errors {
		fmt.Fprintf(os.Stderr, "· hata: %s\n", e)
	}

	logf("%d hata, %d uyarı", len(res.Errors), len(res.Warnings))
	if len(res.Errors) > 0 {
		os.Exit(1)
	}
}

func logf(format string, args ...any) {
	fmt.Fprintf(os.Stderr, "· "+format+"\n", args...)
}
