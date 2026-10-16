import type { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';
import { Footer } from './components/Footer';
import { Header } from './components/Header';

export abstract class AppPage extends BasePage {
  /** The title the page shows below the header, for example "Products". */
  abstract readonly titleText: string;

  readonly header: Header;
  readonly footer: Footer;
  readonly title: Locator;

  constructor(page: Page) {
    super(page);
    this.header = new Header(page);
    this.footer = new Footer(page);
    this.title = page.getByTestId('title');
  }
}
