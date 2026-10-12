import { expect, Then, When } from '@fixtures/index';
import { defaultCheckoutInfo } from '@test-data/checkout';

When('I proceed to checkout', async ({ cartPage }) => {
  await cartPage.checkout();
});

When('I enter valid checkout information', async ({ checkoutPage }) => {
  await checkoutPage.fillInformation(defaultCheckoutInfo);
});

When(
  'I enter checkout information {string}, {string}, {string}',
  async ({ checkoutPage }, firstName: string, lastName: string, postalCode: string) => {
    await checkoutPage.fillInformation({ firstName, lastName, postalCode });
  },
);

When('I continue the checkout', async ({ checkoutPage }) => {
  await checkoutPage.continue();
});

When('I finish the order', async ({ checkoutPage }) => {
  await checkoutPage.finish();
});

Then('I should see the order summary with {string}', async ({ checkoutPage }, name: string) => {
  await expect(checkoutPage.title).toHaveText('Checkout: Overview');
  await expect(checkoutPage.summaryItems).toContainText([name]);
});

Then('the order is confirmed', async ({ checkoutPage }) => {
  await expect(checkoutPage.title).toHaveText('Checkout: Complete!');
  await expect(checkoutPage.completeHeader).toHaveText('Thank you for your order!');
});

Then('I should see the checkout error {string}', async ({ checkoutPage }, message: string) => {
  await expect(checkoutPage.errorMessage).toHaveText(message);
});
