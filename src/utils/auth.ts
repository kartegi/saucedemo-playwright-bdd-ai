import type { BrowserContext } from '@playwright/test';
import { env } from '@config/env';

export async function authenticateAs(context: BrowserContext, username: string): Promise<void> {
  await context.addCookies([{ name: 'session-username', value: username, url: env.baseUrl }]);
}
