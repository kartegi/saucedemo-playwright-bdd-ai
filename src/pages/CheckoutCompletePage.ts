import type { Locator, Page } from '@playwright/test';
import { AppPage } from './AppPage';

export class CheckoutCompletePage extends AppPage {
  readonly path = '/checkout-complete.html';
  readonly titleText = 'Checkout: Complete!';

  readonly completeHeader: Locator;

  constructor(page: Page) {
    super(page);
    this.completeHeader = page.getByTestId('complete-header');
  }
}
