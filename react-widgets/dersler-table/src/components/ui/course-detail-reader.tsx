import { useState, type KeyboardEvent } from 'react';
import { BookOpen, ExternalLink, History, Layers3, LibraryBig } from 'lucide-react';

export interface CourseDetailPanel { key: string; label: string; count?: number; html: string }
export interface CourseDetailReaderProps {
  code: string;
  name: string;
  meta: string[];
  obsLink?: string;
  obsLabel: string;
  tabLabel: string;
  active: string;
  panels: CourseDetailPanel[];
}
const icons = { overview: BookOpen, sections: Layers3, catalog: LibraryBig, history: History };

export function CourseDetailReader(props: CourseDetailReaderProps) {
  const [active, setActive] = useState(props.active);
  const activateFromKey = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
    event.preventDefault();
    const next = event.key === 'Home' ? 0 : event.key === 'End' ? props.panels.length - 1 : (index + (event.key === 'ArrowRight' ? 1 : -1) + props.panels.length) % props.panels.length;
    setActive(props.panels[next].key);
    requestAnimationFrame(() => document.getElementById(`d-tab-${props.panels[next].key}`)?.focus());
  };
  return <div className="cdr-root">
    <header className="cdr-head d-head">
      <div className="cdr-title d-title-block"><h3 id="detail-title"><span className="d-code">{props.code}</span><span className="d-name">{props.name}</span></h3><div className="d-meta">{props.meta.map((value) => <span className="d-pill" key={value}>{value}</span>)}</div></div>
      {props.obsLink && <a className="cdr-obs d-obs" href={props.obsLink} target="_blank" rel="noopener"><ExternalLink aria-hidden="true" />{props.obsLabel}</a>}
    </header>
    <nav className="cdr-tabs d-tabs" role="tablist" aria-label={props.tabLabel}>
      {props.panels.map((panel, index) => { const Icon = icons[panel.key as keyof typeof icons] || BookOpen; return <button key={panel.key} type="button" role="tab" id={`d-tab-${panel.key}`} data-dtab={panel.key} aria-controls={`d-panel-${panel.key}`} aria-selected={active === panel.key} tabIndex={active === panel.key ? 0 : -1} onClick={() => setActive(panel.key)} onKeyDown={(event) => activateFromKey(event, index)}><Icon aria-hidden="true" /><span>{panel.label}</span>{panel.count !== undefined && <b>{panel.count}</b>}</button>; })}
    </nav>
    <div className="cdr-panels d-panels">
      {props.panels.map((panel) => <section key={panel.key} role="tabpanel" id={`d-panel-${panel.key}`} aria-labelledby={`d-tab-${panel.key}`} data-dpanel={panel.key} hidden={active !== panel.key} dangerouslySetInnerHTML={{ __html: panel.html }} />)}
    </div>
  </div>;
}
