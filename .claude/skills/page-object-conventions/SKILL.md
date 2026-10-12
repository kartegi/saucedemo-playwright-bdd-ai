---
name: page-object-conventions
description: Use when creating or editing Page Objects, step definitions or test data in this repo. Covers locator strategy, where assertions live, naming, and TypeScript rules.
---

# Page Object and step conventions

## Page Objects (`src/pages/`)

- One class per page, named `<Name>Page`, in `<Name>Page.ts`.
- Each page knows its own relative path (for example `readonly path = '/cart.html'`). The base URL
  comes from the Playwright config, never from the page.
- Locators are `readonly` fields assigned in the constructor. Name them for what they are
  (`loginButton`, `errorMessage`), not for their markup.
- Methods are **actions in business language**: `login`, `addToCart`, `sortBy`. They return
  nothing or plain data, and they contain **no `expect`**.

## Components (`src/pages/components/`)

A component object is a Page Object for **one reusable block of the interface** (header, side
menu, modal). Use it when the same block appears on several pages, so its locators live in one
place instead of being copied into every page.

- One class per block, named for the block (`Header`, not `HeaderPage`), in its own file.
- It follows the same rules as a Page Object: `readonly` locators set in the constructor,
  action methods, no `expect`.
- It has no `path`, because it does not own a URL.
- A page exposes it as a `readonly` field, and only pages that really contain the block do this
  (the login page has no header or footer). Steps reach it through the page
  (`inventoryPage.header.openCart()`), never by creating the component themselves.
- Do not create a component for something used on one page only. Keep that in the page.

```ts
// src/pages/components/Header.ts
export class Header {
  readonly cartLink: Locator;

  constructor(page: Page) {
    this.cartLink = page.getByTestId('shopping-cart-link');
  }

  async openCart(): Promise<void> {
    await this.cartLink.click();
  }
}

// inside a page class
this.header = new Header(page);
```

## Locators

Pick the first one that works:

1. `getByTestId` (the config maps it to saucedemo's `data-test` attribute)
2. `getByRole` with an accessible name
3. `getByText`, narrowed with `filter`

CSS or XPath only when nothing above works, and add a comment saying why. For repeated elements,
narrow first and then act: `items.filter({ hasText: name }).getByRole('button', { name: 'Remove' })`.

No `waitForTimeout`. Playwright already waits for elements and for `expect` conditions.

## Step definitions (`features/steps/<domain>.steps.ts`)

- Steps are thin: they call Page Objects. No selectors and no data literals inside them.
- **Assertions live in steps.** Use web-first forms (`toHaveText`, `toBeVisible`, `toHaveCount`),
  not `expect(await locator.textContent())`.
- Type every parameter (`string`, `number`).

## Data and config

- URLs and credentials come from `src/config/env.ts`.
- Reusable test data goes to `src/test-data/`. Do not repeat the same literal in several files.

## TypeScript

- `strict` is on: no `any`, and no `!` unless a comment explains it.
- Use `import type` for type-only imports.
- Use the path aliases from `tsconfig.json` instead of long relative paths.
- Prettier sets the style (single quotes, semicolons, width 100). Run `npm run format` if unsure.
