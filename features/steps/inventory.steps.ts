import { expect, Then, When } from '@fixtures/index';
import { SORT_LABELS } from '@pages/InventoryPage';
import { PRODUCTS_COUNT } from '@test-data/products';

type SortLabel = keyof typeof SORT_LABELS;

function toSortLabel(label: string): SortLabel {
  if (!(label in SORT_LABELS)) throw new Error(`Unknown sort option: "${label}"`);
  return label as SortLabel;
}

function isSorted<T extends string | number>(values: T[], direction: 'asc' | 'desc'): boolean {
  const order = direction === 'asc' ? 1 : -1;
  const sorted = [...values].sort((a, b) => (a < b ? -order : a > b ? order : 0));
  return values.every((value, index) => value === sorted[index]);
}

When('I sort products by {string}', async ({ inventoryPage }, label: string) => {
  await inventoryPage.sortBy(SORT_LABELS[toSortLabel(label)]);
});

Then('I should see all products', async ({ inventoryPage }) => {
  await expect(inventoryPage.items).toHaveCount(PRODUCTS_COUNT);
});

Then('the products are sorted by {string}', async ({ inventoryPage }, label: string) => {
  const option = SORT_LABELS[toSortLabel(label)];
  await expect
    .poll(async () => {
      switch (option) {
        case 'az':
          return isSorted(await inventoryPage.getProductNames(), 'asc');
        case 'za':
          return isSorted(await inventoryPage.getProductNames(), 'desc');
        case 'lohi':
          return isSorted(await inventoryPage.getProductPrices(), 'asc');
        case 'hilo':
          return isSorted(await inventoryPage.getProductPrices(), 'desc');
      }
    })
    .toBe(true);
});
