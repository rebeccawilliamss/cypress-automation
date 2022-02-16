import { webElems as search } from '../POM/search_page'
import ManageDataPage from '../POM/managedata_page';
import SearchPage from '../POM/search_page';
import { webElems as homePage } from '../POM/home_page';
//import { deleteDownloadsFolder } from './utils';

const path = require('path')
const action = new ManageDataPage();
const searchAction = new SearchPage();
const fs = require('fs');


describe('Search functionality', () => {

    beforeEach(()=>{

        cy.visit('/');
        Cypress.Cookies.preserveOnce(
        'ai_session',
        'csrftoken',
        '/',
        'ai_user');
        cy.viewport(1600, 1200);

        cy.login({ username: '/', password: '/'});
        cy.xpath('//a[contains(text(), "Log off")]').should('be.visible');

    })

    it('User can carry out basic search', () =>{

        cy.xpath(homePage.searchBtn).click();
        cy.xpath(search.resultsNumber).should('be.visible').should($elem=>{
            expect($elem).to.not.contain('undefined')
        }).then($res=>{
            let txt= $res.text();
            cy.log('Number of results: ',txt);

            cy.xpath(search.findAResourceInput)
            .type('Andover');
            cy.xpath(search.searchResultsLabel2)
            .contains('Andover')
            .click();
            cy.xpath(search.resultsNumber)
            .invoke('text')
            .should('not.eq',txt);

        })
    })

    it('Users can use the time filter to filter search results.', () => {

        cy.xpath(homePage.searchBtn).click();
        cy.xpath(search.resultsNumber).should('be.visible').should($elem=>{
            expect($elem).to.not.contain('undefined')
        }).then($res=>{
            let txt= $res.text();
            cy.log('Number of results: ',txt);
            cy.xpath(search.timeFilterBtn).click();

            searchAction.selectFromTimeFilters('Type','Associated Activities - Start Date');
            searchAction.selectFromTimeFilters('Within','Custom date range');

            cy.xpath('//h3[@class="search-label" and text()="From"]/../div/input')
            .clear({force: true})
            .type('2000-08-27')
            .type('{esc}')
            cy.xpath('//h3[@class="search-label" and text()="To"]/../div/input')
            .clear({force: true})
            .type('2020-12-31')
            .type('{esc}')

            cy.xpath(search.resultsNumber)
            .invoke('text')
            .should('not.eq',txt);
        })

    })

    it('Search for "Dover" should only display UK records', () => {

        cy.xpath(homePage.searchBtn)
        .click()
        .wait(3000);
        cy.xpath(search.mapInput)
        .should('be.visible')
        .type('Dover')

        cy.xpath(search.mapInputSuggLabel).within($els=>{
            expect($els).to.have.lengthOf(5)
            for(var i=0; i<$els.length; i++){
               expect($els[i].textContent).to.contain('England');
            }
        })
    })

    it('Searching for "Ciren" should only display results in Cirencester', () => {

        cy.xpath(homePage.searchBtn)
        .click();
        cy.xpath(search.mapInput)
        .should('be.visible')
        .type('Ciren')

        cy.xpath(search.mapInputSuggLabel).within($els=>{
            for(var i=0; i<$els.length; i++){
                expect($els[i].textContent).to.contain('England')
            }
        })
    })

 it('The user is able to output search results', () => {

        cy.xpath(homePage.searchBtn).click();

        cy.log('**** refine search results ready to be exported ****')
        cy.xpath(search.searchBar).type('1628801{enter}');
        cy.xpath(search.searchResultsLabel).contains('1628801').click();
        cy.xpath(search.outputSearchBtn).click();

        cy.xpath('//table').should('be.visible');
        cy.xpath(search.exportResultsToCsvBtn).click();

        cy.wait(3000)

        const downloadsFolder = Cypress.config('downloadsFolder');
        let fileName
        cy.task("downloadFile", downloadsFolder).then((result) => {
            fileName = result    
            cy.log(result)
            cy.log(fileName)
            const filePath = path.join(downloadsFolder, fileName);
            cy.log(filePath)
            cy.readFile(filePath).should('exist');
            
            cy.task("readFile", filePath).then((result2) => {
                cy.log(result2).should('contain', '1628801')
                }) 
        })
    })

})




