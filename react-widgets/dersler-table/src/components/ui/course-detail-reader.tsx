import { useState, type KeyboardEvent } from 'react';
import { BookOpen, Building2, CalendarRange, ChevronDown, Clock3, ExternalLink, FileClock, GitBranch, GraduationCap, History, Layers3, LibraryBig, Plus, Route, UserRound, UsersRound } from 'lucide-react';

export interface CourseDetailPanel { key: string; label: string; count?: number; html: string; beforeHtml?: string; afterHtml?: string }
export interface CourseDetailSection {
  crn: string; instructors: string[]; quota: string; note?: string; meta?: string; sessions: string[];
  rules?: Array<{ label: string; value: string }>; focus?: boolean; special?: 'extra-exam' | 'graduation' | '';
}
export interface CourseDetailHistoryTerm {
  slug: string; label: string; shortLabel: string; season: string; capacity: number; enrolled: number; fill: number;
  rows: Array<{ instructor: string; capacity: number; enrolled: number; fill: number }>;
}
export interface CourseDetailHistory {
  heading: string; caption: string; empty?: string; terms: CourseDetailHistoryTerm[]; recordCount: number;
  labels: { capacity: string; enrolled: string; records: string; showAll: string; showRecent: string; full: string };
}
export interface CourseDetailReaderProps {
  code: string;
  name: string;
  meta: string[];
  specialKind?: 'extra-exam' | 'graduation' | '';
  specialLabel?: string;
  obsLink?: string;
  obsLabel: string;
  tabLabel: string;
  active: string;
  panels: CourseDetailPanel[];
  sections?: CourseDetailSection[];
  history?: CourseDetailHistory;
  prerequisite?: { code: string; requiredLabel: string; unlocksLabel: string; loading: string };
  sectionHeading?: string;
  sectionCaption?: string;
  labels?: { add: string; requirements: string; showMore: string; showLess: string; extraExam: string; graduation: string };
  onAddCrn?: (crn: string) => void;
}
const icons = { overview: BookOpen, sections: Layers3, catalog: LibraryBig, history: History };

function PrerequisiteTabs({ data }: { data: NonNullable<CourseDetailReaderProps['prerequisite']> }) {
  const [active, setActive] = useState<'required' | 'unlocks'>('required');
  const tabs = [
    { key: 'required' as const, label: data.requiredLabel, icon: GitBranch },
    { key: 'unlocks' as const, label: data.unlocksLabel, icon: Route },
  ];
  const activateFromKey = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
    event.preventDefault();
    const next = event.key === 'Home' ? 0 : event.key === 'End' ? tabs.length - 1 : (index + (event.key === 'ArrowRight' ? 1 : -1) + tabs.length) % tabs.length;
    setActive(tabs[next].key);
    requestAnimationFrame(() => document.getElementById(`cdr-req-tab-${tabs[next].key}`)?.focus());
  };
  return <section className="cdr-prereq" aria-label={`${data.requiredLabel} / ${data.unlocksLabel}`}>
    <nav className="cdr-prereq-tabs" role="tablist">
      {tabs.map((tab, index) => { const Icon = tab.icon; return <button type="button" role="tab" id={`cdr-req-tab-${tab.key}`} aria-controls={`cdr-req-panel-${tab.key}`} aria-selected={active === tab.key} tabIndex={active === tab.key ? 0 : -1} onClick={() => setActive(tab.key)} onKeyDown={(event) => activateFromKey(event, index)} key={tab.key}><Icon aria-hidden="true" /><span>{tab.label}</span>{tab.key === 'unlocks' && <b data-req-count>…</b>}</button>; })}
    </nav>
    <div className="cdr-prereq-body">
      <div role="tabpanel" id="cdr-req-panel-required" aria-labelledby="cdr-req-tab-required" hidden={active !== 'required'}><div className="d-req-fwd" data-code={data.code}><p className="empty">{data.loading}</p></div></div>
      <div role="tabpanel" id="cdr-req-panel-unlocks" aria-labelledby="cdr-req-tab-unlocks" hidden={active !== 'unlocks'}><div className="d-req-by" data-code={data.code}><p className="empty">{data.loading}</p></div></div>
    </div>
  </section>;
}

