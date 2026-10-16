import { expect, Given, Then, When } from '@fixtures/index';
import { expectLoadedPicture, PRICE_FORMAT } from './expectations';

Given('the dynamic catalog is still loading', async ({ dynamicCatalogPage }) => {
  await dynamicCatalogPage.holdLoading();
});

When('I open the dynamic catalog page', async ({ dynamicCatalogPage }) => {
  await dynamicCatalogPage.open();
});

Then('I should see the dynamic catalog loading', async ({ dynamicCatalogPage }) => {
  await expect(dynamicCatalogPage.spinner).toBeVisible();
  await expect(dynamicCatalogPage.title).toHaveText(dynamicCatalogPage.titleText);
  await expect(dynamicCatalogPage.cards).toHaveCount(0);
});

Then('the dynamic catalog has finished loading', async ({ dynamicCatalogPage }) => {
  await expect(dynamicCatalogPage.spinner).toBeHidden();
  await expect(dynamicCatalogPage.cards.first()).toBeVisible();
});

Then(
  'every product in the dynamic catalog has a picture, a name and a price',
  async ({ dynamicCatalogPage }) => {
    const cards = await dynamicCatalogPage.cards.all();
    expect(cards.length).toBeGreaterThan(0);
    for (const card of cards) {
      await expectLoadedPicture(dynamicCatalogPage.cardPicture(card));
      await expect(dynamicCatalogPage.cardName(card)).toHaveText(/\S/);
      await expect(dynamicCatalogPage.cardPrice(card)).toHaveText(PRICE_FORMAT);
    }
  },
);
