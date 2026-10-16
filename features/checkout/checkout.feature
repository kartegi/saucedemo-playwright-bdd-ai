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
    Then the order is confirmed with the message "Thank you for your order!"

  @regression
  Scenario Outline: Checkout requires the <field>
    When I enter checkout information "<firstName>", "<lastName>", "<postalCode>"
    And I continue the checkout
    Then I should see the checkout error "<error>"

    Examples:
      | field       | firstName | lastName | postalCode | error                          |
      | first name  |           | Doe      | 12345      | Error: First Name is required  |
      | last name   | John      |          | 12345      | Error: Last Name is required   |
      | postal code | John      | Doe      |            | Error: Postal Code is required |
