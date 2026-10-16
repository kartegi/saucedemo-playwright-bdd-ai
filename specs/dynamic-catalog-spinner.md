# Dynamic catalog spinner page

**Review:** approved

## Review

Reviewed by playwright-test-plan-reviewer. Verdict: approved after changes.
Changes:

- Corrected the timing claim: the spinner does not stay "about two seconds". The page source waits a random 500 to 3000 ms (`setTimeout`), so the time differs on every load.
- Old 1.1 (spinner is shown) now needs a paused page clock set up before the page opens. Without it, the spinner can be gone after 500 ms, before the check runs. Marked it as not verified with a paused clock (the MCP tools cannot pause the clock).
- Merged old 1.2 (catalog replaces the spinner) and old 1.3 (shape of every card) into the new 1.1, the `@smoke` happy path. Dropped "the page title stays" (low value) and "no card has an empty or broken part" (it repeats the shape checks).
- Moved the most important items first: catalog loads (1.1), spinner while loading (1.2), the page needs login (1.3), then the optional items.
- Dropped old 1.5 (spinner appears again after a reload). A reload loads the page from scratch, which 1.2 already tests, and the "still logged in" check adds nothing.
- Rewrote old 1.7 (not logged in) so it starts from the seed state. The user logs out with the existing step, then tries to open the page. Wrote in the exact error text, read from the real page.
- Marked old 1.6 (menu while loading) as optional. It is 1.4 now and needs the paused clock. Opening the menu and choosing All Items while the spinner is visible was not verified.
- Marked old 1.4 (no purchase controls) as optional. It is 1.5 now. Dropped its cart check: nothing was added, so the cart is always empty and the check proves nothing.
- Added the verified facts the generator needs (route, test ids, menu path, existing steps to reuse) to the overview.
  Open questions for the user:
- 1.4 and 1.5 are optional. Should the generator include them or leave them out?

## Status

| Plan item                                                                         | Status               | Covered by                                         |
| --------------------------------------------------------------------------------- | -------------------- | -------------------------------------------------- |
| 1.1 Catalog replaces the spinner and every card has a picture, a name and a price | Done                 | Catalog replaces the loading spinner               |
| 1.2 Spinner is shown while the catalog loads                                      | Done                 | Loading spinner is shown while the catalog loads   |
| 1.3 Page is not available after logging out                                       | Done                 | Dynamic catalog is not available after logging out |
| 1.4 Menu works while the catalog loads (optional)                                 | Left out by decision |                                                    |
| 1.5 Loaded catalog has no purchase controls (optional)                            | Left out by decision |                                                    |

Done: 3 of 5 items.

## Application Overview

Plan for the Dynamic Catalog - Spinner page (`/dynamic-catalog-spinner.html`). The user reaches it from the side menu (Dynamic Catalog, then Spinner) or by opening the page directly while logged in. On open, the header with the title "Dynamic Catalog - Spinner" is shown at once, together with a loading indicator (a status labelled "Loading", test id `dynamic-catalog-spinner`). After a random delay of 500 to 3000 ms (a `setTimeout` in the page source, checked during review), the indicator is replaced by a grid of product cards (`dynamic-catalog-spinner-grid`, cards `spinner-item-<n>` with `-img`, `-name`, `-price`). Each card has only a picture (its text alternative is the product name), a name and a price. It has no Add to cart control and no link to details. The cards are not in the same order as on the products page. Do not assert products, prices, order or count, and do not compare the order with the products page: check only the shape of the content. When the user is not logged in, the page sends them to the login page with an error.

