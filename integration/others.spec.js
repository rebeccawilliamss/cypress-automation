import { webElems as home, webElems } from '../POM/home_page'
import { webElems as managedata } from '../POM/managedata_page'
import ManageDataPage from '../POM/managedata_page';
import SearchPage from '../POM/search_page';


const path = require('path')
const action = new ManageDataPage();
const searchAction = new SearchPage();
const fs = require('fs');


describe('Tests cover different functionalities across application',() => {

  beforeEach(()=>{
      Cypress.Cookies.preserveOnce(
      'ai_session',
      'csrftoken',
      'warden',
      'ai_user');
      cy.viewport(1600, 1200);
  })

  before(() => {
      cy.log('**** Navigate to manage data page ****');
      cy.visit('/');
      cy.viewport(1600, 1200);

      cy.login({ username: 'RWilliams', password: '!?Rwilliams2020'});
      cy.xpath('//a[contains(text(), "Log off")]').should('be.visible');

      cy.xpath(home.searchBtn).click();
  })

  it('@12828: Map Layer Manager: Clicking the copy to clip board button should copy the URL ',() => {

      cy.log('**** Click on the map layer manager page ****');
      cy.xpath('(//a[@href="/map_layer_manager"])[1]').click({ force: true });
      cy.xpath('//li[@class="link-submenu-item"]/a[@href="/map_layer_manager"]').click({ force: true });

      cy.log('**** Click copy layer service btn ****');
      cy.xpath('//button[@aria-label="Click to copy layer service url"]').click({ force: true });

      cy.log('**** Verify if modal window appear ****');
      cy.xpath('//div[@class="modal-content"]').should('be.visible');
      cy.get('.modal-body').within(($modal) => {
          let modal = $modal.text()
          expect(modal).to.contain
          ('https://stage-warden.historicengland.org.uk/mvt/30fe747f-5aba-11e9-aa49-000d3ab1e588/{z}/{x}/{y}.pbf')

      })

    })

})