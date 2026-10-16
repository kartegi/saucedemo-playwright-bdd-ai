import { expect, Given, Then, When } from '@fixtures/index';

Given('the dynamic catalog is still loading', async ({ dynamicCatalogPage }) => {
  await dynamicCatalogPage.holdLoading();
});

When('I open the dynamic catalog page', async ({ dynamicCatalogPage }) => {
  await dynamicCatalogPage.open();
});

Then('I should see the dynamic catalog loading', async ({ dynamicCatalogPage }) => {
  await expect(dynamicCatalogPage.spinner).toBeVisible();
  await expect(dynamicCatalogPage.title).toHaveText('Dynamic Catalog - Spinner');
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
      const picture = dynamicCatalogPage.cardPicture(card);
      await expect(picture).toBeVisible();
      await expect(picture).toHaveAttribute('alt', /\S/);
      await expect(picture).toHaveJSProperty('complete', true);
      await expect
        .poll(() => picture.evaluate((img: HTMLImageElement) => img.naturalWidth))
        .toBeGreaterThan(0);
      await expect(dynamicCatalogPage.cardName(card)).toHaveText(/\S/);
      await expect(dynamicCatalogPage.cardPrice(card)).toHaveText(/^\$\d+\.\d{2}$/);
    }
  },
);
