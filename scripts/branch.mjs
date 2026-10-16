/**
 * The branch naming standard of this project and a helper to follow it.
 *
 * A branch is named `<type>/<name>`: the type is one of the types in standards.mjs, the name is lowercase
 * words joined by hyphens, for example `feat/dynamic-catalog` or `fix/login-error-text`.
 *
 * Usage:
 *   node scripts/branch.mjs check [name]   validates a name, the current branch by default
 *   node scripts/branch.mjs create <name>  creates the branch from the latest main and switches to it
 *
 * Through npm: `npm run branch -- create feat/dynamic-catalog`.
 */
import { execFileSync } from 'node:child_process';
import { TYPES } from './standards.mjs';

const MAX_LENGTH = 50;
const PATTERN = new RegExp(`^(${TYPES.join('|')})/[a-z0-9]+(-[a-z0-9]+)*$`);

/** Returns what is wrong with the name, or an empty string when it follows the standard. */
function problemWith(name) {
  if (name === 'main') {
    return 'Do not work on main. Create a branch first: npm run branch -- create <type>/<name>';
  }
  if (!PATTERN.test(name)) {
    return (
      `"${name}" is not a valid branch name.\n` +
      `Use <type>/<name>: the type is one of ${TYPES.join(', ')}, the name is lowercase letters,\n` +
      'digits and single hyphens. Example: feat/dynamic-catalog'
    );
  }
  if (name.length > MAX_LENGTH) {
    return `"${name}" is longer than ${MAX_LENGTH} characters. Make the name shorter.`;
  }
  return '';
}

function git(...args) {
  return execFileSync('git', args, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();
}

function fail(message) {
  console.error(message);
  process.exit(1);
}

function check(name) {
  // Without an argument the current branch is checked. An empty argument is a mistake, not a
  // missing one.
  const explicit = name !== undefined;
  const branch = explicit ? name : git('branch', '--show-current');
  // A detached HEAD (during a rebase, for example) has no name to check
  if (!explicit && !branch) return;
  const problem = problemWith(branch);
  if (problem) fail(problem);
  if (explicit) console.log(`"${branch}" follows the branch naming standard.`);
}

function create(name) {
  if (!name) fail('Usage: node scripts/branch.mjs create <type>/<name>');
  const problem = problemWith(name);
  if (problem) fail(problem);

  const exists = git('branch', '--list', name) !== '';
  if (exists) fail(`The branch "${name}" already exists. Pick another name or switch to it.`);

  // Changes to tracked files would be carried to the new branch by accident. Untracked files, like
  // a test plan in specs/, are fine.
  if (git('status', '--porcelain', '--untracked-files=no') !== '') {
    fail('There are uncommitted changes. Commit or stash them, then create the branch.');
  }

  let base = 'origin/main';
  try {
    git('fetch', 'origin', 'main');
  } catch {
    console.warn('Could not fetch origin/main, the branch is created from the local main.');
    base = 'main';
  }

  git('switch', '--create', name, '--no-track', base);
  console.log(`Created "${name}" from ${base} and switched to it.`);
}

const [command, name] = process.argv.slice(2);
if (command === 'check') check(name);
else if (command === 'create') create(name);
else fail('Usage: node scripts/branch.mjs check [name] | create <name>');
