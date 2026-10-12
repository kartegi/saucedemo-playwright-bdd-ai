@auth
Feature: Logout
  As a logged in customer
  I want to log out
  So that nobody else can use my session

  @regression
  Scenario: Logged in user can log out
    Given I am logged in as a standard user
    When I log out
    Then I should see the login page
