/**
 * Checks that a test plan in specs/ has been reviewed, before the generator uses it.
 *
 * A reviewed plan has the line `**Review:** approved` and a `## Status` table with one row per plan
 * item: `| 1.1 Title | Done | Covered by |`, `| 1.2 Title | Not yet | |` or
 * `| 1.3 Title | Left out | |`. Every row is checked, so a status nobody knows cannot hide an item.
 * The line `Done: x of y items.` below the table must match the table.
 *
 * Usage: node scripts/plan-check.mjs specs/<plan>.md
 */
import { readFileSync } from 'node:fs';

const STATUSES = ['Done', 'Not yet', 'Left out'];

const file = process.argv[2];
if (!file) {
  console.error('Usage: node scripts/plan-check.mjs specs/<plan>.md');
  process.exit(1);
}

let text;
try {
  text = readFileSync(file, 'utf8');
} catch {
  console.error(`Cannot read ${file}.`);
  process.exit(1);
}

const problems = [];
if (!/^\*\*Review:\*\* approved\s*$/m.test(text)) {
  problems.push(
    'The plan is not approved. Run the playwright-test-plan-reviewer agent on it.\n' +
      '    An approved plan has the line "**Review:** approved".',
  );
}

// The Status section runs from its heading to the next heading of the same level
const section = text.match(/^## Status[ \t]*\n([\s\S]*?)(?=^## |(?![\s\S]))/m)?.[1] ?? '';
const cells = (line) =>
  line
    .trim()
    .replace(/^\||\|$/g, '')
    .split('|')
    .map((cell) => cell.trim());
// Table rows without the header and the separator line
const rows = section
  .split('\n')
  .filter((line) => line.trim().startsWith('|'))
  .slice(2)
  .map(cells);

if (rows.length === 0) {
  problems.push('The plan has no Status table. The reviewer creates it.');
}

const items = [];
for (const [title = '', status = ''] of rows) {
  const id = title.match(/^\d+\.\d+/)?.[0];
  if (!id) {
    problems.push(`The row "${title}" does not start with the number of a plan item, like 1.1.`);
  } else if (!STATUSES.includes(status)) {
    problems.push(`Item ${id} has the status "${status}". Use one of: ${STATUSES.join(', ')}.`);
  } else {
    items.push({ id, status });
  }
}

const done = items.filter((item) => item.status === 'Done').length;
const summary = section.match(/^Done: (\d+) of (\d+) items?\.\s*$/m);
if (summary && (Number(summary[1]) !== done || Number(summary[2]) !== rows.length)) {
  problems.push(
    `The line "${summary[0].trim()}" does not match the table: ${done} of ${rows.length} are done.`,
  );
}

if (problems.length > 0) {
  console.error(`${file}\n  ${problems.join('\n  ')}`);
  process.exit(1);
}

const list = (status) => {
  const ids = items.filter((item) => item.status === status).map((item) => item.id);
  return ids.length > 0 ? ids.join(', ') : 'none';
};
console.log(
  `${file} is approved: ${items.length} item(s), done ${done}, ` +
    `not done yet: ${list('Not yet')}, left out: ${list('Left out')}.`,
);