Checked existing coverage: features/inventory/inventory.feature, features/cart/cart.feature, features/auth/login.feature, features/auth/logout.feature, features/layout/footer.feature, features/checkout/checkout.feature, and the steps in features/steps/*.ts. Nothing covers the dynamic catalog, any loading state, or what happens when a protected page is opened without logging in. The footer scenario is not repeated here.

Existing steps the generator can reuse: `I am logged in as a {userType} user` (precondition), `I log out`, `I should see the login page`, `I should see the login error {string}`, `I should see the products page`. The header component (`src/pages/components/Header.ts`) already opens the menu and has the cart locators. A new page should extend `AppPage`.

Start state: logged in as a standard user (seed), then the user opens the Dynamic Catalog - Spinner page. Waiting for the catalog uses web-first assertions only, never fixed pauses. The longest delay (3 s) is shorter than the 5 s expect timeout of the project. A check that must see the spinner needs a paused page clock (`page.clock.install()` before the page opens), because the spinner can disappear after 500 ms. In Gherkin this is a business precondition such as "the catalog is still loading", not a step about the clock.

## Test Scenarios

### 1. Dynamic catalog spinner

**Seed:** `tests/seed.spec.ts`

#### 1.1. Catalog replaces the spinner and every card has a picture, a name and a price

**Tag:** `@smoke`

**File:** `features/dynamic-catalog/dynamic-catalog-spinner.feature`

**Steps:**

1. Log in as a standard user (precondition, through the existing logged in step). Open the Dynamic Catalog - Spinner page and wait until loading finishes (web-first, no paused clock). - expect: The loading indicator is no longer visible - expect: At least one product card is shown - expect: Every card has a visible picture with a non-empty text alternative, and the picture loaded (it has a real image size, not a broken image) - expect: Every card has a non-empty name - expect: Every card has a price in the format $12.34

#### 1.2. Spinner is shown while the catalog loads

**Tag:** `@regression`

**File:** `features/dynamic-catalog/dynamic-catalog-spinner.feature`

**Steps:**

1. As a logged in standard user, with the catalog held in its loading state (the page clock is paused before the page opens), open the Dynamic Catalog - Spinner page. - expect: A loading indicator is visible (it announces itself as a status called Loading) - expect: The page header with the title Dynamic Catalog - Spinner is already visible - expect: No product cards are shown yet

- Note: checked without a paused clock (the indicator, the title and the empty grid were seen). Not checked with a paused clock, so the generator must confirm that the spinner stays while the clock is paused. If it does not, mark this item as not testable instead of adding a pause.

#### 1.3. Page is not available after logging out

**Tag:** `@regression`

**File:** `features/dynamic-catalog/dynamic-catalog-spinner.feature`

**Steps:**

1. As a logged in standard user, log out (existing step), then try to open the Dynamic Catalog - Spinner page directly. - expect: The user is on the login page (existing step `I should see the login page`) - expect: The login error reads exactly `Epic sadface: You can only access '/dynamic-catalog-spinner.html' when you are logged in.` (checked on the real page; existing step `I should see the login error {string}`)

#### 1.4. Menu works while the catalog loads (optional)

**Tag:** `@regression`

**File:** `features/dynamic-catalog/dynamic-catalog-spinner.feature`

**Steps:**

1. As a logged in standard user, with the catalog held in its loading state (paused page clock, as in 1.2), open the Dynamic Catalog - Spinner page, open the side menu and go to All Items. - expect: The user lands on the products page (existing step `I should see the products page`)

- Note: optional, it needs the paused clock. Not checked: whether the menu opens and navigates while the clock is paused (the menu has an animation). The menu was opened on this page only after loading. Drop the item if it is not stable.

#### 1.5. Loaded catalog has no purchase controls (optional)

**Tag:** `@regression`

**File:** `features/dynamic-catalog/dynamic-catalog-spinner.feature`

**Steps:**

1. As a logged in standard user, open the Dynamic Catalog - Spinner page and wait until loading finishes. - expect: No card offers adding the product to the cart or opening its details (checked during review: the cards have no buttons and no links)

- Note: optional and of low value. It checks that something is absent, so it passes trivially if the cards are not found. Check that cards are shown before checking the absence.
