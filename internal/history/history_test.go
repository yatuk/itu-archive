package history

import "testing"

func TestBucket(t *testing.T) {
	cases := []struct{ in, want string }{
		{"Fatih", "f"},
		{"Öztürk", "o"},   // Türkçe harfler ASCII'ye katlanır
		{"Şahin", "s"},
		{"Çelik", "c"},
		{"12345", "0"},
		{"---", "_"},
		{"Zeynep Günay", "z"},
	}
	for _, c := range cases {
		if got := Bucket(c.in); got != c.want {
			t.Errorf("Bucket(%q) = %q, want %q", c.in, got, c.want)
		}
	}
}
