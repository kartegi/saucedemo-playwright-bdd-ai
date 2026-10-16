import type { Locator } from '@playwright/test';
import { expect, Then, When } from '@fixtures/index';
import type { InventoryPage, SortOption } from '@pages/InventoryPage';
import { expectLoadedPicture, PRICE_FORMAT } from './expectations';

type Compare = (a: string, b: string) => number;

// The shop compares names with localeCompare, so the check does the same
const byName: Compare = (a, b) => a.localeCompare(b);
const byPrice: Compare = (a, b) => Number(a.replace('$', '')) - Number(b.replace('$', ''));

/** Which list of the page a sort order arranges, and how. */
const sortedList: Record<SortOption, { list: (page: InventoryPage) => Locator; compare: Compare }> =
  {
    az: { list: (page) => page.itemNames, compare: byName },
    za: { list: (page) => page.itemNames, compare: (a, b) => byName(b, a) },
    lohi: { list: (page) => page.itemPrices, compare: byPrice },
    hilo: { list: (page) => page.itemPrices, compare: (a, b) => byPrice(b, a) },
  };

When('I sort products by {sortOrder}', async ({ inventoryPage }, option: SortOption) => {
  await inventoryPage.sortBy(option);
});

When('I add {string} to the cart', async ({ inventoryPage }, productName: string) => {
  await inventoryPage.addToCart(productName);
});

When('I remove {string} on the products page', async ({ inventoryPage }, productName: string) => {
  await inventoryPage.removeFromCart(productName);
});

Then(
  'every product in the catalog has a picture, a name, a description and a price',
  async ({ inventoryPage }) => {
    await expect(inventoryPage.items.first()).toBeVisible();
    for (const item of await inventoryPage.items.all()) {
      await expectLoadedPicture(inventoryPage.itemPicture(item));
      await expect(inventoryPage.itemName(item)).toHaveText(/\S/);
      await expect(inventoryPage.itemDescription(item)).toHaveText(/\S/);
      await expect(inventoryPage.itemPrice(item)).toHaveText(PRICE_FORMAT);
    }
  },
);

Then('every product in the catalog can be added to the cart', async ({ inventoryPage }) => {
  await expect(inventoryPage.items.first()).toBeVisible();
  for (const item of await inventoryPage.items.all()) {
    await expect(inventoryPage.addToCartButton(item)).toBeEnabled();
  }
});

Then('the products are sorted by {sortOrder}', async ({ inventoryPage }, option: SortOption) => {
  const { list, compare } = sortedList[option];
  const values = list(inventoryPage);
  await expect(values.first()).toBeVisible();
  // Sorting changes the order of the values, not the values themselves. So the expected order can
  // be built from what is shown now, even if the list is still being redrawn.
  const expected = (await values.allTextContents()).sort(compare);
  await expect(values).toHaveText(expected);
});
