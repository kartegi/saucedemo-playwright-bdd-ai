import type { Locator, Page } from '@playwright/test';
import type { CheckoutInfo } from '@test-data/checkout';
import { AppPage } from './AppPage';

export class CheckoutPage extends AppPage {
  readonly path = '/checkout-step-one.html';

  // Your information
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly postalCodeInput: Locator;
  readonly continueButton: Locator;
  readonly errorMessage: Locator;

  // Overview
  readonly summaryItems: Locator;
  readonly finishButton: Locator;

  // Completion
  readonly completeHeader: Locator;

  constructor(page: Page) {
    super(page);
    this.firstNameInput = page.getByTestId('firstName');
    this.lastNameInput = page.getByTestId('lastName');
    this.postalCodeInput = page.getByTestId('postalCode');
    this.continueButton = page.getByTestId('continue');
    this.errorMessage = page.getByTestId('error');

    this.summaryItems = page.getByTestId('inventory-item');
    this.finishButton = page.getByTestId('finish');

    this.completeHeader = page.getByTestId('complete-header');
  }

  async fillInformation({ firstName, lastName, postalCode }: Partial<CheckoutInfo>): Promise<void> {
    if (firstName !== undefined) await this.firstNameInput.fill(firstName);
    if (lastName !== undefined) await this.lastNameInput.fill(lastName);
    if (postalCode !== undefined) await this.postalCodeInput.fill(postalCode);
  }

  async continue(): Promise<void> {
    await this.continueButton.click();
  }

  async finish(): Promise<void> {
    await this.finishButton.click();
  }
}
