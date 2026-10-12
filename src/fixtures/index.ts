import { test as base, createBdd } from 'playwright-bdd';
import { InventoryPage } from '@pages/InventoryPage';
import { LoginPage } from '@pages/LoginPage';

interface PageObjects {
  loginPage: LoginPage;
  inventoryPage: InventoryPage;
}

export const test = base.extend<PageObjects>({
  loginPage: async ({ page }, use) => use(new LoginPage(page)),
  inventoryPage: async ({ page }, use) => use(new InventoryPage(page)),
});

export const { Given, When, Then } = createBdd(test);
export { expect } from '@playwright/test';
