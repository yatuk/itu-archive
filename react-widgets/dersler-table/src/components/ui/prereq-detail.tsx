import { useMemo, useState } from 'react';

// prereq.js'teki PlanGraph.renderDetail/renderPool'un ürettiği detay panelini
// React'e taşır. Canvas tabanlı akış şeması (düğüm çizimi, sürükle/yakınlaştırma,
// vurgulama) kasten dokunulmadan vanilla'da kalıyor — React'in sanal DOM'u
// piksel çizimine hiçbir değer katmıyor, yalnızca düğüme tıklanınca açılan bu
// DOM tabanlı panel (önşart ağacı / seçmeli havuz listesi) taşınıyor.
// Önşart ağacı (renderReqTree) zaten test edilmiş, saf bir HTML üreticisi —
// burada tekrar yazılmadı, hazır HTML parçası olarak geliyor (dersler-table.tsx
// ile aynı "pre-rendered HTML props" deseni). Mevcut .pg-* sınıfları aynen
// kullanılıyor — görsel birebir korunuyor, yeni CSS gerekmiyor.

export interface PrereqCourseDetailData {
  kind: 'course';
  code: string;
  name: string;
  prereqTreeHTML: string | null;
  required: string[];
  dependents: string[];
  source: { verifiedLabel: string; verifiedAt: string | null; sourceUrl: string } | null;
}

export interface PrereqPoolStatus {
  open: boolean;
  sectionsCount: number;
  enr: number;
  cap: number;
  last?: string | null;
}

export interface PrereqPoolOption {
  code: string;
  name: string;
}

export interface PrereqPoolDetailData {
  kind: 'pool';
  name: string;
  options: PrereqPoolOption[];
  status: Record<string, PrereqPoolStatus>;
  taken: string[];
}

export type PrereqDetailData = PrereqCourseDetailData | PrereqPoolDetailData | null;

export interface PrereqDetailLabels {
  closeCourseAria: string;
  closePoolAria: string;
  prereqHeading: string;
  noPrereq: string;
  requiredCourses: string;
  requestedBy: string;
  sourceVerification: string;
  openObsRecord: string;
  viewCourseDetail: string;
  electivePool: string;
  poolSearchPlaceholder: string;
  poolSearchAria: string;
  sortAria: string;
  sortByCode: string;
  sortByName: string;
  sortOpenFirst: string;
  sortSeatsFirst: string;
  alternativesWord: string;
  openThisTermWord: string;
  openBadge: string;
  branchUnit: string;
  lastOpenedPrefix: string;
  neverOpened: string;
  courseNameUnavailable: string;
  takenMark: string;
  detailButton: string;
  openInCourses: string;
}

export interface PrereqDetailProps {
  data: PrereqDetailData;
  labels: PrereqDetailLabels;
  onClose: () => void;
  onPanTo: (code: string) => void;
  onOpenCourseDetail: (code: string) => void;
  onOpenInCourses: (code: string) => void;
}

type SortKey = 'code' | 'name' | 'open' | 'cap';

function CourseDetail({ data, labels, onClose, onPanTo, onOpenCourseDetail }: { data: PrereqCourseDetailData; labels: PrereqDetailLabels; onClose: () => void; onPanTo: (code: string) => void; onOpenCourseDetail: (code: string) => void }) {
  return (
    <>
      <div className="pg-detail-head"><h3>{data.code} <span>{data.name || ''}</span></h3><button type="button" className="pg-detail-close" aria-label={labels.closeCourseAria} onClick={onClose}>×</button></div>
      {data.prereqTreeHTML
        ? <><h4>{labels.prereqHeading}</h4><ul className="req-tree" dangerouslySetInnerHTML={{ __html: data.prereqTreeHTML }} /></>
        : <p className="pg-empty">{labels.noPrereq}</p>}
      {data.required.length > 0 && (
        <>
          <h4>{labels.requiredCourses} ({data.required.length})</h4>
          <div className="pg-chips">{data.required.map((code, i) => <button className="pg-chip stagger-in" style={{ animationDelay: `${Math.min(i * 30, 180)}ms` }} key={code} onClick={() => onPanTo(code)}>{code}</button>)}</div>
        </>
      )}
      {data.dependents.length > 0 && (
        <>
          <h4>{labels.requestedBy} ({data.dependents.length})</h4>
          <div className="pg-chips">{data.dependents.map((code, i) => <button className="pg-chip stagger-in" style={{ animationDelay: `${Math.min(i * 30, 180)}ms` }} key={code} onClick={() => onPanTo(code)}>{code}</button>)}</div>
        </>
      )}
      {data.source && (
        <div className="pg-source">
          <b>{labels.sourceVerification}</b>
          <span>{data.source.verifiedLabel}{data.source.verifiedAt ? ` · ${data.source.verifiedAt}` : ''}</span>
          <a href={data.source.sourceUrl} target="_blank" rel="noopener">{labels.openObsRecord}</a>
        </div>
      )}
      <button type="button" className="btn-ghost pg-detail-open" onClick={() => onOpenCourseDetail(data.code)}>{labels.viewCourseDetail}</button>
    </>
  );
}

