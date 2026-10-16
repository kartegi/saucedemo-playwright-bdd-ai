import type { Locator, Page } from '@playwright/test';
import type { CheckoutInfo } from '@test-data/checkout';
import { AppPage } from './AppPage';

export class CheckoutInformationPage extends AppPage {
  readonly path = '/checkout-step-one.html';
  readonly titleText = 'Checkout: Your Information';

  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly postalCodeInput: Locator;
  readonly continueButton: Locator;
  readonly errorMessage: Locator;

  constructor(page: Page) {
    super(page);
    this.firstNameInput = page.getByTestId('firstName');
    this.lastNameInput = page.getByTestId('lastName');
    this.postalCodeInput = page.getByTestId('postalCode');
    this.continueButton = page.getByTestId('continue');
    this.errorMessage = page.getByTestId('error');
  }

  async fillInformation({ firstName, lastName, postalCode }: Partial<CheckoutInfo>): Promise<void> {
    if (firstName !== undefined) await this.firstNameInput.fill(firstName);
    if (lastName !== undefined) await this.lastNameInput.fill(lastName);
    if (postalCode !== undefined) await this.postalCodeInput.fill(postalCode);
  }

  async continue(): Promise<void> {
    await this.continueButton.click();
  }
}
