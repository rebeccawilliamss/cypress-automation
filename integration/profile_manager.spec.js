import { webElems as home } from "../POM/home_page";
import { webElems as login } from "../POM/login_page";

describe("Profile manager functionality", function () {

  beforeEach(() => {
    cy.viewport(1600,1200);
    Cypress.Cookies.preserveOnce(
      "ai_session",
      "csrftoken",
      "/",
      "ai_user"
    );

  })

  before(() => {
    cy.visit('/');
    cy.viewport(1600,1200);
  })

  it("@12391: Change password", () => {

    cy.log("**** Log in as a user ****");
    cy.login({ username: '/', password: '/'});

    cy.log('**** navigate to the profile manager page ****')
    cy.contains('Welcome').click();
    cy.url().should('eq', '/');

    cy.log("**** Change password to new password ****");
    cy.get('button').contains('Change password').click();
    cy.get('#old_password').type("/");
    cy.get('#new_password1').type("/");
    cy.get('#new_password2').type("/");
    cy.get('button').contains('Change Password').click({force: true });

    cy.log("**** Verify if password has been changed **** ");
    cy.xpath('//div[@class="profile-summary-page back-to-top-me"]').scrollTo(
      "top"
    );
    cy.contains('Password successfully updated').should("be.visible");
    cy.get('span').contains('Logout').click();

    cy.log("**** Login using new password ****");
    cy.get('#username').clear().type('/');
    cy.get('#password').clear().type('/');
    cy.get('button').contains('Sign In').click();
    cy.contains("Welcome").click();

    cy.log("**** Change password to the old one ****");
    cy.get('button').contains('Change password').click();
    cy.get('#old_password').type("/");
    cy.get('#new_password1').type("/");
    cy.get('#new_password2').type("/");
    cy.get('button').contains('Change Password').click({force: true });
    cy.xpath('//div[@class="profile-summary-page back-to-top-me"]').scrollTo(
      "top"
    );

    cy.log("**** Verify if password has been changed back ****");
    cy.contains("Password successfully updated");
  });

  it("@12393: Profile Manager - User can edit their profile", function () {
    cy.log("**** Navigate to website ****");
    cy.visit('/');

    cy.log("**** Log in as a user ****");
    cy.login({ username: '/', password: '/'})
    cy.contains("Welcome").click();

    cy.log("**** Edit name, surname and email address ****");
    cy.get('button').contains('Edit').click();
    cy.get('#first_name').clear().type('/');
    cy.get('#last_name').clear().type('/');

    cy.get('#email').clear().type('/');
    cy.get('button').contains('Save').click();

    cy.log("**** Verify if data have been changed ****");
      cy.get('#first_name')
        .invoke("val")
        .then(($val) => {
          expect($val).to.include('Test');
        });
      cy.get('#last_name')
        .invoke("val")
        .then(($val) => {
          expect($val).to.include('Test');
        });
      cy.get('#email')
        .invoke("val")
        .then(($val) => {
          expect($val).to.include('/');
        });
    });

    it('can change profile data back to original names and email address', () => {

      cy.log("**** Edit name, surname and email address ****");
      cy.get('button').contains('Edit').click();
      cy.get('#first_name').clear().type('/');
      cy.get('#last_name').clear().type('/');

      cy.get('#email').clear().type('/');
      cy.get('button').contains('Save').click();

      cy.log("**** Verify if data have been changed ****");
        cy.get('#first_name')
          .invoke("val")
          .then(($val) => {
            expect($val).to.include('/');
          });
        cy.get('#last_name')
          .invoke("val")
          .then(($val) => {
            expect($val).to.include('/');
          });
        cy.get('#email')
          .invoke("val")
          .then(($val) => {
            expect($val).to.include('/');
          });
      });

    });
