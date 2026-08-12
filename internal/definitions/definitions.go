// Package definitions, OBS "Genel Tanımlamalar" uçlarından resmî referans
// verisini çeker: bina kodları (kod → ad) ve program kodları (seviye başına).
//
//	GenelTanimlamalar/BinaKodlariList                          → sunucu tarafı tablo
//	GenelTanimlamalar/ProgramKodlariList/ProgramKodlariListSearch?programSeviyeTipiId=N → AJAX tablosu
//
// Bina kodu eşleşmesi "Bina: undeclared" sorununu çözer (utils.js buildingOf);
// program kodları resmî seviye/ikinci-öğretim ayrımını getirir (tahmin kalkar).
package definitions

import (
	"context"
	"fmt"
	"html"
	"regexp"
	"strings"

	"itu-scraper/internal/fetch"
)

const (
	binaURL    = "https://obs.itu.edu.tr/public/GenelTanimlamalar/BinaKodlariList"
	programURL = "https://obs.itu.edu.tr/public/GenelTanimlamalar/ProgramKodlariList/ProgramKodlariListSearch"
)

// Building, tek bir bina kodu kaydı.
type Building struct {
	Code string `json:"code"`
	Name string `json:"name"`
}

// Program, tek bir resmî program kodu kaydı. Seviye, programSeviyeTipiId'dir:
// 1 önlisans, 2 lisans, 3 lisansüstü, 5 ikinci öğretim (yüksek lisans).
type Program struct {
	Code  string `json:"code"`
	Name  string `json:"name"`
	Level int    `json:"level"`
}

type Client struct{ f *fetch.Client }

func New(f *fetch.Client) *Client { return &Client{f: f} }

var (
	rowRe  = regexp.MustCompile(`(?is)<tr[^>]*>(.*?)</tr>`)
	cellRe = regexp.MustCompile(`(?is)<t[dh][^>]*>(.*?)</t[dh]>`)
	tagRe  = regexp.MustCompile(`(?s)<[^>]*>`)
	spRe   = regexp.MustCompile(`\s+`)
)

func clean(s string) string {
	s = tagRe.ReplaceAllString(s, " ")
	s = html.UnescapeString(s)
	return strings.TrimSpace(spRe.ReplaceAllString(s, " "))
}

// Buildings, bina kodları tablosunu çözer (sunucu tarafı, tek istek).
func (c *Client) Buildings(ctx context.Context) ([]Building, error) {
	body, err := c.f.Text(ctx, binaURL)
	if err != nil {
		return nil, err
	}
	return ParseBuildings(body)
}

// ParseBuildings, bina kodları sayfasının tablo satırlarını çözer. Saf — testli.
func ParseBuildings(body string) ([]Building, error) {
	var out []Building
	for _, m := range rowRe.FindAllStringSubmatch(body, -1) {
		cells := cellRe.FindAllStringSubmatch(m[1], -1)
		if len(cells) < 2 {
			continue
		}
		code, name := clean(cells[0][1]), clean(cells[1][1])
		if code == "" || name == "" {
			continue
		}
		out = append(out, Building{Code: code, Name: name})
	}
	if len(out) == 0 {
		return nil, fmt.Errorf("bina tablosu boş — sayfa yapısı değişmiş olabilir")
	}
	return out, nil
}

// Programs, verilen seviye kimlikleri için program kodlarını çeker. Her seviye
// tek bir arama isteğidir; seviye değeri kayıtlara taşınır.
func (c *Client) Programs(ctx context.Context, levels []int) ([]Program, error) {
	var out []Program
	for _, lv := range levels {
		body, err := c.f.Text(ctx, fmt.Sprintf("%s?programSeviyeTipiId=%d", programURL, lv))
		if err != nil {
			return nil, err
		}
		ps, err := ParsePrograms(body, lv)
		if err != nil {
			return nil, err
		}
		out = append(out, ps...)
	}
	return out, nil
}

// ParsePrograms, program kodları arama sayfasının tablo satırlarını çözer.
// Tablo seviye başlıkları (tek hücre) + kod/ad satırlarından oluşur. Saf — testli.
func ParsePrograms(body string, level int) ([]Program, error) {
	var out []Program
	for _, m := range rowRe.FindAllStringSubmatch(body, -1) {
		cells := cellRe.FindAllStringSubmatch(m[1], -1)
		if len(cells) < 2 {
			continue
		}
		code, name := clean(cells[0][1]), clean(cells[1][1])
		if code == "" || name == "" {
			continue
		}
		out = append(out, Program{Code: code, Name: name, Level: level})
	}
	return out, nil
}
