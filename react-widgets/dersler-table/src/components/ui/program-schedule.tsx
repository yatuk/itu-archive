import { useEffect, useMemo, useState, type CSSProperties, type FocusEvent, type MouseEvent as ReactMouseEvent } from 'react';
import {
  AlertTriangle,
  CalendarDays,
  Clock3,
  Copy,
  ExternalLink,
  GraduationCap,
  Hash,
  MapPin,
  MoreHorizontal,
  Pin,
  SearchX,
  Trash2,
  UserRound,
} from 'lucide-react';

export interface ProgramSession {
  key: string;
  rowKey: string;
  crn: string;
  code: string;
  name: string;
  instructor: string;
  where: string;
  day: number;
  start: number;
  end: number;
  color: string;
  foreground: string;
}

export interface UntimedCourse {
  key: string;
  code: string;
  crn: string;
  detail: string;
  special: boolean;
}

export interface ProgramScheduleProps {
  sessions: ProgramSession[];
  untimed: UntimedCourse[];
  sectionCount: number;
  showWeekend: boolean;
  showFullDay: boolean;
  forceGrid: boolean;
  showNow: boolean;
  dayLabels: string[];
  labels: {
    title: string;
    sessions: string;
    sections: string;
    empty: string;
    emptyDay: string;
    special: string;
    unknown: string;
    conflict: string;
    details: string;
    copyCrn: string;
    openObs: string;
    remove: string;
    actions: string;
  };
  onOpen: (rowKey: string) => void;
  onCopyCrn: (rowKey: string) => void;
  onOpenObs: (rowKey: string) => void;
  onRemove: (rowKey: string) => void;
}

type PlacedSession = ProgramSession & { lane: number; laneCount: number; conflict: boolean };

const fmt = (minutes: number) => `${String(Math.floor(minutes / 60)).padStart(2, '0')}:${String(minutes % 60).padStart(2, '0')}`;

function placeSessions(input: ProgramSession[]): PlacedSession[] {
  const ordered = [...input].sort((a, b) => a.start - b.start || a.end - b.end);
  const laneEnds: number[] = [];
  const placed = ordered.map((session) => {
    let lane = laneEnds.findIndex((end) => end <= session.start);
    if (lane < 0) {
      lane = laneEnds.length;
      laneEnds.push(session.end);
    } else {
      laneEnds[lane] = session.end;
    }
    return { ...session, lane, laneCount: 1, conflict: false };
  });
  const laneCount = Math.max(1, laneEnds.length);
  return placed.map((session) => ({
    ...session,
    laneCount,
    conflict: placed.some((other) => other.key !== session.key && session.start < other.end && other.start < session.end),
  }));
}

