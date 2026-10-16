import { expect, Then, When } from '@fixtures/index';
import { defaultCheckoutInfo } from '@test-data/checkout';

When('I proceed to checkout', async ({ cartPage }) => {
  await cartPage.checkout();
});

When('I enter valid checkout information', async ({ checkoutInformationPage }) => {
  await checkoutInformationPage.fillInformation(defaultCheckoutInfo);
});

When(
  'I enter checkout information {string}, {string}, {string}',
  async ({ checkoutInformationPage }, firstName: string, lastName: string, postalCode: string) => {
    await checkoutInformationPage.fillInformation({ firstName, lastName, postalCode });
  },
);

When('I continue the checkout', async ({ checkoutInformationPage }) => {
  await checkoutInformationPage.continue();
});

When('I finish the order', async ({ checkoutOverviewPage }) => {
  await checkoutOverviewPage.finish();
});

Then(
  'I should see the order summary with {string}',
  async ({ checkoutOverviewPage }, name: string) => {
    await expect(checkoutOverviewPage.title).toHaveText(checkoutOverviewPage.titleText);
    await expect(checkoutOverviewPage.items).toContainText([name]);
  },
);

Then(
  'the order is confirmed with the message {string}',
  async ({ checkoutCompletePage }, message: string) => {
    await expect(checkoutCompletePage.title).toHaveText(checkoutCompletePage.titleText);
    await expect(checkoutCompletePage.completeHeader).toHaveText(message);
  },
);

Then(
  'I should see the checkout error {string}',
  async ({ checkoutInformationPage }, message: string) => {
    await expect(checkoutInformationPage.errorMessage).toHaveText(message);
  },
);
