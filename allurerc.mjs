import { defineConfig } from 'allure';

export default defineConfig({
  name: 'SauceDemo E2E',
  output: './allure-report',
  historyPath: process.env.ALLURE_HISTORY_PATH || undefined,
  plugins: {
    awesome: {
      options: {
        reportName: 'SauceDemo E2E',
        groupBy: ['parentSuite', 'subSuite'],
      },
    },
  },
});
