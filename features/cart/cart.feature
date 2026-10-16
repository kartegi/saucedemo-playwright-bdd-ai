@cart
Feature: Shopping cart
  As a customer
  I want to manage the items in my cart
  So that I only buy what I need

  Background:
    Given I am logged in as a standard user

  @smoke
  Scenario: Add a product to the cart
    When I add "Sauce Labs Backpack" to the cart
    And I open the shopping cart
    Then the cart contains "Sauce Labs Backpack"
    And the cart badge shows 1

  @regression
  Scenario: Add several products to the cart
    When I add "Sauce Labs Backpack" to the cart
    And I add "Sauce Labs Bike Light" to the cart
    Then the cart badge shows 2

  @regression
  Scenario: Remove a product on the products page
    Given I add "Sauce Labs Backpack" to the cart
    When I remove "Sauce Labs Backpack" on the products page
    Then the cart badge is not displayed

  @regression
  Scenario: Remove a product on the cart page
    Given I add "Sauce Labs Backpack" to the cart
    And I open the shopping cart
    When I remove "Sauce Labs Backpack" on the cart page
    Then the cart is empty

  @regression
  Scenario: Continue shopping returns to the products page
    Given I open the shopping cart
    When I continue shopping
    Then I should see the products page
