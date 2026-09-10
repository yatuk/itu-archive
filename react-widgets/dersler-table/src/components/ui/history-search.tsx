// history.js'teki arama sonuçlarını / boş sorgudaki keşif kısayollarını
// React'e taşır. Eşleştirme (searchMatch), en çok açılan ders/hoca sıralaması
// (topByCount) ve veri yükleme tamamen vanilla tarafta kalır — bu bileşen
// yalnızca hazır çip listesini çizer ve tıklamayı geri bildirir. Mevcut
// .chip/.chips/.mh/.h-disc sınıfları aynen kullanılıyor (görsel birebir
// korunuyor, yeni CSS gerekmiyor).
export interface HistoryChip {
  key: string;
  kind: 'course' | 'person';
  code?: string;
  name: string;
  sub: string;
  branch?: string;
  bucket?: string;
}

export interface HistorySearchProps {
  mode: 'discovery' | 'results' | 'empty';
  intro?: string;
  courseSectionLabel: string;
  instructorSectionLabel: string;
  courses: HistoryChip[];
  people: HistoryChip[];
  emptyMessage: string;
  onSelect: (chip: HistoryChip) => void;
}

function ChipRow({ headingClass, label, chips, onSelect }: { headingClass: string; label: string; chips: HistoryChip[]; onSelect: (chip: HistoryChip) => void }) {
  if (!chips.length) return null;
  return (
    <>
      <h3 className={headingClass}>{label}</h3>
      <div className="chips">
        {chips.map((chip, index) => (
          <button type="button" className="chip stagger-in" style={{ animationDelay: `${Math.min(index * 30, 240)}ms` }} key={chip.key} onClick={() => onSelect(chip)}>
            <b>{chip.code || chip.name}</b>
            {chip.code && <span>{chip.name}</span>}
            <em>{chip.sub}</em>
          </button>
        ))}
      </div>
    </>
  );
}

export function HistorySearch({ mode, intro, courseSectionLabel, instructorSectionLabel, courses, people, emptyMessage, onSelect }: HistorySearchProps) {
  if (mode === 'empty') return <p className="empty">{emptyMessage}</p>;
  const headingClass = mode === 'discovery' ? 'h-disc' : 'mh';
  return (
    <>
      {intro && <p className="h-intro">{intro}</p>}
      <ChipRow headingClass={headingClass} label={courseSectionLabel} chips={courses} onSelect={onSelect} />
      <ChipRow headingClass={headingClass} label={instructorSectionLabel} chips={people} onSelect={onSelect} />
    </>
  );
}
