import type { Locator, Page } from '@playwright/test';
import { AppPage } from './AppPage';

export class CartPage extends AppPage {
  readonly path = '/cart.html';

  readonly items: Locator;
  readonly itemNames: Locator;
  readonly continueShoppingButton: Locator;

  constructor(page: Page) {
    super(page);
    this.items = page.getByTestId('inventory-item');
    this.itemNames = page.getByTestId('inventory-item-name');
    this.continueShoppingButton = page.getByTestId('continue-shopping');
  }

  async removeItem(productName: string): Promise<void> {
    await this.items
      .filter({ hasText: productName })
      .getByRole('button', { name: 'Remove' })
      .click();
  }

  async continueShopping(): Promise<void> {
    await this.continueShoppingButton.click();
  }
}
