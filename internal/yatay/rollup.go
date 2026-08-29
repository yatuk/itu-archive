package yatay

import "sort"

// YearEntry, bir programın tek bir yıldaki sonucu (rollup için — Result'ın
// program/kod alanları zaten dosya adında, tekrar taşınmıyor).
type YearEntry struct {
	Term    string      `json:"term"`
	Metric  Metric      `json:"metric"`
	Results []SemResult `json:"results"`
}

// SemResult, tek bir yarıyılın (3. veya 5.) taban/tavanı.
type SemResult struct {
	Semester int      `json:"semester"`
	Quota    int      `json:"quota,omitempty"`
	Placed   int      `json:"placed"`
	Ceiling  *float64 `json:"ceiling,omitempty"`
	Floor    *float64 `json:"floor,omitempty"`
}

// ProgramRollup, tek bir programın tüm yıllardaki geçmişi — frontend'in tek
// istekte alacağı dosya (bkz. cmd/yatay: docs/data/yatay/by-program/<kod>.json).
type ProgramRollup struct {
	ProgramCode string      `json:"programCode"`
	Program     string      `json:"program"` // en güncel yıldaki görünen ad
	Faculty     string      `json:"faculty"`
	Years       []YearEntry `json:"years"`
}

// BuildRollups, taranmış yılları programCode'a göre gruplar. Yalnızca eşleşmiş
// (programCode dolu) kayıtlar dahil — KKTC/UOLP/belirsiz adlar hiçbir arşiv
// koduna bağlanmadığından rollup'ta zaten yer alamaz (bkz. match.go).
// Terms, Terms alanındaki sırayla (kronolojik) verilmelidir.
func BuildRollups(terms []*Term) map[string]*ProgramRollup {
	out := map[string]*ProgramRollup{}
	for _, term := range terms {
		byCode := map[string][]SemResult{}
		nameOf := map[string]string{}
		facultyOf := map[string]string{}
		for _, r := range term.Results {
			if r.ProgramCode == "" {
				continue
			}
			byCode[r.ProgramCode] = append(byCode[r.ProgramCode], SemResult{
				Semester: r.Semester, Quota: r.Quota, Placed: r.Placed, Ceiling: r.Ceiling, Floor: r.Floor,
			})
			nameOf[r.ProgramCode] = r.Program
			facultyOf[r.ProgramCode] = r.Faculty
		}
		for code, sems := range byCode {
			sort.Slice(sems, func(i, j int) bool { return sems[i].Semester < sems[j].Semester })
			rollup := out[code]
			if rollup == nil {
				rollup = &ProgramRollup{ProgramCode: code}
				out[code] = rollup
			}
			rollup.Program = nameOf[code] // her yılda güncelleniyor, en son (en güncel) yıl kazanır
			rollup.Faculty = facultyOf[code]
			rollup.Years = append(rollup.Years, YearEntry{Term: term.Term, Metric: term.Metric, Results: sems})
		}
	}
	return out
}
