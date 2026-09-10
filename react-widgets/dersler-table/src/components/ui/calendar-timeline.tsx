import { CalendarClock, CheckCircle2, CircleDot } from 'lucide-react';

// calendar.js'teki gruplu etkinlik listesini React'e taşır. Hangi
// etkinliklerin "şimdi/geçmiş/gelecek" olduğu (calendarDayState) ve
// gruplama tamamen vanilla tarafta hesaplanır; bu bileşen yalnızca hazır
// veriyi 21st.dev'deki Timeline deseninden esinlenen durum ikonlu bir
// dikey çizelge olarak çizer.
export interface CalendarEventData {
  key: string;
  title: string;
  date: string;
  left: string;
  state: 'now' | 'past' | 'upcoming';
}

export interface CalendarGroupData {
  key: string;
  title: string;
  events: CalendarEventData[];
}

export interface CalendarTimelineProps {
  groups: CalendarGroupData[];
}

function StateIcon({ state }: { state: CalendarEventData['state'] }) {
  if (state === 'past') return <CheckCircle2 aria-hidden="true" />;
  if (state === 'now') return <CircleDot aria-hidden="true" />;
  return <CalendarClock aria-hidden="true" />;
}

export function CalendarTimeline({ groups }: CalendarTimelineProps) {
  return (
    <>
      {groups.map((group) => (
        <section className="atl-group reveal" key={group.key}>
          <h3>{group.title}</h3>
          <ol className="atl-list">
            {group.events.map((event) => (
              <li className={`atl-row is-${event.state}`} key={event.key}>
                <span className="atl-icon"><StateIcon state={event.state} /></span>
                <span className="atl-title">{event.title}</span>
                <span className="atl-date">{event.date}</span>
                <span className="atl-left">{event.left}</span>
              </li>
            ))}
          </ol>
        </section>
      ))}
    </>
  );
}
