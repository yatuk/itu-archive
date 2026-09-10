import { StrictMode } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { flushSync } from 'react-dom';

import { DerslerTable, type DerslerTableProps } from '@/components/ui/dersler-table';
import { ProgramSchedule, type ProgramScheduleProps } from '@/components/ui/program-schedule';
import { CurriculumPlan, type CurriculumPlanProps } from '@/components/ui/curriculum-plan';
import { ExamsList, type ExamsListProps } from '@/components/ui/exams-list';
import { ProgramCourseList, type ProgramCourseListProps } from '@/components/ui/program-course-list';
import { CourseDetailReader, type CourseDetailReaderProps } from '@/components/ui/course-detail-reader';
import { GpaSummary, type GpaSummaryProps } from '@/components/ui/gpa-summary';
import { FilterChips, type FilterChipsProps } from '@/components/ui/filter-chips';
import { TermsGrid, type TermsGridProps } from '@/components/ui/terms-grid';
import { CalendarTimeline, type CalendarTimelineProps } from '@/components/ui/calendar-timeline';
import { HistorySearch, type HistorySearchProps } from '@/components/ui/history-search';
import { HistoryDetail, type HistoryDetailProps } from '@/components/ui/history-detail';
// `?inline` ile CSS, ayrı bir .css dosyası yerine bu JS bundle'ının içine
// string olarak gömülür — courses.js'in docs/index.html'e ayrı bir <link>
// eklemesine gerek kalmaz ve önbellek kırma (?v=) JS import'unun kendi
// sürümlemesiyle otomatik gelir (bkz. cmd/site/main.go patchRuntimeAssetImports).
import cssText from './index.css?inline';

// Vanilla JS tarafının (assets-src/views/courses.js) çağırdığı tek giriş
// noktası. React'in kendi state'i yok — her prop değişikliğinde courses.js
// update()'i tekrar çağırır (sıralama/seçim/favori durumu hep vanilla
// tarafta tutulur, bkz. dersler-table.tsx'teki manuel sıralama).
let root: Root | null = null;
let programRoot: Root | null = null;
let curriculumRoot: Root | null = null;
let examsRoot: Root | null = null;
let programListRoot: Root | null = null;
let courseDetailRoot: Root | null = null;
let gpaSummaryRoot: Root | null = null;
let chipsRoot: Root | null = null;
let termsRoot: Root | null = null;
let calendarRoot: Root | null = null;
let historySearchRoot: Root | null = null;
let historyDetailRoot: Root | null = null;
let styleTag: HTMLStyleElement | null = null;

function ensureStyles(): void {
  if (styleTag) return;
  styleTag = document.createElement('style');
  styleTag.textContent = cssText;
  document.head.appendChild(styleTag);
}

export function mount(container: HTMLElement, props: DerslerTableProps): void {
  ensureStyles();
  root = createRoot(container);
  root.render(
    <StrictMode>
      <DerslerTable {...props} />
    </StrictMode>,
  );
}

export function update(props: DerslerTableProps): void {
  if (!root) return;
  root.render(
    <StrictMode>
      <DerslerTable {...props} />
    </StrictMode>,
  );
}

export function unmount(): void {
  root?.unmount();
  root = null;
}

export function mountProgram(container: HTMLElement, props: ProgramScheduleProps): void {
  ensureStyles();
  programRoot = createRoot(container);
  programRoot.render(<ProgramSchedule {...props} />);
}

export function updateProgram(props: ProgramScheduleProps): void {
  programRoot?.render(<ProgramSchedule {...props} />);
}

export function unmountProgram(): void {
  programRoot?.unmount();
  programRoot = null;
}

export function mountProgramList(container: HTMLElement, props: ProgramCourseListProps): void {
  ensureStyles();
  programListRoot = createRoot(container);
  programListRoot.render(<ProgramCourseList {...props} />);
}
export function updateProgramList(props: ProgramCourseListProps): void { programListRoot?.render(<ProgramCourseList {...props} />); }
export function unmountProgramList(): void { programListRoot?.unmount(); programListRoot = null; }

export function mountCourseDetail(container: HTMLElement, props: CourseDetailReaderProps): void {
  ensureStyles();
  courseDetailRoot?.unmount();
  courseDetailRoot = createRoot(container);
  flushSync(() => courseDetailRoot?.render(<CourseDetailReader {...props} />));
}
export function unmountCourseDetail(): void { courseDetailRoot?.unmount(); courseDetailRoot = null; }

