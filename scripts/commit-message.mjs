/**
 * The commit message standard of this project: Conventional Commits without a scope.
 *
 * The first line is `<type>: <description>`. The type is one of the types in standards.mjs. The
 * description starts with a lowercase letter or a digit, has no period at the end and is written in
 * English (plain ASCII). The whole line has at most 72 characters. Examples:
 *   feat: add the cart page
 *   fix: wait for the spinner to disappear
 *
 * Usage:
 *   node scripts/commit-message.mjs <file>            checks the message file of a commit (hook)
 *   node scripts/commit-message.mjs --text "<line>"   checks one line, for example a pull request title
 *   node scripts/commit-message.mjs --range <range>   checks every commit of a git range
 */
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { TYPES } from './standards.mjs';

const MAX_LENGTH = 72;
const FORMAT = new RegExp(`^(${TYPES.join('|')}): [a-z0-9]`);
const SCOPE = /^[a-z]+\(.*\)!?:/;
// Messages that git creates on its own
const AUTOMATIC = /^(Merge |Revert "|fixup! |squash! )/;

const SUMMARY =
  `A commit message looks like "<type>: <description>". The type is one of ${TYPES.join(', ')}.\n` +
  'No scope, English only, the description starts with a lowercase letter, no period at the end,\n' +
  `at most ${MAX_LENGTH} characters. Example: feat: add the cart page`;

/** Returns what is wrong with the first line of a message, or an empty string when it is fine. */
function problemWith(header) {
  if (AUTOMATIC.test(header)) return '';
  if (!header) return 'The message is empty.';
  if (SCOPE.test(header))
    return 'Do not use a scope: write "feat: add the cart page", not "feat(cart): ...".';
  if (!FORMAT.test(header)) {
    return `It does not start with "<type>: " followed by a lowercase letter or a digit.`;
  }
  if (/[^\x20-\x7E]/.test(header)) return 'Use English: only plain ASCII characters are allowed.';
  if (header.endsWith('.')) return 'Do not end the line with a period.';
  if (header.length > MAX_LENGTH) {
    return `The line has ${header.length} characters, the limit is ${MAX_LENGTH}.`;
  }
  return '';
}

/** The first line of a commit message file, without the comment lines git adds in an editor. */
function headerOf(file) {
  const lines = readFileSync(file, 'utf8').split('\n');
  return (lines.find((line) => !line.startsWith('#')) ?? '').trimEnd();
}

function report(headers) {
  const wrong = headers
    .map((header) => [header, problemWith(header)])
    .filter(([, problem]) => problem);
  for (const [header, problem] of wrong) console.error(`"${header}"\n  ${problem}`);
  if (wrong.length > 0) {
    console.error(`\n${SUMMARY}`);
    process.exit(1);
  }
}

const [mode, value] = process.argv.slice(2);
if (mode === '--text') {
  report([(value ?? '').trimEnd()]);
} else if (mode === '--range' && value) {
  let subjects;
  try {
    subjects = execFileSync('git', ['log', '--no-merges', '--format=%s', value], {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'pipe'],
    })
      .split('\n')
      .filter(Boolean);
  } catch (error) {
    console.error(`Could not read the commits of ${value}:\n${error.stderr}`);
    console.error('Is the whole history fetched? In CI the checkout needs fetch-depth: 0.');
    process.exit(1);
  }
  report(subjects);
  console.log(`${subjects.length} commit message(s) follow the standard.`);
} else if (mode && !mode.startsWith('--')) {
  report([headerOf(mode)]);
} else {
  console.error(
    'Usage: node scripts/commit-message.mjs <file> | --text "<line>" | --range <range>',
  );
  process.exit(1);
}
