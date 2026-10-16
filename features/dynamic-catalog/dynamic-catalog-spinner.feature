@dynamic-catalog
Feature: Dynamic catalog with a loading spinner
  As a customer
  I want to see a loading indicator while the catalog loads
  So that I know the products are on their way

  @smoke
  Scenario: Catalog replaces the loading spinner
    Given I am logged in as a standard user
    When I open the dynamic catalog page
    Then the dynamic catalog has finished loading
    And every product in the dynamic catalog has a picture, a name and a price

  @regression
  Scenario: Loading spinner is shown while the catalog loads
    Given I am logged in as a standard user
    And the dynamic catalog is still loading
    When I open the dynamic catalog page
    Then I should see the dynamic catalog loading

  @regression
  Scenario: Dynamic catalog is not available after logging out
    Given I am logged in as a standard user
    And I log out
    When I open the dynamic catalog page
    Then I should see the login page
    And I should see the login error "Epic sadface: You can only access '/dynamic-catalog-spinner.html' when you are logged in."
