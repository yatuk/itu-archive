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

export type { DerslerTableProps, DerslerRow, SortKey, SortDir } from '@/components/ui/dersler-table';
export type { ProgramScheduleProps, ProgramSession, UntimedCourse } from '@/components/ui/program-schedule';
export type { CurriculumPlanProps } from '@/components/ui/curriculum-plan';
export type { ExamsListProps, ExamRow } from '@/components/ui/exams-list';
export type { ProgramCourseListProps, ProgramCourseItem } from '@/components/ui/program-course-list';
export type { CourseDetailReaderProps, CourseDetailPanel } from '@/components/ui/course-detail-reader';
export type { GpaSummaryProps } from '@/components/ui/gpa-summary';
