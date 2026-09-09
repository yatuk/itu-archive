import { useEffect, useMemo, useState } from 'react';
import { CalendarDays, Clock3, GraduationCap, Hash, MapPin, SearchX, UserRound } from 'lucide-react';

export interface ExamRow {
  key: string;
  crn: string;
  code: string;
  name: string;
  instructor: string;
  type: string;
  place: string;
  date: string;
  day: string;
  time: string;
}

export interface ExamsListProps {
  rows: ExamRow[];
  showPlace: boolean;
  emptyMessage: string;
  ariaLabel: string;
  labels: {
    crn: string;
    course: string;
    name: string;
    instructor: string;
    type: string;
    place: string;
    date: string;
    time: string;
  };
  onOpen: (code: string) => void;
}

function useCompact(): boolean {
  const query = '(max-width: 700px)';
  const [compact, setCompact] = useState(() => window.matchMedia(query).matches);
  useEffect(() => {
    const media = window.matchMedia(query);
    const update = () => setCompact(media.matches);
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);
  return compact;
}

function Empty({ message }: { message: string }) {
  return <div className="ex-empty"><SearchX aria-hidden="true" /><strong>{message}</strong></div>;
}

function DesktopList({ props }: { props: ExamsListProps }) {
  return (
    <div className="ex-table" role="table" aria-label={props.ariaLabel}>
      <div className={`ex-head${props.showPlace ? '' : ' without-place'}`} role="row">
        <span role="columnheader">{props.labels.course}</span>
        <span role="columnheader">{props.labels.instructor}</span>
        <span role="columnheader">{props.labels.type}</span>
        {props.showPlace && <span role="columnheader">{props.labels.place}</span>}
        <span role="columnheader">{props.labels.date} / {props.labels.time}</span>
      </div>
      <div role="rowgroup">
        {props.rows.map((exam) => (
          <div className={`ex-row${props.showPlace ? '' : ' without-place'}`} role="row" key={exam.key}>
            <div className="ex-course" role="cell">
              <button type="button" onClick={() => props.onOpen(exam.code)}>{exam.code}</button>
              <strong>{exam.name}</strong>
              <small><Hash aria-hidden="true" />{exam.crn}</small>
            </div>
            <span className="ex-meta" role="cell"><UserRound aria-hidden="true" />{exam.instructor || '·'}</span>
            <span role="cell"><em className="ex-type">{exam.type}</em></span>
            {props.showPlace && <span className="ex-meta" role="cell"><MapPin aria-hidden="true" />{exam.place || '·'}</span>}
            <div className="ex-when" role="cell">
              <strong><CalendarDays aria-hidden="true" />{exam.date}</strong>
              <span><Clock3 aria-hidden="true" />{exam.day} {exam.time}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function MobileAgenda({ props }: { props: ExamsListProps }) {
  const groups = useMemo(() => {
    const ordered: Array<{ date: string; day: string; exams: ExamRow[] }> = [];
    const byDate = new Map<string, { date: string; day: string; exams: ExamRow[] }>();
    props.rows.forEach((exam) => {
      let group = byDate.get(exam.date);
      if (!group) {
        group = { date: exam.date, day: exam.day, exams: [] };
        byDate.set(exam.date, group);
        ordered.push(group);
      }
      group.exams.push(exam);
    });
    return ordered;
  }, [props.rows]);

  return (
    <div className="ex-agenda" aria-label={props.ariaLabel}>
      {groups.map((group) => (
        <section className="ex-day" key={group.date}>
          <header><CalendarDays aria-hidden="true" /><strong>{group.date}</strong><span>{group.day}</span></header>
          <div>
            {group.exams.map((exam) => (
              <article className="ex-card" key={exam.key}>
                <span className="ex-card-time"><Clock3 aria-hidden="true" /><b>{exam.time}</b></span>
                <div className="ex-card-main">
                  <button type="button" onClick={() => props.onOpen(exam.code)}>{exam.code}</button>
                  <strong>{exam.name}</strong>
                  <span><GraduationCap aria-hidden="true" />{exam.type}<i aria-hidden="true" />CRN {exam.crn}</span>
                  {exam.instructor && <span><UserRound aria-hidden="true" />{exam.instructor}</span>}
                  {props.showPlace && exam.place && <span><MapPin aria-hidden="true" />{exam.place}</span>}
                </div>
              </article>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}

export function ExamsList(props: ExamsListProps) {
  const compact = useCompact();
  return (
    <section className="dersler-table-root exams-list-root">
      {!props.rows.length ? <Empty message={props.emptyMessage} /> : compact ? <MobileAgenda props={props} /> : <DesktopList props={props} />}
    </section>
  );
}
