# CLAUDE.md

UI end-to-end tests for [saucedemo.com](https://www.saucedemo.com).
Stack: **Playwright + TypeScript (strict) + playwright-bdd** (Gherkin).

I'm building this project myself, step by step, one pull request per feature. Claude helps me with
it, so work on the current task only: don't create files, folders or layers for things we haven't
reached yet.

## Commands

| Command            | Purpose                                                          |
| ------------------ | ---------------------------------------------------------------- |
| `npm run check`    | typecheck + eslint + prettier. **Run before finishing any task** |
| `npm run lint:fix` | Auto-fix ESLint issues                                           |
| `npm run format`   | Format everything with Prettier                                  |

## Structure

- `src/config/env.ts`: typed environment config. URLs and credentials come from here; defaults
  work without a `.env` file.

## Rules

1. **Reuse existing steps.** Never create a second step with the same text.
2. **Actions in Page Objects, assertions (`expect`) in step definitions.**
3. **Locators:** `getByTestId` (configured to saucedemo's `data-test`) first, then `getByRole`.
   No CSS/XPath unless nothing else works; explain why in a comment.
4. **No `waitForTimeout`.** Rely on auto-waiting and web-first assertions. If a pause is truly
   unavoidable, comment why (the linter warns).
5. **Scenarios are independent.** Each one prepares its own state.
6. **No hardcoded credentials or URLs** in steps or pages; take them from `env.ts`.
7. **Gherkin is declarative:** business actions, not clicks and selectors. Details are in the
   `gherkin-conventions` skill.
8. **Tags:** a feature tag on the `Feature:` line (`@auth`, `@cart`...); `@smoke` for the critical
   happy path only; everything else `@regression`.
9. **TypeScript:** no `any`, `import type` for types, use the path aliases from `tsconfig.json`.
10. **English everywhere:** code, comments, scenarios, commit messages and PR text are in English,
    even when I write to you in another language.

## Skills

Project skills live in `.claude/skills/`. Use them when you write the matching code:

- `gherkin-conventions`: how to write `.feature` files and step phrases.
- `page-object-conventions`: how to write Page Objects and step definitions.

## Git workflow

- One branch and PR per feature or concern (`feat/cart`, `ci/e2e-tests`, `chore/...`).
- Small commits in Conventional Commits style: `feat(cart): add CartPage`.
- Do not commit, push, or open PRs unless asked. Never use `--no-verify`.

## Notes

- Keep this file in sync with the code: update it in the PR that changes commands, structure or
  rules.
- Public demo credentials only; never put real secrets in `.env.example`.
