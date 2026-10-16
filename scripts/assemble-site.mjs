/**
 * Assembles the GitHub Pages site: the start page from `site/` plus the Allure reports.
 *
 * Every run keeps its own report in `allure/<date>/`. The reports of the previous site are carried
 * over, only the newest ones are kept, and `allure/runs.json` lists them for the start page.
 *
 * Usage:
 *   node scripts/assemble-site.mjs --report allure-report --site site --out _site \
 *     [--previous previous-site] [--history allure-history.jsonl] [--keep 5]
 */
import { cp, mkdir, readdir, readFile, rm, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { parseArgs } from 'node:util';

const { values } = parseArgs({
  options: {
    report: { type: 'string' },
    site: { type: 'string' },
    out: { type: 'string' },
    previous: { type: 'string' },
    history: { type: 'string' },
    keep: { type: 'string', default: '5' },
  },
});

const { report, site, out, previous, history } = values;
const keep = Number(values.keep);

if (!report || !site || !out || !Number.isInteger(keep) || keep < 1) {
  console.error('Usage: assemble-site.mjs --report <dir> --site <dir> --out <dir> [--keep <n>]');
  process.exit(1);
}

const REPORT_ID = /^\d{4}-\d{2}-\d{2}_\d{2}-\d{2}-\d{2}$/;

/** 2026-10-12_13-42-12, in UTC, so the names sort by date. */
function reportId(createdAt) {
  return new Date(createdAt).toISOString().slice(0, 19).replace('T', '_').replaceAll(':', '-');
}

async function readJson(file) {
  return JSON.parse(await readFile(file, 'utf8'));
}

async function listReports(dir) {
  if (!existsSync(dir)) return [];
  const entries = await readdir(dir, { withFileTypes: true });
  return entries.filter((e) => e.isDirectory() && REPORT_ID.test(e.name)).map((e) => e.name);
}

const summaryFile = path.join(report, 'summary.json');
if (!existsSync(summaryFile)) {
  console.error(`No report found: ${summaryFile} is missing`);
  process.exit(1);
}

const allure = path.join(out, 'allure');
await rm(out, { recursive: true, force: true });
await mkdir(allure, { recursive: true });

// 1. The start page
await cp(site, out, { recursive: true });

// 2. The reports of the previous site
if (previous) {
  const carried = await listReports(path.join(previous, 'allure'));
  for (const id of carried) {
    await cp(path.join(previous, 'allure', id), path.join(allure, id), { recursive: true });
  }
  console.log(`Carried over ${carried.length} earlier report(s)`);
} else {
  console.log('No previous site, starting a new archive');
}

// 3. The report of this run
const current = await readJson(summaryFile);
const id = reportId(current.createdAt);
await cp(report, path.join(allure, id), { recursive: true });

// 4. Keep only the newest reports
const ids = (await listReports(allure)).sort().reverse();
for (const old of ids.slice(keep)) {
  await rm(path.join(allure, old), { recursive: true, force: true });
  console.log(`Removed the old report ${old}`);
}

// 5. The index the start page reads
const runs = [];
for (const kept of ids.slice(0, keep)) {
  const summary = await readJson(path.join(allure, kept, 'summary.json'));
  runs.push({
    id: kept,
    createdAt: summary.createdAt,
    total: summary.stats.total,
    passed: summary.stats.passed,
    status: summary.status,
  });
}
await writeFile(path.join(allure, 'runs.json'), `${JSON.stringify(runs, null, 2)}\n`);

// 6. /allure/ opens the newest report
const newest = runs[0].id;
await writeFile(
  path.join(allure, 'index.html'),
  `<!doctype html>
<meta charset="utf-8" />
<meta http-equiv="refresh" content="0; url=${newest}/" />
<title>Allure report</title>
<a href="${newest}/">Open the newest Allure report</a>
`,
);

// 7. The history of the runs, picked up by the next run
if (history && existsSync(history)) {
  await cp(history, path.join(allure, 'history.jsonl'));
}

console.log(`Site assembled in ${out}: ${runs.length} report(s), the newest is ${newest}`);