function useCompact(): boolean {
  const query = '(max-width: 600px)';
  const [compact, setCompact] = useState(() => window.matchMedia(query).matches);
  useEffect(() => {
    const media = window.matchMedia(query);
    const update = () => setCompact(media.matches);
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);
  return compact;
}

function SessionMeta({ session, compact = false }: { session: ProgramSession; compact?: boolean }) {
  return (
    <span className="pp-session-meta">
      <span><Clock3 aria-hidden="true" />{fmt(session.start)}–{fmt(session.end)}</span>
      <span><Hash aria-hidden="true" />{session.crn}</span>
      {!compact && session.instructor && <span><UserRound aria-hidden="true" />{session.instructor}</span>}
      {!compact && session.where && <span><MapPin aria-hidden="true" />{session.where}</span>}
    </span>
  );
}

function Agenda({ props, visibleDays }: { props: ProgramScheduleProps; visibleDays: number[] }) {
  const firstBusy = visibleDays.find((day) => props.sessions.some((session) => session.day === day)) ?? visibleDays[0];
  const [day, setDay] = useState(firstBusy);
  useEffect(() => {
    if (!visibleDays.includes(day)) setDay(firstBusy);
  }, [day, firstBusy, visibleDays]);
  const sessions = placeSessions(props.sessions.filter((session) => session.day === day));
  return (
    <div className="pp-agenda">
      <div className="pp-day-tabs tt-daytabs" role="tablist" aria-label={props.labels.title} style={{ '--pp-days': visibleDays.length } as CSSProperties}>
        {visibleDays.map((index) => (
          <button key={index} type="button" role="tab" aria-selected={day === index} className={day === index ? 'is-active active tt-daytab' : 'tt-daytab'} onClick={() => setDay(index)}>
            {props.dayLabels[index]}
            {props.sessions.some((session) => session.day === index) && <span aria-hidden="true" />}
          </button>
        ))}
      </div>
      <div className="pp-agenda-list">
        {sessions.length ? sessions.map((session) => (
          <button
            key={session.key}
            type="button"
            className={`pp-agenda-card p-agenda-session${session.conflict ? ' is-conflict' : ''}`}
            style={{ '--pp-color': session.color } as CSSProperties}
            onClick={() => props.onOpen(session.rowKey)}
          >
            <span className="pp-agenda-time"><b>{fmt(session.start)}</b><small>{fmt(session.end)}</small></span>
            <span className="pp-agenda-copy">
              <strong><span className="pp-color-dot" />{session.code}</strong>
              <span className="pp-agenda-name">{session.name}</span>
              <SessionMeta session={session} compact />
              {session.instructor && <span className="pp-agenda-detail"><UserRound aria-hidden="true" />{session.instructor}</span>}
              {session.where && <span className="pp-agenda-detail"><MapPin aria-hidden="true" />{session.where}</span>}
              {session.conflict && <em><AlertTriangle aria-hidden="true" />{props.labels.conflict}</em>}
            </span>
          </button>
        )) : <div className="pp-empty-day"><CalendarDays aria-hidden="true" /><p>{props.labels.emptyDay}</p></div>}
      </div>
    </div>
  );
}

export function ProgramSchedule(props: ProgramScheduleProps) {
  const compact = useCompact();
  const [menu, setMenu] = useState<{ session: ProgramSession; x: number; y: number } | null>(null);
  const [tooltip, setTooltip] = useState<{ session: ProgramSession; x: number; y: number; side: 'top' | 'bottom' } | null>(null);
  const hasWeekend = props.sessions.some((session) => session.day >= 5);
  const visibleDays = props.showWeekend || hasWeekend ? [0, 1, 2, 3, 4, 5, 6] : [0, 1, 2, 3, 4];
  const timed = props.sessions.length > 0;
  const bounds = useMemo(() => {
    if (!timed) return { start: 8 * 60, end: 18 * 60 };
    const first = Math.min(...props.sessions.map((session) => session.start));
    const last = Math.max(...props.sessions.map((session) => session.end));
    return props.showFullDay
      ? { start: 7 * 60, end: 23 * 60 }
      : { start: Math.min(8 * 60 + 30, first), end: Math.min(24 * 60, last + 60) };
  }, [props.sessions, props.showFullDay, timed]);
  const rowHeight = 34;
  const slots = Math.max(1, Math.ceil((bounds.end - bounds.start) / 30));
  const height = slots * rowHeight;
  const now = new Date();
  const today = (now.getDay() + 6) % 7;
  const nowMinutes = now.getHours() * 60 + now.getMinutes();
  const nowTop = ((nowMinutes - bounds.start) / 30) * rowHeight;

  useEffect(() => {
    if (!menu) return;
    const close = () => setMenu(null);
    window.addEventListener('pointerdown', close, { once: true });
    window.addEventListener('blur', close, { once: true });
    return () => {
      window.removeEventListener('pointerdown', close);
      window.removeEventListener('blur', close);
    };
  }, [menu]);

  const openMenu = (event: ReactMouseEvent, session: ProgramSession) => {
    event.preventDefault();
    event.stopPropagation();
    setMenu({ session, x: Math.min(event.clientX, window.innerWidth - 232), y: Math.min(event.clientY, window.innerHeight - 230) });
  };
  const showTooltip = (target: HTMLElement, session: ProgramSession) => {
    const rect = target.getBoundingClientRect();
    const width = 286;
    const x = Math.max(10, Math.min(rect.left + rect.width / 2 - width / 2, window.innerWidth - width - 10));
    const preferBelow = rect.top < 190;
    setTooltip({ session, x, y: preferBelow ? rect.bottom + 9 : rect.top - 9, side: preferBelow ? 'bottom' : 'top' });
  };

  return (
    <section className="dersler-table-root program-planner-root" aria-label={props.labels.title}>
      <header className="pp-heading">
        <span className="pp-heading-icon"><CalendarDays aria-hidden="true" /></span>
        <span><strong>{props.labels.title}</strong><small>{props.sessions.length} {props.labels.sessions} · {props.sectionCount} {props.labels.sections}</small></span>
      </header>

      {!timed && !props.untimed.length ? (
        <div className="pp-empty"><SearchX aria-hidden="true" /><strong>{props.labels.empty}</strong></div>
      ) : compact && !props.forceGrid ? (
        <Agenda props={props} visibleDays={visibleDays} />
      ) : timed ? (
        <div className="pp-calendar-scroll">
          <div className="pp-calendar" style={{ '--pp-days': visibleDays.length } as CSSProperties}>
            <div className="pp-calendar-head"><span />{visibleDays.map((day) => <b key={day}>{props.dayLabels[day]}</b>)}</div>
            <div className="pp-calendar-body">
              <div className="pp-time-column" style={{ height }}>
                {Array.from({ length: slots }, (_, index) => <span key={index}>{fmt(bounds.start + index * 30)}</span>)}
              </div>
              {visibleDays.map((day) => {
                const daySessions = placeSessions(props.sessions.filter((session) => session.day === day));
                const showCurrent = props.showNow && day === today && nowMinutes >= bounds.start && nowMinutes < bounds.end;
                return (
                  <div key={day} className={`pp-day-column${day >= 5 ? ' is-weekend' : ''}`} style={{ height }}>
                    {showCurrent && <span className="pp-now" style={{ top: nowTop }} />}
                    {daySessions.map((session) => {
                      const top = ((session.start - bounds.start) / 30) * rowHeight;
                      const blockHeight = Math.max(30, ((session.end - session.start) / 30) * rowHeight);
                      const width = 100 / session.laneCount;
                      const short = blockHeight < 104;
                      return (
                        <button
                          key={session.key}
                          type="button"
                          className={`pp-session tt-block${short ? ' is-short' : ''}${session.conflict ? ' is-conflict' : ''}`}
                          style={{
                            top,
                            height: blockHeight,
                            left: `calc(${session.lane * width}% + 3px)`,
                            width: `calc(${width}% - 6px)`,
                            '--pp-color': session.color,
                            '--pp-foreground': session.foreground,
                          } as CSSProperties}
                          aria-describedby={tooltip?.session.key === session.key ? 'pp-course-tooltip' : undefined}
                          onClick={() => props.onOpen(session.rowKey)}
                          onContextMenu={(event) => openMenu(event, session)}
                          onMouseEnter={(event) => showTooltip(event.currentTarget, session)}
                          onMouseLeave={() => setTooltip(null)}
                          onFocus={(event: FocusEvent<HTMLButtonElement>) => showTooltip(event.currentTarget, session)}
                          onBlur={() => setTooltip(null)}
                        >
                          <Pin className="pp-pin" aria-hidden="true" />
                          <strong>{session.code}: <span>{session.name}</span></strong>
                          <SessionMeta session={session} compact={short} />
                          {session.conflict && <span className="pp-conflict"><AlertTriangle aria-hidden="true" />{props.labels.conflict}</span>}
                          <MoreHorizontal className="pp-more" aria-hidden="true" />
                        </button>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      ) : null}

      {!!props.untimed.length && <div className="pp-untimed">
        <GraduationCap aria-hidden="true" />
        <div><strong>{props.untimed.some((item) => item.special) ? props.labels.special : props.labels.unknown}</strong>
          {props.untimed.map((item) => <span key={item.key}><b>{item.code}</b> · CRN {item.crn} — {item.detail}</span>)}
        </div>
      </div>}

      {menu && <div className="pp-context tt-context-menu" role="menu" aria-label={`${menu.session.code} ${props.labels.actions}`} style={{ left: menu.x, top: menu.y }} onPointerDown={(event) => event.stopPropagation()}>
        <p><strong>{menu.session.code}</strong><span>CRN {menu.session.crn}</span></p>
        <button type="button" role="menuitem" data-act="open" onClick={() => { props.onOpen(menu.session.rowKey); setMenu(null); }}><CalendarDays />{props.labels.details}</button>
        <button type="button" role="menuitem" data-act="copy-crn" onClick={() => { props.onCopyCrn(menu.session.rowKey); setMenu(null); }}><Copy />{props.labels.copyCrn}</button>
        <button type="button" role="menuitem" data-act="open-obs" onClick={() => { props.onOpenObs(menu.session.rowKey); setMenu(null); }}><ExternalLink />{props.labels.openObs}</button>
        <button type="button" role="menuitem" data-act="remove" className="is-danger" onClick={() => { props.onRemove(menu.session.rowKey); setMenu(null); }}><Trash2 />{props.labels.remove}</button>
      </div>}
      {tooltip && <div id="pp-course-tooltip" className="pp-tooltip" role="tooltip" style={{ left: tooltip.x, top: tooltip.y }} data-side={tooltip.side}>
        <div className="pp-tooltip-title"><span style={{ background: tooltip.session.color }} /><strong>{tooltip.session.code}</strong><b>{fmt(tooltip.session.start)}–{fmt(tooltip.session.end)}</b></div>
        <p>{tooltip.session.name}</p>
        <dl>
          <div><dt><Hash aria-hidden="true" /></dt><dd>{tooltip.session.crn}</dd></div>
          {tooltip.session.instructor && <div><dt><UserRound aria-hidden="true" /></dt><dd>{tooltip.session.instructor}</dd></div>}
          {tooltip.session.where && <div><dt><MapPin aria-hidden="true" /></dt><dd>{tooltip.session.where}</dd></div>}
        </dl>
        <small>{props.labels.details} · sağ tık: {props.labels.actions}</small>
      </div>}
    </section>
  );
}
