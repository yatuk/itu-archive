import { ArrowDown, ArrowUp, ArrowUpDown, FileClock, GraduationCap, Star } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

// Bu widget yalnızca tablo KABUĞUNU (sıralama başlığı, seçim/favori
// etkileşimi, satır tıklaması) yönetir. Arama vurgusu (<mark>), kontenjan
// renklendirmesi, mezuniyet/ek sınav rozeti gibi iş kuralları zaten
// courses.js'te test edilmiş halde var (markField, quotaDisplay,
// specialSectionKind) — burada tekrar yazılmadı, hazır HTML parçası olarak
// props'tan geliyor. Sıralama da courses.js'teki state.sort'un tek kaynak
// olması için "manuel": React yalnızca ok ikonunu gösterir, gerçek sıralama
// vanilla tarafta olur (bkz. onSortChange).
export interface DerslerRow {
  key: string;
  crnHTML: string;
  codeHTML: string;
  nameHTML: string;
  kind?: 'extra-exam' | 'graduation' | '';
  kindLabel?: string;
  kindHelp?: string;
  instructorHTML: string;
  when: string;
  where: string;
  quotaHTML: string;
  selected: boolean;
  favorite: boolean;
}

export type SortKey = 'crn' | 'code' | 'name' | 'instructor' | 'when' | 'fill';
export type SortDir = 1 | -1;

export interface DerslerTableProps {
  rows: DerslerRow[];
  sortKey: SortKey;
  sortDir: SortDir;
  onSortChange: (key: SortKey) => void;
  onRowClick: (key: string) => void;
  onToggleSelect: (key: string, checked: boolean) => void;
  onToggleFavorite: (key: string) => void;
  allSelected: boolean;
  onSelectAll: (checked: boolean) => void;
  emptyMessage: string;
  ariaLabel: string;
  labels: Record<'crn' | 'code' | 'name' | 'instructor' | 'when' | 'where' | 'fill' | 'selectSection' | 'selectAll' | 'addFav' | 'removeFav', string>;
}

function sessions(s: string): string[] {
  return s ? s.split(' | ').map((part) => part.replace('/', '-')) : ['·'];
}

function SortButton({
  label,
  active,
  dir,
  onClick,
}: {
  label: string;
  active: boolean;
  dir: SortDir;
  onClick: () => void;
}) {
  const Icon = !active ? ArrowUpDown : dir === 1 ? ArrowUp : ArrowDown;
  return (
    <Button variant="ghost" size="sm" onClick={onClick} className="th-sort dt--ml-3">
      {label}
      <Icon className={`dt-ml-1.5 dt-inline dt-size-3.5${active ? '' : ' dt-opacity-40'}`} />
    </Button>
  );
}

