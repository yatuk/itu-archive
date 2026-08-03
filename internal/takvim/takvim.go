// Package takvim, takvim.sis.itu.edu.tr üzerindeki akademik takvim tablolarını çeker.
//
// Sayfa AkademikTakvimTablo.php ve query parametreleriyle filtreleniyor:
//
//	akademikyil = 854 (2026-2027), 564 (2025-2026), 2 (2024-2025), 297 (2023-2024)
//	takvimadi   = 15 Lisans/Önlisans, 19 Lisansüstü, 21 Yaz Öğretimi, ...
//
// Parametresiz çağrıda o yılın tüm tabloları (7 adet) tek sayfada dönüyor;
// arşiv için bu yeterli.
package takvim

import (
	"context"
	"fmt"
	"html"
	"regexp"
	"strings"
	"time"

	"itu-scraper/internal/fetch"
	"itu-scraper/internal/model"
)

const base = "https://www.takvim.sis.itu.edu.tr/AkademikTakvim/TR/akademik-takvim/AkademikTakvimTablo.php"

type Client struct{ f *fetch.Client }

func New(f *fetch.Client) *Client { return &Client{f: f} }

type Year struct {
	ID    string
	Label string
}

var (
	yearSelectRe = regexp.MustCompile(`(?is)<select[^>]*name="akademikyil".*?</select>`)
	optionRe     = regexp.MustCompile(`(?is)<option value="([^"]*)"[^>]*>(.*?)</option>`)
	tableRe      = regexp.MustCompile(`(?is)<table[^>]*>(.*?)</table>`)
	rowRe        = regexp.MustCompile(`(?is)<tr[^>]*>(.*?)</tr>`)
	cellRe       = regexp.MustCompile(`(?is)<t[dh][^>]*>(.*?)</t[dh]>`)
	tagRe        = regexp.MustCompile(`(?s)<[^>]*>`)
	spaceRe      = regexp.MustCompile(`\s+`)
)

// Years, takvim sayfasındaki akademik yıl seçeneklerini döndürür ("arsiv" hariç).
func (c *Client) Years(ctx context.Context) ([]Year, error) {
	body, err := c.f.Text(ctx, base)
	if err != nil {
		return nil, err
	}
	sel := yearSelectRe.FindString(body)
	if sel == "" {
		return nil, fmt.Errorf("akademikyil seçim kutusu bulunamadı — sayfa yapısı değişmiş olabilir")
	}
	var years []Year
	for _, m := range optionRe.FindAllStringSubmatch(sel, -1) {
		id, label := m[1], clean(m[2])
		if id == "" || id == "arsiv" || label == "" {
			continue
		}
		years = append(years, Year{ID: id, Label: label})
	}
	if len(years) == 0 {
		return nil, fmt.Errorf("hiç akademik yıl bulunamadı")
	}
	return years, nil
}

// Fetch, bir akademik yılın tüm takvim satırlarını çeker.
func (c *Client) Fetch(ctx context.Context, y Year) (*model.Calendar, error) {
	body, err := c.f.Text(ctx, base+"?akademikyil="+y.ID)
	if err != nil {
		return nil, err
	}
	cal := &model.Calendar{
		Year:      y.Label,
		YearID:    y.ID,
		ScrapedAt: time.Now().UTC().Format(time.RFC3339),
		Events:    []model.CalendarEvent{},
	}
	for _, t := range tableRe.FindAllStringSubmatch(body, -1) {
		rows := rowRe.FindAllStringSubmatch(t[1], -1)
		if len(rows) < 2 {
			continue
		}
		// İlk satır başlık: [bölüm adı, "Tarih", "Kalan Gün"]
		head := cells(rows[0][1])
		if len(head) != 3 || !strings.Contains(head[1], "Tarih") {
			continue // sayfadaki menü/yerleşim tabloları
		}
		section := head[0]
		for _, r := range rows[1:] {
			cs := cells(r[1])
			if len(cs) != 3 || cs[0] == "" {
				continue
			}
			cal.Events = append(cal.Events, model.CalendarEvent{
				Table:     section,
				Title:     cs[0],
				Date:      cs[1],
				Remaining: cs[2],
			})
		}
	}
	if len(cal.Events) == 0 {
		return nil, fmt.Errorf("%s: takvimde hiç satır bulunamadı", y.Label)
	}
	return cal, nil
}

func cells(row string) []string {
	ms := cellRe.FindAllStringSubmatch(row, -1)
	out := make([]string, 0, len(ms))
	for _, m := range ms {
		out = append(out, clean(m[1]))
	}
	return out
}

func clean(s string) string {
	s = tagRe.ReplaceAllString(s, " ")
	s = html.UnescapeString(s)
	s = strings.ReplaceAll(s, " ", " ")
	return strings.TrimSpace(spaceRe.ReplaceAllString(s, " "))
}
