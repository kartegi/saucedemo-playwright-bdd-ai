@auth
Feature: Login
  As a registered customer
  I want to log in to the store
  So that I can shop for products

  Background:
    Given I am on the login page

  @smoke
  Scenario: Successful login with a standard user
    When I log in as a standard user
    Then I should see the products page

  @regression
  Scenario: Locked out user cannot log in
    When I log in as a locked out user
    Then I should see the login error "Epic sadface: Sorry, this user has been locked out."

  @regression
  Scenario: Wrong password is rejected
    When I log in as a standard user with the password "wrong_pass"
    Then I should see the login error "Epic sadface: Username and password do not match any user in this service"

  @regression
  Scenario Outline: Login is rejected for <case>
    When I log in with username "<username>" and password "<password>"
    Then I should see the login error "<error>"

    Examples:
      | case              | username     | password     | error                                                                     |
      | an unknown user   | unknown_user | any_password | Epic sadface: Username and password do not match any user in this service |
      | an empty username |              | any_password | Epic sadface: Username is required                                        |
      | an empty password | any_user     |              | Epic sadface: Password is required                                        |
