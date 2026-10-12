# SauceDemo UI Tests

[![CI](https://github.com/kartegi/saucedemo-playwright-bdd-ai/actions/workflows/ci.yml/badge.svg)](https://github.com/kartegi/saucedemo-playwright-bdd-ai/actions/workflows/ci.yml)

End-to-end UI test framework for [saucedemo.com](https://www.saucedemo.com), built with
**Playwright**, **TypeScript** and **Playwright BDD** (Gherkin).

## Tech stack

| Area           | Tool                                                                |
| -------------- | ------------------------------------------------------------------- |
| Test runner    | [Playwright Test](https://playwright.dev)                           |
| BDD / Gherkin  | [playwright-bdd](https://vitalets.github.io/playwright-bdd)         |
| Language       | TypeScript (strict mode, path aliases)                              |
| Design pattern | Page Object Model + Playwright fixtures                             |
| Reporting      | Playwright HTML report, [Allure Report 3](https://allurereport.org) |
| Code quality   | ESLint (typescript-eslint + playwright plugin), Prettier            |
| Git hooks      | Husky + lint-staged                                                 |

## Getting started

```bash
npm install
npx playwright install --with-deps   # download browsers
cp .env.example .env                 # required: user names and the password are read from .env
npm test
```

## Commands

| Command                   | Description                                               |
| ------------------------- | --------------------------------------------------------- |
| `npm test`                | Generate specs from `.feature` files and run all tests    |
| `npm run test:smoke`      | Only scenarios tagged `@smoke`                            |
| `npm run test:regression` | Only scenarios tagged `@regression`                       |
| `npm run test:chromium`   | One browser (`test:firefox` and `test:webkit` also exist) |
| `npm run test:headed`     | Run with a visible browser                                |
| `npm run test:ui`         | Playwright UI mode                                        |
| `npm run test:debug`      | Playwright Inspector                                      |
| `npm run report`          | Open the last Playwright HTML report                      |
| `npm run allure:generate` | Build the Allure report from `allure-results/`            |
| `npm run allure:open`     | Open the generated Allure report                          |
| `npm run codegen`         | Record actions and get locator suggestions                |
| `npm run check`           | Typecheck + lint + format check                           |
| `npm run lint`            | ESLint (`lint:fix` to auto-fix)                           |
| `npm run format`          | Prettier (`format:check` to verify only)                  |

Run one scenario by its title (everything after `--` goes to Playwright):

```bash
npm test -- --project=chromium -g "Successful login"
```

## Project structure

```
features/
  auth/login.feature       Gherkin scenarios, one folder per area
  steps/                   Step definitions and custom parameter types
src/
  config/env.ts            Typed environment config, reads .env
  fixtures/index.ts        Playwright `test` extended with page objects
  pages/                   Page Objects, one class per page
  test-data/               Users and other reusable data
```

`.features-gen/` is generated from the `.feature` files by `npm test`. It is not committed.

## CI

GitHub Actions runs on every pull request and on every push to `main`:

1. `quality`: typecheck, lint and format check (`npm run check`).
2. `e2e`: the tests in Chromium, Firefox and WebKit, one job per browser. It starts only after
   `quality` passes. The Playwright report, traces, screenshots and videos of failed tests and the
   raw Allure results are uploaded as artifacts.
3. `allure-report`: collects the Allure results of all browsers into one report and uploads it as
   the `allure-report` artifact. On `main` it also assembles the site (see below).
4. `deploy-pages`: on `main` only, publishes the site to GitHub Pages.

The user names and the password come from repository secrets (`STANDARD_USER`,
`LOCKED_OUT_USER`, `PROBLEM_USER`, `PERFORMANCE_GLITCH_USER`, `USER_PASSWORD`). The workflow can
also be started by hand from the Actions tab, with an optional tag or title filter such as
`@smoke`.

## Online report

Every run on `main` publishes the site to GitHub Pages:

- `https://kartegi.github.io/saucedemo-playwright-bdd-ai/` is the start page (`site/index.html`).
- `.../allure/` is the latest Allure report, with the history of the previous runs on `main`.

The history is a file (`allure/history.jsonl`) that is published together with the report. The next
run downloads it, adds itself and publishes it again. Pull requests build the report as an artifact
only. The attachments of failed tests (screenshot, video, trace and error context) stay in the
published report, so a failure can be investigated from the page alone.

## How I write tests

- **Scenarios describe what the user does, not what the screen looks like.**
  `I add "Sauce Labs Backpack" to the cart` instead of "I click the button".
- **Page Objects know how to use a page** (find elements, click, type).
  **Steps check the result** (`expect`).
- **Elements are found by test id first** (saucedemo uses the `data-test` attribute), then by role.
  CSS and XPath only when nothing else works.
- **No fixed pauses.** Playwright already waits for elements, so `waitForTimeout` is a last resort.
- **Every test prepares its own state** and doesn't depend on other tests.
- **Tags:** `@smoke` for the few most important quick checks, `@regression` for everything else,
  plus a tag for the area (`@cart`, `@auth`).
- **Git:** one branch and one PR per feature, small commits with clear messages
  (`feat: add CartPage`).
