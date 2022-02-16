import { webElems as loginPage } from '../POM/login_page';
import { webElems as landingPage } from '../POM/home_page';
import { webElems as hgws } from '../POM/heritage_gateway';

require('cypress-downloadfile/lib/downloadFileCommand');
require('cy-verify-downloads').addCustomCommand();

// Login to the application using the UI
Cypress.Commands.add('login', (user) => {

    cy.xpath(landingPage.signInBtn).click();
    cy.xpath(loginPage.username).type(user.username);
    cy.xpath(loginPage.password).type(user.password);
    cy.get('button').contains('Sign In').click().wait(2000);

    cy.log('********** verify sign in was successful **********')
    cy.xpath(landingPage.logOffBtn).contains('Log off').should('be.visible');
})

// Search for a record in Heritage Gateway
Cypress.Commands.add('hgsearch', (record) => {

    cy.visit("http://heritagegateway.org.uk/Gateway-Stage/");
    cy.viewport(1600, 1200);
    cy.xpath(landingPage.cookiesBtn).click();
    cy.xpath(hgws.searchInput).type(record.record);
    cy.xpath(hgws.submitBtn).click()
    .wait(3000);

})

Cypress.Commands.add('loginRequest', (username, password) => {

    cy.request({
        method: 'POST',
        url: '/auth/',
        form: true,
        body: {
            username: 'RWilliams',
            password: '!?Rwilliams2020',
        },
    }).its('status').should('eq', 200)
})

