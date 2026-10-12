import { defineConfig } from 'allure';

export default defineConfig({
  name: 'SauceDemo E2E',
  output: './allure-report',
  plugins: {
    awesome: {
      options: {
        reportName: 'SauceDemo E2E',
        groupBy: ['parentSuite', 'subSuite'],
      },
    },
  },
});
