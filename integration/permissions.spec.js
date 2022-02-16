import { webElems as home } from "../POM/home_page";
import ManageDataPage, { webElems as createResource } from "../POM/managedata_page";
import SearchPage, { webElems as searchPage } from "../POM/search_page";

/* This test can only be run ONCE per day to work
although it will not be neccessary to run more than once */

const action = new ManageDataPage();
const searchAction = new SearchPage();

describe('Users with different permissions have correct levels of access', () => {

    beforeEach(() => {

        Cypress.Cookies.preserveOnce(
        'ai_session',
        'csrftoken',
        '/',
        'ai_user');

        cy.viewport(1600, 1200);
    })

    it('can login as a provisional user and edit a record but not save it', () => {

        cy.visit('/');
        cy.login({ username: '/', password: '/'});

        cy.xpath(home.manageDataBtn)
        .invoke('removeAttr','target')
        .click();
        cy.get(createResource.createMonResource)
        .click({ force: true });

        cy.get('.jstree')
        .should('be.visible');
        action.selectFromResTree('Asset Name');
        action.selectFromDDL('Name Type','Primary');

        var todaysDate = new Date().toISOString().slice(0, 10);
        action.typeIntoField('Name','Test Monument' + todaysDate);
        cy.get('button')
        .contains('Add')
        .click()
        .wait(500);

        cy.get('span')
        .contains('Logout')
        .click();

        cy.get('h1')
        .contains('Sign In');
    })

    it('can login as a reviewer user and save the edits made by provisional user', () => {

        cy.log('**** login as a reviewer user ****')
        cy.get('#username').type('/');
        cy.get('#password').type('/');
        cy.get('button').contains('Sign In').click();
        cy.xpath(home.searchBtn).click();

        cy.log('**** search for the previously created test monument record ****')
        var todaysDate = new Date().toISOString().slice(0, 10);
        cy.xpath(searchPage.searchBar)
        .type('Test Monument' + todaysDate);
        searchAction.selectSearchResultsLabel('Test Monument' + todaysDate)
        .wait(3000);

        cy.log('**** check the record has the provisional edits label ****')
        cy.get('.provisional-edits')
        .should('be.visible');

        cy.log('**** open the record in the same browser window ****')
        cy.window().then(win => {
            cy.stub(win, 'open').callsFake((url, target) => {
                expect(target).to.be.undefined
                return win.open.wrappedMethod.call(win, url, '_self')
            }).as('open')
        })
        cy.xpath(`//a[contains(text(), 'Edit')]`).click();
        cy.get('@open')
        .should('be.called')

        cy.log('**** in resource editor check the provisional banner is visible ****')
        cy.get('.report-provisional-flag')
        .contains(`This resource has provisional edits (not displayed in this report) that are pending review`);

        cy.log('**** save the Name card edited by the provisoinal user ****')
        action.selectFromResTree('Asset Name').click();
        action.selectChildFromResTree('Asset Name', 'None');
        cy.get('.edit-message-container-user')
        .contains('provisional_user');
        cy.get('button').contains('Save edit')
        .click()
        .reload();

        cy.get('.rp-report-section-root')
        .should('not.have.class', '.report-provisional-flag');

        cy.log('**** delete the record to limit the amount of test data created ****')
        cy.get('#menu-control')
        .click()
        .get('#card-manager')
        .should('be.visible')
        .click()
        .get('#card-alert-panel')
        .should('be.visible')
        .get('button')
        .contains('OK')
        .click();

        cy.url().should('eq', 'https://stage-warden.historicengland.org.uk/resource');
    })
})
