import { expect, Given, Then, When } from '@fixtures/index';
import { getCredentials, getUsername, type UserType } from '@test-data/users';

Given('I am on the login page', async ({ loginPage }) => {
  await loginPage.open();
});

When('I log in as a {userType} user', async ({ loginPage }, type: UserType) => {
  await loginPage.login(getCredentials(type));
});

When(
  'I log in as a {userType} user with the password {string}',
  async ({ loginPage }, type: UserType, password: string) => {
    await loginPage.login({ username: getUsername(type), password });
  },
);

When(
  'I log in with username {string} and password {string}',
  async ({ loginPage }, username: string, password: string) => {
    await loginPage.login({ username, password });
  },
);

When('I log out', async ({ inventoryPage }) => {
  await inventoryPage.header.logout();
});

// A path given to toHaveURL is resolved against the baseURL of the config
Then('I should see the products page', async ({ page, inventoryPage }) => {
  await expect(page).toHaveURL(inventoryPage.path);
  await expect(inventoryPage.title).toHaveText(inventoryPage.titleText);
});

Then('I should see the login page', async ({ page, loginPage }) => {
  await expect(page).toHaveURL(loginPage.path);
  await expect(loginPage.loginButton).toBeVisible();
});

Then('I should see the login error {string}', async ({ loginPage }, message: string) => {
  await expect(loginPage.errorMessage).toHaveText(message);
});