export function mountGpaSummary(container: HTMLElement, props: GpaSummaryProps): void {
  ensureStyles();
  if (!gpaSummaryRoot) gpaSummaryRoot = createRoot(container);
  gpaSummaryRoot.render(<GpaSummary {...props} />);
}
export function unmountGpaSummary(): void { gpaSummaryRoot?.unmount(); gpaSummaryRoot = null; }

export function mountCurriculum(container: HTMLElement, props: CurriculumPlanProps): void {
  ensureStyles();
  curriculumRoot = createRoot(container);
  curriculumRoot.render(<CurriculumPlan {...props} />);
}

export function updateCurriculum(props: CurriculumPlanProps): void {
  curriculumRoot?.render(<CurriculumPlan {...props} />);
}

export function unmountCurriculum(): void {
  curriculumRoot?.unmount();
  curriculumRoot = null;
}

export function mountExams(container: HTMLElement, props: ExamsListProps): void {
  ensureStyles();
  examsRoot = createRoot(container);
  examsRoot.render(<ExamsList {...props} />);
}

export function updateExams(props: ExamsListProps): void {
  examsRoot?.render(<ExamsList {...props} />);
}

export function unmountExams(): void {
  examsRoot?.unmount();
  examsRoot = null;
}

export function mountChips(container: HTMLElement, props: FilterChipsProps): void {
  ensureStyles();
  if (!chipsRoot) chipsRoot = createRoot(container);
  chipsRoot.render(<FilterChips {...props} />);
}
export function unmountChips(): void { chipsRoot?.unmount(); chipsRoot = null; }

// flushSync: initReveal() (core/reveal.js) mount'tan hemen sonra çağrılır ve
// .reveal elemanlarını senkron biçimde DOM'da bulmayı bekler.
export function mountTermsGrid(container: HTMLElement, props: TermsGridProps): void {
  ensureStyles();
  if (!termsRoot) termsRoot = createRoot(container);
  flushSync(() => termsRoot?.render(<TermsGrid {...props} />));
}
export function unmountTermsGrid(): void { termsRoot?.unmount(); termsRoot = null; }

export function mountCalendarTimeline(container: HTMLElement, props: CalendarTimelineProps): void {
  ensureStyles();
  if (!calendarRoot) calendarRoot = createRoot(container);
  flushSync(() => calendarRoot?.render(<CalendarTimeline {...props} />));
}
export function unmountCalendarTimeline(): void { calendarRoot?.unmount(); calendarRoot = null; }

export function mountHistorySearch(container: HTMLElement, props: HistorySearchProps): void {
  ensureStyles();
  if (!historySearchRoot) historySearchRoot = createRoot(container);
  historySearchRoot.render(<HistorySearch {...props} />);
}
export function unmountHistorySearch(): void { historySearchRoot?.unmount(); historySearchRoot = null; }

// flushSync: history.js mount'tan hemen sonra initReveal() + scrollIntoView
// çağırır, ikisi de gerçek DOM'un senkron hazır olmasını bekler.
export function mountHistoryDetail(container: HTMLElement, props: HistoryDetailProps): void {
  ensureStyles();
  if (!historyDetailRoot) historyDetailRoot = createRoot(container);
  flushSync(() => historyDetailRoot?.render(<HistoryDetail {...props} />));
}
export function unmountHistoryDetail(): void { historyDetailRoot?.unmount(); historyDetailRoot = null; }

export type { DerslerTableProps, DerslerRow, SortKey, SortDir } from '@/components/ui/dersler-table';
export type { ProgramScheduleProps, ProgramSession, UntimedCourse } from '@/components/ui/program-schedule';
export type { CurriculumPlanProps } from '@/components/ui/curriculum-plan';
export type { ExamsListProps, ExamRow } from '@/components/ui/exams-list';
export type { ProgramCourseListProps, ProgramCourseItem } from '@/components/ui/program-course-list';
export type { CourseDetailReaderProps, CourseDetailPanel } from '@/components/ui/course-detail-reader';
export type { GpaSummaryProps } from '@/components/ui/gpa-summary';
export type { FilterChipsProps, FilterChipData } from '@/components/ui/filter-chips';
export type { TermsGridProps, TermCardData } from '@/components/ui/terms-grid';
export type { CalendarTimelineProps, CalendarGroupData, CalendarEventData } from '@/components/ui/calendar-timeline';
export type { HistorySearchProps, HistoryChip } from '@/components/ui/history-search';
export type { HistoryDetailProps, HistoryCourseDetailData, HistoryPersonDetailData, HistoryCourseRow, HistoryPersonRow } from '@/components/ui/history-detail';
