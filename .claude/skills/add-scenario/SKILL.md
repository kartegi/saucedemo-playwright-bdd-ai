---
name: add-scenario
description: Use when asked to add, extend or cover a feature, scenario, page or user flow with UI tests in this repo ("add a test for...", "cover X"). Walks through the whole workflow from reading existing steps to a green check.
---

# Add a scenario

Follow these steps in order and do not skip the verification.

1. **See what already exists.** Read the target `.feature` file (or the closest one),
   `features/steps/*.ts`, and the Page Objects in `src/pages/`. Note which steps, pages and test
   data you can reuse.
2. **If a page or element is new, look at the real page before writing locators.** Use the
   Playwright browser tools if you have them: open https://www.saucedemo.com and inspect the DOM.
   Log in with the credentials from my local `.env`. Without browser tools, ask me to
   run `npm run codegen` and share what it shows. Prefer `data-test` attributes.
3. **Write the scenario** following the `gherkin-conventions` skill.
4. **Run `npx bddgen`.** It prints a snippet for every missing step. Implement only those; every
   other phrase must reuse an existing step.
5. **Implement what is missing** following the `page-object-conventions` skill: new locators and
   actions in Page Objects, assertions in steps, new pages registered in `src/fixtures/index.ts`.
6. **Run the new scenario:**
   `npm test -- --project=chromium -g "<scenario title>"`.
   If it fails, find the cause (selector, timing, wrong expectation). Do not add waits or weaken
   the assertion just to get green.
7. **Run the whole feature, then `npm run check`.** Both must pass.
8. **Report briefly:** which scenarios you added, which steps were reused and which were new, and
   the test result. Do not commit unless I ask.

If the expected behaviour is unclear, for example when the application behaves differently from
what the request assumes, stop and ask instead of encoding a guess.
