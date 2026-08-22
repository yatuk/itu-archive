package validate

import "testing"

func TestCheckPartialRequiresConsistentDeterministicProvenance(t *testing.T) {
	tests := []struct {
		name    string
		partial bool
		failed  []string
		wantErr int
	}{
		{"tam", false, nil, 0},
		{"kısmi ve sıralı", true, []string{"BLG: timeout", "MAT: 500"}, 0},
		{"hata kaydı gizlenmiş", false, []string{"BLG: timeout"}, 1},
		{"partial sebepsiz", true, nil, 1},
		{"sırasız", true, []string{"MAT: 500", "BLG: timeout"}, 1},
		{"yinelenen", true, []string{"BLG: timeout", "BLG: timeout"}, 1},
	}
	for _, tc := range tests {
		t.Run(tc.name, func(t *testing.T) {
			r := &Result{}
			r.checkPartial("test", tc.partial, tc.failed)
			if len(r.Errors) != tc.wantErr {
				t.Fatalf("%d hata bekleniyordu, %d geldi: %v", tc.wantErr, len(r.Errors), r.Errors)
			}
		})
	}
}
