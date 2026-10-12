import { expect, Given, Then, When } from '@fixtures/index';
import { getCredentials, type UserType } from '@test-data/users';

Given('I am on the login page', async ({ loginPage }) => {
  await loginPage.open();
});

When('I log in as a {userType} user', async ({ loginPage }, type: UserType) => {
  await loginPage.login(getCredentials(type));
});

When(
  'I log in with username {string} and password {string}',
  async ({ loginPage }, username: string, password: string) => {
    await loginPage.login({ username, password });
  },
);

Then('I should see the products page', async ({ page }) => {
  await expect(page).toHaveURL(/inventory\.html$/);
});

Then('I should see the login error {string}', async ({ loginPage }, message: string) => {
  await expect(loginPage.errorMessage).toHaveText(message);
});
