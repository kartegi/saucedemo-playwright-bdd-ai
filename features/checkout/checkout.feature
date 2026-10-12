@checkout
Feature: Checkout
  As a customer
  I want to complete my purchase
  So that I receive the products I selected

  Background:
    Given I am logged in as a standard user
    And I add "Sauce Labs Backpack" to the cart
    And I open the shopping cart
    And I proceed to checkout

  @smoke
  Scenario: Complete an order with valid information
    When I enter valid checkout information
    And I continue the checkout
    Then I should see the order summary with "Sauce Labs Backpack"
    When I finish the order
    Then the order is confirmed

  @regression
  Scenario Outline: Checkout information is validated
    When I enter checkout information "<firstName>", "<lastName>", "<postalCode>"
    And I continue the checkout
    Then I should see the checkout error "<error>"

    Examples:
      | firstName | lastName | postalCode | error                          |
      |           | Doe      | 12345      | Error: First Name is required  |
      | John      |          | 12345      | Error: Last Name is required   |
      | John      | Doe      |            | Error: Postal Code is required |
