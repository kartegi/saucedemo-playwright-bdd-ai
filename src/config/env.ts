import 'dotenv/config';

/**
 * Returns the value of a required environment variable and fails with a clear message when it is
 * missing. Credentials are never hardcoded: locally they come from `.env` (a copy of
 * `.env.example`), in CI from repository secrets.
 */
export function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(
      `Missing environment variable ${name}. Copy .env.example to .env and fill it in.`,
    );
  }
  return value;
}

export const env = {
  baseUrl: process.env.BASE_URL || 'https://www.saucedemo.com',
} as const;
