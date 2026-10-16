import type { Locator, Page } from '@playwright/test';
import { AppPage } from './AppPage';

export class DynamicCatalogSpinnerPage extends AppPage {
  readonly path = '/dynamic-catalog-spinner.html';
  readonly titleText = 'Dynamic Catalog - Spinner';

  readonly spinner: Locator;
  readonly cards: Locator;

  constructor(page: Page) {
    super(page);
    this.spinner = page.getByRole('status', { name: 'Loading' });
    this.cards = page.getByTestId(/^spinner-item-\d+$/);
  }

  // Freezes the page timers, so the loading delay of the catalog never ends.
  // Must be called before the page is opened.
  async holdLoading(): Promise<void> {
    await this.page.clock.install({ time: new Date('2030-01-01T10:00:00') });
    await this.page.clock.pauseAt(new Date('2030-01-01T10:00:01'));
  }

  cardPicture(card: Locator): Locator {
    return card.getByTestId(/-img$/);
  }

  cardName(card: Locator): Locator {
    return card.getByTestId(/-name$/);
  }

  cardPrice(card: Locator): Locator {
    return card.getByTestId(/-price$/);
  }
}
