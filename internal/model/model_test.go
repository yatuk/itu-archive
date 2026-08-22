package model

import (
	"encoding/json"
	"testing"
)

func TestMetadataIsBackwardCompatible(t *testing.T) {
	var old TermMeta
	if err := json.Unmarshal([]byte(`{"term":"Eski","sections":12}`), &old); err != nil {
		t.Fatal(err)
	}
	if old.SchemaVersion != 0 || old.Provenance.LastSuccessfulAt != "" || old.Sections != 12 {
		t.Fatalf("eski metadata uyumluluğu bozuldu: %+v", old)
	}
}
