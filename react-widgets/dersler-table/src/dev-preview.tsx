// Yalnızca `npm run dev` için: gerçek search.json biçimine benzer örnek
// satırlarla widget'ı tek başına önizler. Üretim build'ine dahil değildir
// (vite.config.ts'in lib.entry'si src/mount.tsx'tir, bu dosya değil).
import { useState } from 'react';
import { createRoot } from 'react-dom/client';

import { DerslerTable, type DerslerRow, type SortKey, type SortDir } from '@/components/ui/dersler-table';
import './index.css';

const initial: DerslerRow[] = [
  {
    key: 'BLG|30154',
    crnHTML: '30154',
    codeHTML: '<b>BLG 102E</b><small>BLG</small>',
    nameHTML: 'Intr. to Prog. Language (Python)',
    instructorHTML: 'Ayşe Yılmaz',
    when: 'Pazartesi 08:30/10:29 | Çarşamba 08:30/10:29',
    where: 'MED B36 | MED B36',
    quotaHTML: '<span class="quota-sade quota-tight">58 / 60 · <span class="quota-state tight">2 yer</span></span>',
    selected: false,
    favorite: true,
  },
  {
    key: 'MAT|10933',
    crnHTML: '10933',
    codeHTML: '<b>MAT 271E</b><small>MAT</small>',
    nameHTML: 'Probability and Statistics',
    instructorHTML: 'Kemal Öztürk',
    when: 'Salı 13:30/15:29',
    where: 'GDB',
    quotaHTML: '<span class="quota-sade quota-full">40 / 40 · <span class="quota-state full">dolu</span></span>',
    selected: true,
    favorite: false,
  },
  {
    key: 'TUR|10007',
    crnHTML: '10007',
    codeHTML: '<b>TUR 112</b><small>TUR</small>',
    nameHTML: 'Yabancı Öğr. İçin Türk Dili II',
    instructorHTML: '·',
    when: 'Pazartesi 13:30/15:29',
    where: '',
    quotaHTML: '<span class="quota-sade">12 / 30</span>',
    selected: false,
    favorite: false,
  },
];

function Preview() {
  const [rows, setRows] = useState(initial);
  const [sortKey, setSortKey] = useState<SortKey>('crn');
  const [sortDir, setSortDir] = useState<SortDir>(1);

  return (
    <DerslerTable
      rows={rows}
      sortKey={sortKey}
      sortDir={sortDir}
      onSortChange={(key) => {
        if (key === sortKey) setSortDir((d) => (d === 1 ? -1 : 1));
        else {
          setSortKey(key);
          setSortDir(1);
        }
      }}
      onRowClick={(key) => console.log('row click', key)}
      onToggleSelect={(key, checked) =>
        setRows((rs) => rs.map((r) => (r.key === key ? { ...r, selected: checked } : r)))
      }
      onToggleFavorite={(key) =>
        setRows((rs) => rs.map((r) => (r.key === key ? { ...r, favorite: !r.favorite } : r)))
      }
      allSelected={rows.length > 0 && rows.every((r) => r.selected)}
      onSelectAll={(checked) => setRows((rs) => rs.map((r) => ({ ...r, selected: checked })))}
      emptyMessage="eşleşen ders yok"
      ariaLabel="Ders listesi"
      labels={{
        crn: 'CRN',
        code: 'Ders',
        name: 'Adı',
        instructor: 'Öğretim Üyesi',
        when: 'Zaman',
        where: 'Yer',
        fill: 'Kontenjan',
        selectSection: 'Şubeyi seç',
        selectAll: 'Tümünü seç',
        addFav: 'Favorilere ekle',
        removeFav: 'Favorilerden çıkar',
      }}
    />
  );
}

createRoot(document.getElementById('app')!).render(<Preview />);
