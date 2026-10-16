/**
 * Checks that a test plan in specs/ has been reviewed, before the generator uses it.
 *
 * A reviewed plan has the line `**Review:** approved` and a `## Status` table whose rows look like
 * `| 1.1 Title | Done | Covered by |` or `| 1.2 Title | Not yet | |`.
 *
 * Usage: node scripts/plan-check.mjs specs/<plan>.md
 */
import { readFileSync } from 'node:fs';

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
    'The plan is not approved. Run the playwright-test-plan-reviewer agent on it. An approved plan\n' +
      'has the line "**Review:** approved".',
  );
}

const rows = [...text.matchAll(/^\| (\d+\.\d+)[^|]*\| (Done|Not yet)\s*\|/gm)];
if (!/^## Status\s*$/m.test(text) || rows.length === 0) {
  problems.push('The plan has no Status table. The reviewer creates it.');
}

if (problems.length > 0) {
  console.error(`${file}\n  ${problems.join('\n  ')}`);
  process.exit(1);
}

const pending = rows.filter((row) => row[2] === 'Not yet').map((row) => row[1]);
console.log(
  `${file} is approved: ${rows.length} item(s), not done yet: ${pending.length > 0 ? pending.join(', ') : 'none'}.`,
);
