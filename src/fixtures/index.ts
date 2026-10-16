import { test as base, createBdd } from 'playwright-bdd';
import { CartPage } from '@pages/CartPage';
import { CheckoutPage } from '@pages/CheckoutPage';
import { DynamicCatalogSpinnerPage } from '@pages/DynamicCatalogSpinnerPage';
import { InventoryPage } from '@pages/InventoryPage';
import { LoginPage } from '@pages/LoginPage';

interface PageObjects {
  loginPage: LoginPage;
  inventoryPage: InventoryPage;
  cartPage: CartPage;
  checkoutPage: CheckoutPage;
  dynamicCatalogPage: DynamicCatalogSpinnerPage;
}

export const test = base.extend<PageObjects>({
  loginPage: async ({ page }, use) => use(new LoginPage(page)),
  inventoryPage: async ({ page }, use) => use(new InventoryPage(page)),
  cartPage: async ({ page }, use) => use(new CartPage(page)),
  checkoutPage: async ({ page }, use) => use(new CheckoutPage(page)),
  dynamicCatalogPage: async ({ page }, use) => use(new DynamicCatalogSpinnerPage(page)),
});

export const { Given, When, Then } = createBdd(test);
export { expect } from '@playwright/test';
