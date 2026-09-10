import { BookCheck, Gauge, Target } from 'lucide-react';

export interface GpaSummaryProps {
  gpaLabel: string; gpaValue: string; gpaHint: string;
  progressLabel: string; progressValue: string; progressHint: string;
  targetLabel: string; targetValue: string;
}

export function GpaSummary(props: GpaSummaryProps) {
  const cards = [
    { key: 'gpa', label: props.gpaLabel, value: props.gpaValue, hint: props.gpaHint, valueId: 'dp-gano', hintId: undefined, Icon: Gauge },
    { key: 'progress', label: props.progressLabel, value: props.progressValue, hint: props.progressHint, valueId: 'dp-progress', hintId: 'dp-progress-sub', Icon: BookCheck },
    { key: 'target', label: props.targetLabel, value: props.targetValue, hint: '', valueId: 'dp-target', hintId: 'dp-target-sub', Icon: Target },
  ];
  return <div className="gpa-summary-grid">{cards.map(({ key, label, value, hint, valueId, hintId, Icon }, index) =>
    <article className={`gpa-summary-card is-${key} stagger-in`} style={{ animationDelay: `${index * 60}ms` }} key={key}>
      <span className="gpa-summary-icon"><Icon aria-hidden="true" /></span>
      <div><em>{label}</em><b id={valueId}>{value}</b><small id={hintId}>{hint}</small></div>
    </article>
  )}</div>;
}
