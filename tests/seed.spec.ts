import { test } from '@fixtures/index';
import { getUsername } from '@test-data/users';
import { authenticateAs } from '@utils/auth';

// Starting point of the AI test agents: a logged in standard user on the products page.
// The login goes through a cookie, so no password is typed in front of an agent.
test('seed', async ({ context, inventoryPage }) => {
  await authenticateAs(context, getUsername('standard'));
  await inventoryPage.open();
});
