import { useState, type DragEvent } from 'react';
import { BookOpen, Clock3, Copy, ExternalLink, GripVertical, MoreHorizontal, Trash2, UserRound } from 'lucide-react';

export interface ProgramCourseItem {
  key: string;
  crn: string;
  code: string;
  name: string;
  instructor: string;
  when: string;
  quota: string;
  credit?: string;
  badge?: string;
  full?: boolean;
  backup?: string;
}

export interface ProgramCourseListProps {
  items: ProgramCourseItem[];
  labels: { empty: string; course: string; quota: string; details: string; copyCrn: string; copyCode: string; copyInstructor: string; openObs: string; remove: string; actions: string };
  onOpen: (key: string) => void;
  onCopy: (key: string, field: 'crn' | 'code' | 'instructor') => void;
  onOpenObs: (key: string) => void;
  onRemove: (key: string) => void;
  onReorder: (from: number, to: number) => void;
}

export function ProgramCourseList({ items, labels, onOpen, onCopy, onOpenObs, onRemove, onReorder }: ProgramCourseListProps) {
  const [menu, setMenu] = useState<string | null>(null);
  const [drag, setDrag] = useState<number | null>(null);
  if (!items.length) return <div className="pcl-empty empty"><BookOpen aria-hidden="true" /><strong>{labels.empty}</strong></div>;
  const drop = (event: DragEvent, to: number) => { event.preventDefault(); if (drag !== null && drag !== to) onReorder(drag, to); setDrag(null); };
  return <div className="pcl-list" role="table" onKeyDown={(event) => { if (event.key === 'Escape') setMenu(null); }}>
    <div className="pcl-head p-list-head" role="row"><span role="columnheader">{labels.course}</span><span role="columnheader">{labels.quota}</span></div>
    {items.map((item, index) => <article
      key={item.key}
      className={`pcl-item p-item${item.full ? ' is-full' : ''}`}
      role="row"
      draggable
      onDragStart={() => setDrag(index)}
      onDragOver={(event) => event.preventDefault()}
      onDrop={(event) => drop(event, index)}
      onClick={(event) => { if (!(event.target as HTMLElement).closest('button')) onOpen(item.key); }}
    >
      <GripVertical className="pcl-grip" aria-hidden="true" />
      <div className="pcl-course" role="cell">
        <div className="pcl-title"><strong className="p-code">{item.code}</strong>{item.badge && <span>{item.badge}</span>}</div>
        <p>{item.name}</p>
        <div className="pcl-meta">
          <span className="p-when"><Clock3 aria-hidden="true" />{item.when}</span>
          <span><UserRound aria-hidden="true" />{item.instructor}</span>
        </div>
        {item.credit && <small>{item.credit}</small>}
      </div>
      <div className="pcl-numbers p-crn" role="cell"><b>{item.quota}</b><span>CRN {item.crn}</span>{item.backup && <em>{item.backup}</em>}</div>
      <button className="pcl-remove p-remove" type="button" onClick={() => onRemove(item.key)} aria-label={`${item.code} ${labels.remove}`}><Trash2 aria-hidden="true" /></button>
      <div className="pcl-menu-wrap">
        <button className="pcl-menu-trigger p-menu" type="button" aria-expanded={menu === item.key} aria-haspopup="menu" onClick={() => setMenu(menu === item.key ? null : item.key)}><MoreHorizontal aria-hidden="true" /><span className="sr-only">{item.code} {labels.actions}</span></button>
        {menu === item.key && <div className="pcl-menu p-menu-pop" role="menu">
          <button role="menuitem" onClick={() => { onOpen(item.key); setMenu(null); }}><BookOpen />{labels.details}</button>
          <button role="menuitem" data-act="copy-crn" onClick={() => { onCopy(item.key, 'crn'); setMenu(null); }}><Copy />{labels.copyCrn}</button>
          <button role="menuitem" data-act="copy-code" onClick={() => { onCopy(item.key, 'code'); setMenu(null); }}><Copy />{labels.copyCode}</button>
          {item.instructor && <button role="menuitem" data-act="copy-instructor" onClick={() => { onCopy(item.key, 'instructor'); setMenu(null); }}><UserRound />{labels.copyInstructor}</button>}
          <button role="menuitem" onClick={() => { onOpenObs(item.key); setMenu(null); }}><ExternalLink />{labels.openObs}</button>
          <button role="menuitem" data-act="remove" className="is-danger" onClick={() => { onRemove(item.key); setMenu(null); }}><Trash2 />{labels.remove}</button>
        </div>}
      </div>
    </article>)}
  </div>;
}
