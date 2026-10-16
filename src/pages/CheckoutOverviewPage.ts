import type { Locator, Page } from '@playwright/test';
import { AppPage } from './AppPage';

export class CheckoutOverviewPage extends AppPage {
  readonly path = '/checkout-step-two.html';
  readonly titleText = 'Checkout: Overview';

  readonly items: Locator;
  readonly finishButton: Locator;

  constructor(page: Page) {
    super(page);
    this.items = page.getByTestId('inventory-item');
    this.finishButton = page.getByTestId('finish');
  }

  async finish(): Promise<void> {
    await this.finishButton.click();
  }
}