export function DerslerTable(props: DerslerTableProps) {
  const { rows, sortKey, sortDir, onSortChange, onRowClick, onToggleSelect, onToggleFavorite, allSelected, onSelectAll, emptyMessage, ariaLabel, labels } = props;

  if (!rows.length) {
    return <p className="dt-p-6 dt-text-center dt-text-sm dt-text-muted-foreground">{emptyMessage}</p>;
  }

  const sortCol = (key: SortKey, label: string) => (
    <SortButton label={label} active={sortKey === key} dir={sortDir} onClick={() => onSortChange(key)} />
  );

  return (
    <div id="results" className="dersler-table-root dt-overflow-hidden dt-rounded-lg dt-border dt-border-border">
      <Table aria-label={ariaLabel}>
        <TableHeader>
          <TableRow>
            <TableHead className="dt-h-9 dt-w-8 dt-p-2">
              <input
                type="checkbox"
                className="dt-size-4"
                checked={allSelected}
                aria-label={labels.selectAll}
                onChange={(e) => onSelectAll(e.target.checked)}
              />
            </TableHead>
            <TableHead className="dt-h-9 dt-w-8 dt-p-2" />
            <TableHead className="dt-h-9 dt-p-2" data-sort="crn" aria-sort={sortKey === 'crn' ? (sortDir === 1 ? 'ascending' : 'descending') : 'none'}>{sortCol('crn', labels.crn)}</TableHead>
            <TableHead className="dt-h-9 dt-p-2" data-sort="code" aria-sort={sortKey === 'code' ? (sortDir === 1 ? 'ascending' : 'descending') : 'none'}>{sortCol('code', labels.code)}</TableHead>
            <TableHead className="dt-h-9 dt-p-2" data-sort="name" aria-sort={sortKey === 'name' ? (sortDir === 1 ? 'ascending' : 'descending') : 'none'}>{sortCol('name', labels.name)}</TableHead>
            <TableHead className="dt-h-9 dt-p-2" data-sort="instructor" aria-sort={sortKey === 'instructor' ? (sortDir === 1 ? 'ascending' : 'descending') : 'none'}>{sortCol('instructor', labels.instructor)}</TableHead>
            <TableHead className="dt-h-9 dt-p-2" data-sort="when" aria-sort={sortKey === 'when' ? (sortDir === 1 ? 'ascending' : 'descending') : 'none'}>{sortCol('when', labels.when)}</TableHead>
            <TableHead className="dt-h-9 dt-p-2">{labels.where}</TableHead>
            <TableHead className="dt-h-9 dt-p-2 dt-text-right" data-sort="fill" aria-sort={sortKey === 'fill' ? (sortDir === 1 ? 'ascending' : 'descending') : 'none'}>{sortCol('fill', labels.fill)}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody id="rows">
          {rows.map((row) => (
            <TableRow key={row.key} className="dt-cursor-pointer" onClick={() => onRowClick(row.key)}>
              <TableCell className="dt-p-2" onClick={(e) => e.stopPropagation()}>
                <input
                  type="checkbox"
                  className="dt-size-4"
                  checked={row.selected}
                  aria-label={labels.selectSection}
                  onChange={(e) => onToggleSelect(row.key, e.target.checked)}
                />
              </TableCell>
              <TableCell className="dt-p-2" onClick={(e) => e.stopPropagation()}>
                <button
                  type="button"
                  className="dt-text-base dt-leading-none"
                  aria-label={row.favorite ? labels.removeFav : labels.addFav}
                  aria-pressed={row.favorite}
                  onClick={() => onToggleFavorite(row.key)}
                >
                  <Star aria-hidden="true" className="dt-size-4" fill={row.favorite ? 'currentColor' : 'none'} />
                </button>
              </TableCell>
              <TableCell className="dt-p-2 dt-font-mono dt-text-muted-foreground" dangerouslySetInnerHTML={{ __html: row.crnHTML }} />
              <TableCell className="dt-p-2" dangerouslySetInnerHTML={{ __html: row.codeHTML }} />
              <TableCell className="dt-p-2">
                <div className="dt-course-name"><span dangerouslySetInnerHTML={{ __html: row.nameHTML }} />{row.kind && <span className={`dt-kind-badge ${row.kind}`} title={row.kindHelp}>{row.kind === 'extra-exam' ? <FileClock aria-hidden="true" /> : <GraduationCap aria-hidden="true" />}<b>{row.kindLabel}</b></span>}</div>
              </TableCell>
              <TableCell className="dt-p-2" dangerouslySetInnerHTML={{ __html: row.instructorHTML }} />
              <TableCell className="dt-p-2 dt-font-mono dt-text-xs">
                {sessions(row.when).map((line, i) => (
                  <div key={i}>{line}</div>
                ))}
              </TableCell>
              <TableCell className="dt-p-2 dt-text-xs dt-text-muted-foreground">
                {row.where ? sessions(row.where).map((line, i) => <div key={i}>{line}</div>) : '·'}
              </TableCell>
              <TableCell className="dt-p-2 dt-text-right dt-tabular-nums" dangerouslySetInnerHTML={{ __html: row.quotaHTML }} />
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
