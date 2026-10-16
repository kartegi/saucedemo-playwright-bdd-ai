import type { Locator } from '@playwright/test';
import { expect } from '@fixtures/index';

// Checks shared by several step files. They describe the shape of the content, never its data.

/** A price as the shop shows it, for example $12.34. */
export const PRICE_FORMAT = /^\$\d+\.\d{2}$/;

/** The picture is visible, has a text alternative and really loaded (it is not a broken image). */
export async function expectLoadedPicture(picture: Locator): Promise<void> {
  await expect(picture).toBeVisible();
  await expect(picture).toHaveAttribute('alt', /\S/);
  await expect(picture).toHaveJSProperty('complete', true);
  await expect
    .poll(() => picture.evaluate((img: HTMLImageElement) => img.naturalWidth))
    .toBeGreaterThan(0);
}
