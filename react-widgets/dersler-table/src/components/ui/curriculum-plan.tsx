import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties, type KeyboardEvent, type MouseEvent } from 'react';
import { Check, SearchX } from 'lucide-react';

export interface CurriculumPlanProps {
  html: string;
  empty: boolean;
  emptyMessage: string;
  ariaLabel: string;
}

interface GradeMenuState {
  selectIndex: number;
  options: Array<{ value: string; label: string }>;
  value: string;
  label: string;
  x: number;
  y: number;
  above: boolean;
  keyboard: boolean;
}

// Ders, not ve şube eylemleri dersplanim.js'in #dp-semesters üzerindeki olay
// delegasyonunda kalır. React bu adada yalnızca güvenilir, textContent ile
// oluşturulmuş müfredat DOM'unu tutarlı bir yüzey olarak sunar.
export function CurriculumPlan({ html, empty, emptyMessage, ariaLabel }: CurriculumPlanProps) {
  const gridRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const [menu, setMenu] = useState<GradeMenuState | null>(null);

  useLayoutEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;
    const selects = [...grid.querySelectorAll<HTMLSelectElement>('select.dp-grade')];
    selects.forEach((select, index) => {
      select.hidden = true;
      select.tabIndex = -1;
      const trigger = document.createElement('button');
      trigger.type = 'button';
      trigger.className = `cp-grade-trigger${select.value ? ' filled' : ''}`;
      trigger.dataset.gradeIndex = String(index);
      trigger.setAttribute('aria-haspopup', 'listbox');
      trigger.setAttribute('aria-expanded', 'false');
      trigger.setAttribute('aria-label', select.getAttribute('aria-label') || 'Not seç');
      const label = document.createElement('span');
      label.textContent = select.selectedOptions[0]?.textContent || select.options[0]?.textContent || '—';
      trigger.appendChild(label);
      trigger.insertAdjacentHTML('beforeend', '<svg aria-hidden="true" viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>');
      select.insertAdjacentElement('afterend', trigger);
    });
  }, [html]);

  useEffect(() => setMenu(null), [html]);

  useEffect(() => {
    if (!menu) return;
    const dismiss = (event: PointerEvent) => {
      const target = event.target as Node;
      if (menuRef.current?.contains(target) || triggerRef.current?.contains(target)) return;
      setMenu(null);
    };
    const close = () => setMenu(null);
    window.addEventListener('pointerdown', dismiss);
    const anchored = window.matchMedia('(min-width: 561px)').matches;
    // Menü açılırken tetikleyiciyi görünüme getiren tarayıcı kaydırması
    // (scroll-margin) henüz oturmamış olabilir; bunu "kullanıcı kaydırdı,
    // menüyü kapat" sinyaliyle karıştırmamak için dinleyicileri bir sonraki
    // kareye erteliyoruz.
    let scrollBound = false;
    let resizeBound = false;
    const raf = requestAnimationFrame(() => {
      if (anchored) { window.addEventListener('scroll', close, true); scrollBound = true; }
      window.addEventListener('resize', close);
      resizeBound = true;
    });
    if (menu.keyboard) {
      requestAnimationFrame(() => menuRef.current?.querySelector<HTMLButtonElement>('[aria-selected="true"]')?.focus({ preventScroll: true }));
    }
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('pointerdown', dismiss);
      if (scrollBound) window.removeEventListener('scroll', close, true);
      if (resizeBound) window.removeEventListener('resize', close);
    };
  }, [menu]);

  const openGradeMenu = (trigger: HTMLButtonElement, keyboard = false) => {
    const index = Number(trigger.dataset.gradeIndex);
    const select = gridRef.current?.querySelectorAll<HTMLSelectElement>('select.dp-grade')[index];
    if (!select) return;
    const rect = trigger.getBoundingClientRect();
    const menuHeight = 246;
    const above = window.innerHeight - rect.bottom < menuHeight && rect.top > menuHeight;
    const width = Math.min(292, window.innerWidth - 20);
    const x = Math.max(10, Math.min(rect.right - width, window.innerWidth - width - 10));
    triggerRef.current?.setAttribute('aria-expanded', 'false');
    triggerRef.current = trigger;
    trigger.setAttribute('aria-expanded', 'true');
    console.log('[dbg] setMenu called', index);
    setMenu({
      selectIndex: index,
      options: [...select.options].map((option) => ({ value: option.value, label: option.textContent || option.value })),
      value: select.value,
      label: select.getAttribute('aria-label') || 'Not seç',
      x,
      y: above ? rect.top - 7 : rect.bottom + 7,
      above,
      keyboard,
    });
  };

  const handleClick = (event: MouseEvent<HTMLElement>) => {
    const trigger = (event.target as HTMLElement).closest<HTMLButtonElement>('.cp-grade-trigger');
    if (!trigger) return;
    event.preventDefault();
    if (trigger === triggerRef.current && menu) {
      trigger.setAttribute('aria-expanded', 'false');
      setMenu(null);
      return;
    }
    openGradeMenu(trigger);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (event.key === 'Escape' && menu) {
      event.preventDefault();
      triggerRef.current?.setAttribute('aria-expanded', 'false');
      setMenu(null);
      return;
    }
    const trigger = (event.target as HTMLElement).closest<HTMLButtonElement>('.cp-grade-trigger');
    if (!trigger || !['Enter', ' ', 'ArrowDown', 'ArrowUp'].includes(event.key)) return;
    event.preventDefault();
    openGradeMenu(trigger, true);
  };

  const chooseGrade = (value: string) => {
    if (!menu) return;
    const select = gridRef.current?.querySelectorAll<HTMLSelectElement>('select.dp-grade')[menu.selectIndex];
    if (!select) return;
    select.value = value;
    select.dispatchEvent(new Event('change', { bubbles: true }));
    // The native select is the source of truth, but it is visually hidden.
    // Keep its visible trigger in sync without waiting for a full rerender.
    const selectedLabel = select.selectedOptions[0]?.textContent || select.options[0]?.textContent || '—';
    const trigger = triggerRef.current;
    const triggerLabel = trigger?.querySelector('span');
    if (triggerLabel) triggerLabel.textContent = selectedLabel;
    trigger?.classList.toggle('filled', Boolean(value));
    triggerRef.current?.setAttribute('aria-expanded', 'false');
    triggerRef.current?.focus();
    setMenu(null);
  };

  const handleMenuKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Escape') {
      event.preventDefault();
      triggerRef.current?.setAttribute('aria-expanded', 'false');
      triggerRef.current?.focus();
      setMenu(null);
      return;
    }
    if (!['ArrowDown', 'ArrowRight', 'ArrowUp', 'ArrowLeft'].includes(event.key)) return;
    event.preventDefault();
    const buttons = [...event.currentTarget.querySelectorAll<HTMLButtonElement>('[role="option"]')];
    const current = Math.max(0, buttons.indexOf(document.activeElement as HTMLButtonElement));
    const delta = event.key === 'ArrowDown' || event.key === 'ArrowRight' ? 1 : -1;
    buttons[(current + delta + buttons.length) % buttons.length]?.focus();
  };

  if (empty) {
    return (
      <div className="curriculum-plan-root cp-empty" role="status">
        <SearchX aria-hidden="true" />
        <strong>{emptyMessage}</strong>
      </div>
    );
  }
  return (
    <section className="curriculum-plan-root" aria-label={ariaLabel} onClick={handleClick} onKeyDown={handleKeyDown}>
      <div ref={gridRef} className="cp-semester-grid" dangerouslySetInnerHTML={{ __html: html }} />
      {menu && (
        <div
          ref={menuRef}
          className={`cp-grade-menu${menu.above ? ' above' : ''}`}
          role="listbox"
          aria-label={menu.label}
          style={{ '--cp-menu-x': `${menu.x}px`, '--cp-menu-y': `${menu.y}px` } as CSSProperties}
          onKeyDown={handleMenuKeyDown}
        >
          {menu.options.map((option) => (
            <button
              type="button"
              role="option"
              aria-selected={option.value === menu.value}
              className={!option.value ? 'is-empty' : ''}
              key={option.value || 'empty'}
              onClick={() => chooseGrade(option.value)}
            >
              <span>{option.label}</span>{option.value === menu.value && <Check aria-hidden="true" />}
            </button>
          ))}
        </div>
      )}
    </section>
  );
}