function HistoryPanel({ history }: { history: CourseDetailHistory }) {
  const [showAll, setShowAll] = useState(false);
  const [activeSlug, setActiveSlug] = useState(history.terms[history.terms.length - 1]?.slug || '');
  if (!history.terms.length) return <div className="cdr-history-empty"><History aria-hidden="true" /><strong>{history.heading}</strong><p>{history.empty}</p></div>;
  const terms = showAll ? history.terms : history.terms.slice(-8);
  const active = history.terms.find((term) => term.slug === activeSlug) || terms[terms.length - 1];
  const maxCapacity = Math.max(1, ...terms.map((term) => term.capacity));
  return <div className="cdr-history">
    <header className="cdr-history-head"><div><h4>{history.heading}</h4><p>{history.caption}</p></div><span><History aria-hidden="true" />{history.terms.length}</span></header>
    <figure className="cdr-history-figure">
      <div className="cdr-history-legend"><span><i className="capacity" />{history.labels.capacity}</span><span><i className="enrolled" />{history.labels.enrolled}</span></div>
      <div className="cdr-history-chart" role="list" aria-label={history.heading}>
        {terms.map((term) => <button type="button" role="listitem" className={`cdr-history-term${active.slug === term.slug ? ' is-active' : ''}${term.fill >= 100 ? ' is-full' : ''}`} key={term.slug} onMouseEnter={() => setActiveSlug(term.slug)} onFocus={() => setActiveSlug(term.slug)} onClick={() => setActiveSlug(term.slug)} aria-label={`${term.label}, ${history.labels.capacity} ${term.capacity}, ${history.labels.enrolled} ${term.enrolled}, %${term.fill}`}>
          <span className="cdr-history-bars"><i className="capacity" style={{ height: `${Math.max(7, Math.round(term.capacity / maxCapacity * 100))}%` }} /><i className="enrolled" style={{ height: `${Math.max(term.enrolled ? 7 : 0, Math.round(term.enrolled / maxCapacity * 100))}%` }} /></span>
          <small>{term.shortLabel}</small>
        </button>)}
      </div>
      <figcaption className="cdr-history-caption"><span><CalendarRange aria-hidden="true" /><b>{active.label}</b></span><span>{history.labels.capacity} <b>{active.capacity}</b></span><span>{history.labels.enrolled} <b>{active.enrolled}</b></span><strong>%{active.fill}</strong></figcaption>
      {history.terms.length > 8 && <button type="button" className="cdr-history-toggle" aria-expanded={showAll} onClick={() => setShowAll(!showAll)}>{showAll ? history.labels.showRecent : history.labels.showAll}</button>}
    </figure>
    <details className="cdr-history-records d-history-records">
      <summary><span><UsersRound aria-hidden="true" />{history.labels.records}</span><b>{history.recordCount}</b><ChevronDown aria-hidden="true" /></summary>
      <div className="cdr-history-record-list htable">{[...history.terms].reverse().map((term) => <section key={term.slug}>
        <header><strong>{term.label}</strong><span>{term.enrolled} / {term.capacity} · %{term.fill}</span></header>
        {term.rows.map((row, index) => <div className="cdr-history-record" key={`${term.slug}-${row.instructor}-${index}`}><span>{row.instructor || '·'}</span><small>{history.labels.enrolled} {row.enrolled} · {history.labels.capacity} {row.capacity}</small><b>%{row.fill}</b></div>)}
      </section>)}</div>
    </details>
  </div>;
}