function PoolDetail({ data, labels, onClose, onOpenCourseDetail, onOpenInCourses }: { data: PrereqPoolDetailData; labels: PrereqDetailLabels; onClose: () => void; onOpenCourseDetail: (code: string) => void; onOpenInCourses: (code: string) => void }) {
  const [query, setQuery] = useState('');
  const [sortKey, setSortKey] = useState<SortKey>('code');

  const groups = useMemo(() => {
    const fold = (s: string) => s.toLocaleLowerCase('tr').normalize('NFD').replace(/[̀-ͯ]/g, '');
    const f = fold(query.trim());
    let list = data.options;
    if (f) list = list.filter((o) => fold(`${o.code} ${o.name}`).includes(f));
    const seat = (code: string) => {
      const s = data.status[code];
      return s && s.open && s.cap > 0 ? s.cap - s.enr : -1;
    };
    const order: Record<SortKey, (a: PrereqPoolOption, b: PrereqPoolOption) => number> = {
      code: (a, b) => a.code.localeCompare(b.code),
      name: (a, b) => a.name.localeCompare(b.name, 'tr') || a.code.localeCompare(b.code),
      open: (a, b) => {
        const oa = data.status[a.code]?.open ? 0 : 1;
        const ob = data.status[b.code]?.open ? 0 : 1;
        return oa - ob || a.code.localeCompare(b.code);
      },
      cap: (a, b) => seat(b.code) - seat(a.code) || a.code.localeCompare(b.code),
    };
    list = list.slice().sort(order[sortKey]);
    const byBranch = new Map<string, PrereqPoolOption[]>();
    for (const o of list) {
      const b = o.code.split(' ')[0];
      if (!byBranch.has(b)) byBranch.set(b, []);
      byBranch.get(b)!.push(o);
    }
    return byBranch;
  }, [data.options, data.status, query, sortKey]);

  const takenSet = useMemo(() => new Set(data.taken), [data.taken]);
  const big = data.options.length > 30;
  const openCount = Object.values(data.status).filter((s) => s.open).length;

  return (
    <>
      <div className="pg-detail-head"><h3>{data.name} <span>{labels.electivePool}</span></h3><button type="button" className="pg-detail-close" aria-label={labels.closePoolAria} onClick={onClose}>×</button></div>
      <div className="pg-pool-head">
        <input type="search" className="pg-pool-search" placeholder={labels.poolSearchPlaceholder} aria-label={labels.poolSearchAria} value={query} onChange={(e) => setQuery(e.target.value)} />
        <select className="pg-pool-sort" aria-label={labels.sortAria} value={sortKey} onChange={(e) => setSortKey(e.target.value as SortKey)}>
          <option value="code">{labels.sortByCode}</option>
          <option value="name">{labels.sortByName}</option>
          <option value="open">{labels.sortOpenFirst}</option>
          <option value="cap">{labels.sortSeatsFirst}</option>
        </select>
      </div>
      <p className="pg-pool-status">{data.options.length} {labels.alternativesWord} · {openCount} {labels.openThisTermWord}</p>
      <div className="pg-pool-groups">
        {[...groups].map(([branch, items]) => (
          <details className="pg-pool-group" key={branch} open={!big}>
            <summary>{branch} <span>{items.length}</span></summary>
            {items.map((o, i) => {
              const st = data.status[o.code];
              const taken = takenSet.has(o.code);
              return (
                <div className={`pg-pool-row stagger-in${taken ? ' pg-pool-taken' : ''}`} style={{ animationDelay: `${Math.min(i * 25, 200)}ms` }} key={o.code}>
                  <div className="pg-pool-name"><b>{o.code}</b><em title={o.name}>{o.name || labels.courseNameUnavailable}</em></div>
                  <span className="pg-pool-status-badge">
                    {taken && <span className="taken-mark">{labels.takenMark}</span>}
                    {!st
                      ? <span className="loading">…</span>
                      : st.open
                        ? <span className="open">● {labels.openBadge} · {st.sectionsCount} {labels.branchUnit} · {st.enr}/{st.cap || '·'}</span>
                        : <span className="closed">● {st.last ? `${labels.lastOpenedPrefix} ${st.last}` : labels.neverOpened}</span>}
                  </span>
                  <span className="pg-pool-actions">
                    <button data-act="detay" data-code={o.code} onClick={() => onOpenCourseDetail(o.code)}>{labels.detailButton}</button>
                    <button data-act="courses" data-code={o.code} onClick={() => onOpenInCourses(o.code)}>{labels.openInCourses}</button>
                  </span>
                </div>
              );
            })}
          </details>
        ))}
      </div>
    </>
  );
}

export function PrereqDetail({ data, labels, onClose, onPanTo, onOpenCourseDetail, onOpenInCourses }: PrereqDetailProps) {
  if (!data) return null;
  if (data.kind === 'course') return <CourseDetail data={data} labels={labels} onClose={onClose} onPanTo={onPanTo} onOpenCourseDetail={onOpenCourseDetail} />;
  return <PoolDetail data={data} labels={labels} onClose={onClose} onOpenCourseDetail={onOpenCourseDetail} onOpenInCourses={onOpenInCourses} />;
}
