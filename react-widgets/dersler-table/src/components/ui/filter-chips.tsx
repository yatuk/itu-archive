import { X } from 'lucide-react';

// courses.js'in #chips altındaki düz "label: value ✕" metin çipleri yerine;
// Tremor'un Filter Badge bileşeninden esinlenen, etiket/değeri ayıran ve
// yuvarlak bir kaldır düğmesi taşıyan sürüm. İş kuralı (hangi filtrenin aktif
// olduğu, kaldırınca hangi alanın temizleneceği) tamamen courses.js'te kalır
// — bu bileşen yalnızca hazır veriyi çizer ve tıklamayı geri bildirir.
export interface FilterChipData {
  key: string;
  label?: string;
  value?: string;
  text?: string;
}

export interface FilterChipsProps {
  termLabel: string;
  chips: FilterChipData[];
  emptyMessage: string | null;
  removeLabel: string;
  onRemove: (key: string) => void;
}

export function FilterChips({ termLabel, chips, emptyMessage, removeLabel, onRemove }: FilterChipsProps) {
  return (
    <>
      <span className="fc-term">{termLabel}</span>
      {chips.map((chip, index) => (
        <span className="fc-pill stagger-in" style={{ animationDelay: `${Math.min(index * 40, 200)}ms` }} key={chip.key}>
          {chip.value !== undefined ? (
            <>
              <span className="fc-label">{chip.label}</span>
              <span className="fc-divider" aria-hidden="true" />
              <span className="fc-value">{chip.value}</span>
            </>
          ) : (
            <span className="fc-value">{chip.text}</span>
          )}
          <button type="button" className="fc-x" data-key={chip.key} aria-label={removeLabel} title={removeLabel} onClick={() => onRemove(chip.key)}>
            <X aria-hidden="true" />
          </button>
        </span>
      ))}
      {emptyMessage && <p className="filter-help">{emptyMessage}</p>}
    </>
  );
}
