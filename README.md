# SauceDemo UI Tests

[![CI](https://github.com/kartegi/saucedemo-playwright-bdd-ai/actions/workflows/ci.yml/badge.svg)](https://github.com/kartegi/saucedemo-playwright-bdd-ai/actions/workflows/ci.yml)

End-to-end UI test framework for [saucedemo.com](https://www.saucedemo.com), built with
**Playwright**, **TypeScript** and **Playwright BDD** (Gherkin).

## Tech stack

| Area           | Tool                                                        |
| -------------- | ----------------------------------------------------------- |
| Test runner    | [Playwright Test](https://playwright.dev)                   |
| BDD / Gherkin  | [playwright-bdd](https://vitalets.github.io/playwright-bdd) |
| Language       | TypeScript (strict mode, path aliases)                      |
| Design pattern | Page Object Model + Playwright fixtures                     |
| Code quality   | ESLint (typescript-eslint + playwright plugin), Prettier    |
| Git hooks      | Husky + lint-staged                                         |

## Getting started

```bash
npm install
npx playwright install --with-deps   # download browsers
cp .env.example .env                 # optional: defaults already point to saucedemo.com
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
| `npm run report`          | Open the last HTML report                                 |
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
  config/env.ts            Typed environment config (.env + defaults)
  fixtures/index.ts        Playwright `test` extended with page objects
  pages/                   Page Objects, one class per page
  test-data/               Users and other reusable data
```

`.features-gen/` is generated from the `.feature` files by `npm test`. It is not committed.

## CI

GitHub Actions runs `npm run check` on every pull request and on every push to `main`.

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
