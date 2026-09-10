import { CalendarDays, CircleDashed, Download, FileJson } from 'lucide-react';

// terms.js'teki dönem listesini (yalnızca index.json'a bağlı, saf render)
// React'e taşır. Etiket lokalizasyonu, bilinen arşiv boşlukları ve tarih
// biçimlendirmesi vanilla tarafta (tek kaynak) kalır — bu bileşen yalnızca
// hazır veriyi kart ızgarası olarak çizer.
export interface TermCardData {
  key: string;
  label: string;
  live?: boolean;
  missing?: boolean;
  missingReason?: string;
  meta?: string;
  warn?: string;
  csvHref?: string;
  metaHref?: string;
}

export interface TermsGridProps {
  terms: TermCardData[];
  labels: { csv: string; metaJson: string; live: string };
}

export function TermsGrid({ terms, labels }: TermsGridProps) {
  return (
    <div className="tg-grid">
      {terms.map((term, index) => (
        <article
          className={`tg-card reveal${term.missing ? ' is-missing' : ''}`}
          key={term.key}
          style={{ transitionDelay: `${Math.min(index, 12) * 25}ms` }}
        >
          <div className="tg-icon" aria-hidden="true">{term.missing ? <CircleDashed /> : <CalendarDays />}</div>
          <div className="tg-body">
            <h3>{term.label}{term.live && <span className="tg-badge is-live">{labels.live}</span>}</h3>
            {term.missing
              ? <p className="tg-meta">{term.missingReason}</p>
              : <>
                  <p className="tg-meta">{term.meta}</p>
                  {term.warn && <p className="tg-meta is-warn">{term.warn}</p>}
                </>}
          </div>
          {!term.missing && term.csvHref && term.metaHref && (
            <div className="tg-links">
              <a className="tg-link" href={term.csvHref} download><Download aria-hidden="true" />{labels.csv}</a>
              <a className="tg-link" href={term.metaHref}><FileJson aria-hidden="true" />{labels.metaJson}</a>
            </div>
          )}
        </article>
      ))}
    </div>
  );
}
