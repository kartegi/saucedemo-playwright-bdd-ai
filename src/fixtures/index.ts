import { test as base, createBdd } from 'playwright-bdd';
import { LoginPage } from '@pages/LoginPage';

interface PageObjects {
  loginPage: LoginPage;
}

export const test = base.extend<PageObjects>({
  loginPage: async ({ page }, use) => use(new LoginPage(page)),
});

export const { Given, When, Then } = createBdd(test);
export { expect } from '@playwright/test';
