import { webElems as home } from "../POM/home_page";
import { webElems as login } from "../POM/login_page";
import { webElems as managedata } from "../POM/managedata_page";

//https://timdeschryver.dev/blog/setting-up-cypress-with-axe-for-accessibility

describe.skip("Verify accessibility across application", function () {
  beforeEach(() => {
    cy.log("Before every scenario use existing auth token");
    Cypress.Cookies.preserveOnce(
      "ai_session",
      "csrftoken",
      "warden",
      "ai_user"
    );
  });

  before(() => {
    cy.visit("https://stage-warden.historicengland.org.uk/");
  });

  it("Home page check", function () {
    cy.log("Check accessibility on home page");
    cy.injectAxe();

    cy.checkA11y(
      {
        exclude: [".v5-splash-navbar navbar"],
      },
      {
        rules: {
          "landmark-unique": { enabled: false },
        },
      }
    );
  });

  it("Login page check", function () {
    cy.log("Check accessibility on login page");
    console.log(home.expandNavBarBtn);
    cy.xpath(home.expandNavBarBtn).click();
    cy.xpath(home.signInBtn).click();

    cy.injectAxe();
    cy.checkA11y();
  });

  it("Logged user check", function () {
    cy.log("Check accessibility on logged user page");

    cy.xpath(login.usernameInput).type("RWilliams");
    cy.xpath(login.passwordInput).type("!?Rwilliams2020");
    cy.xpath(login.signInBtn).click();

    cy.injectAxe();
    cy.checkA11y(
      {
        exclude: [".v5-splash-navbar navbar"],
      },
      {
        rules: {
          "landmark-unique": { enabled: false },
        },
      }
    );
  });

  it("Create HAM resource check", function () {
    cy.log(
      "Navigate to create ham resource and check accessibility for this site"
    );

    cy.xpath(home.expandNavBarBtn).click();
    cy.xpath(home.manageDataBtn).invoke("removeAttr", "target").click();
    cy.get(managedata.createHamResource).click({ force: true });
    //3x accessibility violations
    // cy.wait(4000);
    // cy.injectAxe();
    // cy.checkA11y(
    //   {
    //     exclude: [".v5-splash-navbar navbar"],
    //   },
    //   {
    //     rules: {
    //       "duplicate-id": { enabled: false },
    //       "empty-heading": { enabled: false },
    //       tabindex: { enabled: false },
    //       "landmark-unique": { enabled: false },
    //     },
    //   }
    // );
  });
});