export function CourseDetailReader(props: CourseDetailReaderProps) {
  const [active, setActive] = useState(props.active);
  const [allSections, setAllSections] = useState(false);
  const activateFromKey = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
    event.preventDefault();
    const next = event.key === 'Home' ? 0 : event.key === 'End' ? props.panels.length - 1 : (index + (event.key === 'ArrowRight' ? 1 : -1) + props.panels.length) % props.panels.length;
    setActive(props.panels[next].key);
    requestAnimationFrame(() => document.getElementById(`d-tab-${props.panels[next].key}`)?.focus());
  };
  return <div className="cdr-root course-reader">
    <header className="cdr-head d-head">
      <div className="cdr-title d-title-block"><h3 id="detail-title"><span className="d-code">{props.code}</span><span className="d-name">{props.name}</span></h3><div className="d-meta">{props.meta.map((value) => <span className="d-pill" key={value}>{value}</span>)}{props.specialKind && <span className={`cdr-kind ${props.specialKind}`}>{props.specialKind === 'extra-exam' ? <FileClock aria-hidden="true" /> : <GraduationCap aria-hidden="true" />}{props.specialLabel}</span>}</div></div>
      {props.obsLink && <a className="cdr-obs d-obs" href={props.obsLink} target="_blank" rel="noopener"><ExternalLink aria-hidden="true" />{props.obsLabel}</a>}
    </header>
    <nav className="cdr-tabs d-tabs" role="tablist" aria-label={props.tabLabel}>
      {props.panels.map((panel, index) => { const Icon = icons[panel.key as keyof typeof icons] || BookOpen; return <button key={panel.key} type="button" role="tab" id={`d-tab-${panel.key}`} data-dtab={panel.key} aria-controls={`d-panel-${panel.key}`} aria-selected={active === panel.key} tabIndex={active === panel.key ? 0 : -1} onClick={() => setActive(panel.key)} onKeyDown={(event) => activateFromKey(event, index)}><Icon aria-hidden="true" /><span>{panel.label}</span>{panel.count !== undefined && <b>{panel.count}</b>}</button>; })}
    </nav>
    <div className="cdr-panels d-panels">
      {props.panels.map((panel) => <section key={panel.key} role="tabpanel" id={`d-panel-${panel.key}`} aria-labelledby={`d-tab-${panel.key}`} data-dpanel={panel.key} hidden={active !== panel.key}>
        {panel.key === 'history' && props.history ? <HistoryPanel history={props.history} /> : panel.key === 'overview' && props.prerequisite ? <div className="cdr-overview">
          {panel.beforeHtml && <div dangerouslySetInnerHTML={{ __html: panel.beforeHtml }} />}
          <PrerequisiteTabs data={props.prerequisite} />
          {panel.afterHtml && <div dangerouslySetInnerHTML={{ __html: panel.afterHtml }} />}
        </div> : panel.key === 'sections' && props.sections?.length ? <div className="cdr-sections">
          <header className="cdr-section-heading"><div><h4>{props.sectionHeading}</h4><p>{props.sectionCaption}</p></div><span>{props.sections.length}</span></header>
          <div className="cdr-section-list">
            {props.sections.slice(0, allSections ? undefined : 8).map((section, index) => <article className={`cdr-section d-sec stagger-in${section.focus ? ' is-focus' : ''}`} style={{ animationDelay: `${Math.min(index * 30, 200)}ms` }} key={section.crn} data-crn={section.crn}>
              <div className="cdr-section-code"><span>CRN</span><strong>{section.crn}</strong></div>
              <div className="cdr-section-body">
                <div className="cdr-section-top"><button type="button" className="cdr-instructor d-instr-history" data-name={section.instructors.join(', ')}><UserRound aria-hidden="true" />{section.instructors.join(', ') || '·'}</button><span>{section.quota}</span></div>
                {section.meta && <p className="cdr-section-meta">{section.special === 'extra-exam' ? <FileClock aria-hidden="true" /> : section.special === 'graduation' ? <GraduationCap aria-hidden="true" /> : <Building2 aria-hidden="true" />}{section.meta}</p>}
                {!!section.sessions.length && <div className="cdr-section-times d-sec-when">{section.sessions.map((line) => <span key={line}><Clock3 aria-hidden="true" />{line}</span>)}</div>}
                {section.note && <small>{section.note}</small>}
                {!!section.rules?.length && <details className="cdr-rules"><summary>{props.labels?.requirements}<ChevronDown aria-hidden="true" /></summary>{section.rules.map((rule) => <p key={rule.label}><b>{rule.label}</b>{rule.value}</p>)}</details>}
              </div>
              <button type="button" className="cdr-add" data-add-crn={section.crn} onClick={() => props.onAddCrn?.(section.crn)}><Plus aria-hidden="true" />{props.labels?.add}</button>
            </article>)}
          </div>
          {props.sections.length > 8 && <button type="button" className="cdr-more" aria-expanded={allSections} onClick={() => setAllSections(!allSections)}>{allSections ? props.labels?.showLess : `${props.sections.length - 8} ${props.labels?.showMore}`}</button>}
        </div> : <div dangerouslySetInnerHTML={{ __html: panel.html }} />}
      </section>)}
    </div>
  </div>;
}
