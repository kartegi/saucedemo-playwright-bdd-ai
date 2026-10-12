import type { DataTable } from 'playwright-bdd';
import { expect, Then } from '@fixtures/index';

Then('the footer links to the following profiles', async ({ inventoryPage }, table: DataTable) => {
  for (const { network, profile } of table.hashes()) {
    if (!network || !profile) throw new Error('Each row needs a network and a profile');
    await expect(inventoryPage.footer.socialLink(network)).toHaveAttribute('href', profile);
  }
});
