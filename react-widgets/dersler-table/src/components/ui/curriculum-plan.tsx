import { SearchX } from 'lucide-react';

export interface CurriculumPlanProps {
  html: string;
  empty: boolean;
  emptyMessage: string;
  ariaLabel: string;
}

// Ders, not ve şube eylemleri dersplanim.js'in #dp-semesters üzerindeki olay
// delegasyonunda kalır. React bu adada yalnızca güvenilir, textContent ile
// oluşturulmuş müfredat DOM'unu tutarlı bir yüzey olarak sunar.
export function CurriculumPlan({ html, empty, emptyMessage, ariaLabel }: CurriculumPlanProps) {
  if (empty) {
    return (
      <div className="curriculum-plan-root cp-empty" role="status">
        <SearchX aria-hidden="true" />
        <strong>{emptyMessage}</strong>
      </div>
    );
  }
  return (
    <section className="curriculum-plan-root" aria-label={ariaLabel}>
      <div className="cp-semester-grid" dangerouslySetInnerHTML={{ __html: html }} />
    </section>
  );
}
