@layout
Feature: Footer
  As a customer
  I want to find the company on social networks
  So that I can follow its news

  @regression
  Scenario: Footer links to the Sauce Labs social profiles
    Given I am logged in as a standard user
    Then the footer links to the following profiles
      | network  | profile                                      |
      | X        | https://x.com/saucelabs                      |
      | Facebook | https://www.facebook.com/saucelabs           |
      | LinkedIn | https://www.linkedin.com/company/sauce-labs/ |
