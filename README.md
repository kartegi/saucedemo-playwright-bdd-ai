# SauceDemo UI Tests

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
```

## Commands

| Command             | Description                              |
| ------------------- | ---------------------------------------- |
| `npm run check`     | Typecheck + lint + format check          |
| `npm run typecheck` | TypeScript compiler, no emit             |
| `npm run lint`      | ESLint (`lint:fix` to auto-fix)          |
| `npm run format`    | Prettier (`format:check` to verify only) |

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
  (`feat(cart): add CartPage`).
