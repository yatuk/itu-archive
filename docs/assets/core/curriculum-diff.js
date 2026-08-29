import { canonicalCode } from './plan.js?v=de58f9ba3069';

function flatten(plan) {
  const out = new Map();
  (plan?.semesters || []).forEach((sem, semester) => (sem.items || []).forEach((item, index) => {
    if (item.course) {
      const code = canonicalCode(item.course.code);
      if (code) out.set(`course:${code}`, { kind: 'course', code, name: item.course.name || '', semester: semester + 1,
        credits: Number(item.course.credits || 0), ects: Number(item.course.ects || 0), type: item.course.type || '' });
    } else if (item.elective) {
      const id = item.elective.groupId || `${semester}:${index}:${item.elective.title || ''}`;
      out.set(`elective:${id}`, { kind: 'elective', code: item.elective.title || 'Seçmeli ders', semester: semester + 1,
        credits: item.elective.credits || '', ects: (item.elective.ects || []).join('/') });
    }
  }));
  return out;
}

export function compareCurricula(before, after) {
  const a = flatten(before), b = flatten(after), changes = [];
  for (const [key, oldItem] of a) {
    const next = b.get(key);
    if (!next) changes.push({ type: 'removed', before: oldItem });
    else {
      const fields = ['semester', 'credits', 'ects', 'type'];
      const changed = fields.filter((field) => String(oldItem[field] ?? '') !== String(next[field] ?? ''));
      if (changed.length) changes.push({ type: 'changed', before: oldItem, after: next, fields: changed });
    }
  }
  for (const [key, item] of b) if (!a.has(key)) changes.push({ type: 'added', after: item });
  return changes.sort((x, y) => (x.after?.semester || x.before?.semester || 0) - (y.after?.semester || y.before?.semester || 0));
}
