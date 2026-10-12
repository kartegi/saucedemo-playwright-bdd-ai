@inventory
Feature: Product catalog
  As a customer
  I want to browse and sort products
  So that I can find what I want to buy

  Background:
    Given I am logged in as a standard user

  @smoke
  Scenario: All products are displayed
    Then I should see all products

  @regression
  Scenario Outline: Products can be sorted
    When I sort products by "<sorting>"
    Then the products are sorted by "<sorting>"

    Examples:
      | sorting             |
      | Name (A to Z)       |
      | Name (Z to A)       |
      | Price (low to high) |
      | Price (high to low) |
