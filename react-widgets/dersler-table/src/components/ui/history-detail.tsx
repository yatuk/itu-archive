// history.js'teki ders/hoca ayrıntı kartını React'e taşır. Dönem gruplama,
// trend grafiği (SVG string, core/chart.js trendChart) ve doluluk çubuğu
// (fillBar) zaten test edilmiş vanilla yardımcılardır — burada tekrar
// yazılmadı, hazır HTML parçası olarak props'tan geliyor (dersler-table.tsx
// ile aynı "pre-rendered HTML props" deseni).
export interface HistoryCourseRow {
  key: string;
  termLabel: string;
  instructor: string;
  days: string;
  cap: number;
  enr: number;
  fillHTML: string;
}

export interface HistoryCourseDetailData {
  kind: 'course';
  code: string;
  name: string;
  openedText: string;
  seasonsLabel: string;
  rhythm: string;
  trendHTML: string;
  rows: HistoryCourseRow[];
}

export interface HistoryPersonRow {
  key: string;
  code: string;
  name: string;
  termCount: number;
  terms: string;
}

export interface HistoryPersonDetailData {
  kind: 'person';
  name: string;
  meta: string;
  rows: HistoryPersonRow[];
}

export interface HistoryDetailProps {
  data: HistoryCourseDetailData | HistoryPersonDetailData | null;
  labels: {
    detailButton: string;
    colTerm: string;
    colInstructor: string;
    colDay: string;
    colCap: string;
    colEnr: string;
    colFill: string;
    colCode: string;
    colName: string;
    colTermCount: string;
    colTerms: string;
  };
  onOpenCourseDetail: (code: string) => void;
}

export function HistoryDetail({ data, labels, onOpenCourseDetail }: HistoryDetailProps) {
  if (!data) return null;
  if (data.kind === 'course') {
    return (
      <article className="hcard reveal">
        <h3>{data.code} <span>{data.name}</span></h3>
        <p className="meta">
          {data.openedText} · {data.seasonsLabel} {data.rhythm}
          <button type="button" className="btn-ghost h-detail" onClick={() => onOpenCourseDetail(data.code)}>{labels.detailButton}</button>
        </p>
        <div dangerouslySetInnerHTML={{ __html: data.trendHTML }} />
        <div className="tablewrap">
          <table className="htable" aria-label={`${data.code} ${labels.colTerm}`}>
            <thead><tr><th>{labels.colTerm}</th><th>{labels.colInstructor}</th><th>{labels.colDay}</th><th className="num">{labels.colCap}</th><th className="num">{labels.colEnr}</th><th className="num quota-legacy-col">{labels.colFill}</th></tr></thead>
            <tbody>
              {data.rows.map((row) => (
                <tr key={row.key}>
                  <td>{row.termLabel}</td>
                  <td>{row.instructor || '·'}</td>
                  <td className="when">{row.days || '·'}</td>
                  <td className="num">{row.cap}</td>
                  <td className="num">{row.enr}</td>
                  <td className="num quota-legacy-col" dangerouslySetInnerHTML={{ __html: row.fillHTML }} />
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </article>
    );
  }
  return (
    <article className="hcard reveal">
      <h3>{data.name}</h3>
      <p className="meta">{data.meta}</p>
      <div className="tablewrap">
        <table className="htable" aria-label={`${data.name} ${labels.colName}`}>
          <thead><tr><th>{labels.colCode}</th><th>{labels.colName}</th><th className="num">{labels.colTermCount}</th><th>{labels.colTerms}</th></tr></thead>
          <tbody>
            {data.rows.map((row) => (
              <tr key={row.code}>
                <td><b>{row.code}</b></td>
                <td>{row.name}</td>
                <td className="num">{row.termCount}</td>
                <td className="when">{row.terms}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </article>
  );
}
