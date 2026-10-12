import { expect, Given } from '@fixtures/index';
import { authenticateAs } from '@utils/auth';
import { getUsername, type UserType } from '@test-data/users';

Given('I am logged in as a {userType} user', async ({ context, inventoryPage }, type: UserType) => {
  await authenticateAs(context, getUsername(type));
  await inventoryPage.open();
  await expect(inventoryPage.title).toHaveText('Products');
});
