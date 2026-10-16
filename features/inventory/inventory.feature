@inventory
Feature: Product catalog
  As a customer
  I want to browse and sort products
  So that I can find what I want to buy

  Background:
    Given I am logged in as a standard user

  @smoke
  Scenario: Every product is shown with its details
    Then every product in the catalog has a picture, a name, a description and a price
    And every product in the catalog can be added to the cart

  # The list starts in the opposite order, so the sorting has to change it. Name (A to Z) is the
  # order the page opens with, so without this step that example could not fail.
  @regression
  Scenario Outline: Products can be sorted by <sorting>
    Given I sort products by "<opposite sorting>"
    When I sort products by "<sorting>"
    Then the products are sorted by "<sorting>"

    Examples:
      | sorting             | opposite sorting    |
      | Name (A to Z)       | Name (Z to A)       |
      | Name (Z to A)       | Name (A to Z)       |
      | Price (low to high) | Price (high to low) |
      | Price (high to low) | Price (low to high) |
