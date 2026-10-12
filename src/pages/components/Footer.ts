import type { Locator, Page } from '@playwright/test';

const socialTestIds = {
  X: 'social-x',
  Facebook: 'social-facebook',
  LinkedIn: 'social-linkedin',
} as const;

type SocialNetwork = keyof typeof socialTestIds;

export class Footer {
  readonly copyright: Locator;

  constructor(private readonly page: Page) {
    this.copyright = page.getByTestId('footer-copy');
  }

  socialLink(network: string): Locator {
    const testId = socialTestIds[network as SocialNetwork];
    if (!testId) throw new Error(`Unknown social network: "${network}"`);
    return this.page.getByTestId(testId);
  }
}
