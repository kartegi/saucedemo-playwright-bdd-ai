import { expect, Then, When } from '@fixtures/index';

When('I open the shopping cart', async ({ inventoryPage }) => {
  await inventoryPage.header.openCart();
});

When('I remove {string} on the cart page', async ({ cartPage }, productName: string) => {
  await cartPage.removeItem(productName);
});

When('I continue shopping', async ({ cartPage }) => {
  await cartPage.continueShopping();
});

Then('the cart badge shows {int}', async ({ inventoryPage }, count: number) => {
  await expect(inventoryPage.header.cartBadge).toHaveText(String(count));
});

Then('the cart badge is not displayed', async ({ inventoryPage }) => {
  // The header must be there, otherwise a missing badge proves nothing
  await expect(inventoryPage.header.cartLink).toBeVisible();
  await expect(inventoryPage.header.cartBadge).toBeHidden();
});

// The products page shows its items with the same test ids, so both checks first make sure that
// the cart page is open.
Then('the cart contains {string}', async ({ cartPage }, productName: string) => {
  await expect(cartPage.title).toHaveText(cartPage.titleText);
  await expect(cartPage.itemNames).toContainText([productName]);
});

Then('the cart is empty', async ({ cartPage }) => {
  await expect(cartPage.title).toHaveText(cartPage.titleText);
  await expect(cartPage.items).toHaveCount(0);
});
