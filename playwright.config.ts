import { defineConfig, devices } from '@playwright/test';
import { defineBddConfig } from 'playwright-bdd';
import { env } from './src/config/env';

const testDir = defineBddConfig({
  features: 'features/**/*.feature',
  steps: ['features/steps/**/*.ts', 'src/fixtures/index.ts'],
  outputDir: '.features-gen',
});

const isCI = !!process.env.CI;

const attachEverything = isCI ? ({ trace: 'on', screenshot: 'on', video: 'on' } as const) : {};

// The AI test agents start from tests/seed.spec.ts. Their project exists only when the MCP server
// (.mcp.json) sets PLAYWRIGHT_AGENTS, so normal runs and CI never see it.
const agentsProject = process.env.PLAYWRIGHT_AGENTS
  ? [{ name: 'agents', testDir: 'tests', use: { ...devices['Desktop Chrome'] } }]
  : [];

export default defineConfig({
  testDir,
  fullyParallel: true,
  forbidOnly: isCI,
  retries: isCI ? 2 : 0,
  workers: isCI ? 2 : undefined,
  timeout: 30_000,
  expect: { timeout: 5_000 },

  reporter: [
    ['list'],
    ['html', { open: 'never', outputFolder: 'playwright-report' }],
    ['allure-playwright', { resultsDir: 'allure-results', detail: false }],
    ...(isCI ? ([['github']] as const) : []),
  ],

  use: {
    baseURL: env.baseUrl,
    // saucedemo uses `data-test` instead of the default `data-testid`
    testIdAttribute: 'data-test',
    actionTimeout: 10_000,
    navigationTimeout: 15_000,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },

  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'], ...attachEverything } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
    { name: 'mobile-chrome', use: { ...devices['Pixel 7'] } },
    ...agentsProject,
  ],
});
