import type { Locator, Page } from '@playwright/test';
import { AppPage } from './AppPage';

export type SortOption = 'az' | 'za' | 'lohi' | 'hilo';

export const SORT_LABELS = {
  'Name (A to Z)': 'az',
  'Name (Z to A)': 'za',
  'Price (low to high)': 'lohi',
  'Price (high to low)': 'hilo',
} as const satisfies Record<string, SortOption>;

export type SortLabel = keyof typeof SORT_LABELS;

export class InventoryPage extends AppPage {
  readonly path = '/inventory.html';
  readonly titleText = 'Products';

  readonly items: Locator;
  readonly itemNames: Locator;
  readonly itemPrices: Locator;
  readonly sortDropdown: Locator;

  constructor(page: Page) {
    super(page);
    this.items = page.getByTestId('inventory-item');
    this.itemNames = page.getByTestId('inventory-item-name');
    this.itemPrices = page.getByTestId('inventory-item-price');
    this.sortDropdown = page.getByTestId('product-sort-container');
  }

  itemPicture(item: Locator): Locator {
    return item.getByTestId(/-img$/);
  }

  itemName(item: Locator): Locator {
    return item.getByTestId('inventory-item-name');
  }

  itemDescription(item: Locator): Locator {
    return item.getByTestId('inventory-item-desc');
  }

  itemPrice(item: Locator): Locator {
    return item.getByTestId('inventory-item-price');
  }

  addToCartButton(item: Locator): Locator {
    return item.getByRole('button', { name: 'Add to cart' });
  }

  private item(productName: string): Locator {
    return this.items.filter({ hasText: productName });
  }

  async addToCart(productName: string): Promise<void> {
    await this.addToCartButton(this.item(productName)).click();
  }

  async removeFromCart(productName: string): Promise<void> {
    await this.item(productName).getByRole('button', { name: 'Remove' }).click();
  }

  async sortBy(option: SortOption): Promise<void> {
    await this.sortDropdown.selectOption(option);
  }
}
