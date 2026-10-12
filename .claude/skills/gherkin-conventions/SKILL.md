---
name: gherkin-conventions
description: Use when writing or editing .feature files or step phrases in this repo. Covers the format of Gherkin scenarios, step wording, tags, and when to use Background or Scenario Outline.
---

# Gherkin conventions

A scenario describes **behaviour a user cares about**, not how the UI is operated.

## Feature file

- Put it in `features/<domain>/<domain>.feature`, one folder per area of the shop
  (for example `auth`, `inventory`, `cart`, `checkout`).
- Put the feature tag on the `Feature:` line; every scenario inherits it.
- Start with the user story:

```gherkin
@cart
Feature: Shopping cart
  As a customer
  I want to manage items in my cart
  So that I only buy what I need
```

## Scenarios

- The title says what is verified: `Remove a product from the cart`, not `Test 3` or `Click remove`.
- One behaviour per scenario. Prefer a single `When` and `Then` pair. Several are fine only for a
  real multi-step flow, such as placing an order.
- `Given` sets the state, `When` is what the user does, `Then` is what they can see. Never assert
  in a `When`.
- Use `Background` only for steps that **every** scenario in the file needs, and keep it short
  (about four steps at most).
- Use `Scenario Outline` with `Examples` when the same flow runs on different data, such as
  invalid input. Column names must match the `<placeholders>`.

## Step wording

- First person, present tense: `I add "Sauce Labs Backpack" to the cart`.
- Put data in double quotes (`{string}`) and use `{int}` for numbers.
- Kinds of user use the custom `{userType}` parameter (`standard`, `locked out`, `problem`,
  `performance glitch`): `I log in as a locked out user`.
- **Do not use these words in a step:** click, press, button, field, input, selector, id, url,
  xpath. Say what the user does, not how the interface is operated.
- Write expected error messages exactly as the application shows them.
- Before writing a phrase, read `features/steps/*.ts`. If an existing step already says what you
  need, reuse its phrase instead of inventing a new one.

Bad and good:

```gherkin
# bad: describes the UI
When I click the "Add to cart" button on the first item
Then the span with class shopping_cart_badge has text 1

# good: describes behaviour
When I add "Sauce Labs Backpack" to the cart
Then the cart badge shows 1
```

## Tags

- `@smoke`: the critical happy path of a feature, fast. Usually one scenario per feature.
- `@regression`: everything else. Each scenario has exactly one of the two.
- The area tag (`@auth`, `@inventory`, `@cart`, `@checkout`) goes on the `Feature:` line.
