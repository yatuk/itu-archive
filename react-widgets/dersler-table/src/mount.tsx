import { StrictMode } from 'react';
import { createRoot, type Root } from 'react-dom/client';

import { DerslerTable, type DerslerTableProps } from '@/components/ui/dersler-table';
import { ProgramSchedule, type ProgramScheduleProps } from '@/components/ui/program-schedule';
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

export type { DerslerTableProps, DerslerRow, SortKey, SortDir } from '@/components/ui/dersler-table';
export type { ProgramScheduleProps, ProgramSession, UntimedCourse } from '@/components/ui/program-schedule';
