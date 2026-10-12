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
  await expect(inventoryPage.header.cartBadge).toBeHidden();
});

Then('the cart contains {string}', async ({ cartPage }, productName: string) => {
  await expect(cartPage.itemNames).toContainText([productName]);
});

Then('the cart is empty', async ({ cartPage }) => {
  await expect(cartPage.items).toHaveCount(0);
});
