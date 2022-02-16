import SearchPage, { webElems as searchPage } from '../POM/search_page';
import HomePage, { webElems as homePage } from '../POM/home_page';

const search = new SearchPage();
const home = new HomePage();

describe('Advanced search tests', () => {

    beforeEach(()=>{
        Cypress.Cookies.preserveOnce('ai_session',
        'csrftoken',
        'warden',
        'ai_user');
        cy.viewport(1600, 1200);
    })

    before(() => {
        cy.visit('/');
        cy.viewport(1600, 1200);
        cy.login({ username: '/', password: '/'});
        home.checkLoggedIn();

        cy.xpath(homePage.searchBtn).click();
        cy.xpath(searchPage.advancedSearchBtn).click();
    })

    it('Advanced search displays a list of resource attributes',function(){

        search.advancedSearchCategoryIsPresent('/');       
        search.advancedSearchCategoryIsPresent('/'); 
        search.advancedSearchCategoryIsPresent('/'); 
        search.advancedSearchCategoryIsPresent('/'); 
        search.advancedSearchCategoryIsPresent('/'); 
        search.advancedSearchCategoryIsPresent('/'); 
        search.advancedSearchCategoryIsPresent('/'); 
        search.advancedSearchCategoryIsPresent('/');  
 
    })

    it('can search for Monuments using Asset Name filter', () => {

        cy.xpath(searchPage.resultsNumber).then($res=>{
            let txt= $res.text();
            cy.log('Number of results: ',txt);

            search.selectAdvancedSearchFacet('Asset Name');
            search.checkAdvancedSearchFormVisible();
    
            search.inputIntoAdvancedSearchFormTextField('Name', '/')
            search.checkAdvancedSearchFormVisible(txt);
            cy.xpath(searchPage.resultsNumber).contains('21');

            cy.log('**** set the asset name type to Primary and check results have refined ****')
            search.selectFromAdvancedSearchDropDown_WithSearchBar('Name Type', 'Primary');
            cy.xpath(searchPage.resultsNumber).contains('19');

            cy.log('**** remove the advanced search form and check it has been successfully removed ****')
            cy.get('button').contains('Remove').click();
            search.checkAdvancedSearchFormRemoved();
        })
    })

    it('can use the or and and to refine advanced search results', () => {

        cy.log('**** add an advanced search facet and fill in a field ****')
            search.selectAdvancedSearchFacet('Asset Name');
            search.checkAdvancedSearchFormVisible();
            search.inputIntoAdvancedSearchFormTextField('Name', '/');
    
            cy.log('**** Add a second facet, fill in a field and click the Or button, checking results are filtered appropriately ****')
            search.selectAdvancedSearchFacet('Asset Description');
            cy.get('button').contains('Or').click();
            search.inputIntoAdvancedSearchFormTextField('Asset_Description', 'Medieval town');
            search.selectFromAdvancedSearchDropDown_WithSearchBar('Asset_Description_Type', 'Summary');
            cy.xpath(searchPage.resultsNumber).contains('583');

            cy.log('**** change from Or to And then ensure no results are returned ****')
            cy.get('button').contains('And').click();
            cy.xpath(searchPage.resultsNumber).contains('0');

            cy.log('**** remove the advanced search forms and check they have been successfully removed ****')
            cy.get('button').contains('Remove').click({ multiple: true });
            cy.get('button').contains('Remove').click();
            search.checkAdvancedSearchFormRemoved();

    })

    it('can populate larger more complex advanced search forms', () => {

        cy.xpath(searchPage.resultsNumber).then($res=>{
            let txt= $res.text();
            cy.log('Number of results: ',txt);

            search.selectAdvancedSearchFacet('Construction Phase and Type');
            search.checkAdvancedSearchFormVisible();

            cy.log('**** set the construction type to handbuilt and check results have refined ****')
            search.selectFromAdvancedSearchDropDown_WithSearchBar('Construction Evidence', 'Destroyed Monument');
                              
            search.checkAdvancedSearchFormVisible(txt);
            cy.xpath(searchPage.resultsNumber).contains('5655');

            cy.log('**** set the remaining options and check only 1 result remains ****')
            search.selectFromAdvancedSearchDropDown_WithSearchBar('Construction Method', 'Handbuilt');
            search.selectFromAdvancedSearchDropDown_WithSearchBar('Covering Material', 'EARTH MIX');
            search.selectFromAdvancedSearchDropDown_WithSearchBar('Construction Technique', 'Chance find');
            search.selectFromAdvancedSearchDropDown_WithSearchBar('Construction Description Type', 'Summary');
            search.selectFromAdvancedSearchDropDown_WithSearchBar('Cultural Period', '21st Century');
            search.selectFromAdvancedSearchDropDown_WithSearchBar('Main Construction Material', 'EARTH MIX');
            search.inputIntoAdvancedSearchFormTextField('Construction_From_Date', '2021-01-01');
            search.inputIntoAdvancedSearchFormTextField('Construction_To_Date', '2022-01-01');
            search.selectFromAdvancedSearchDropDown_WithSearchBar('Monument Type', 'Bee House');
            cy.xpath(searchPage.resultsNumber).contains('1');
           
            cy.log('**** input unexpected text and check no results are returned ****')
            search.inputIntoAdvancedSearchFormTextField('Construction Display Date', 'Test Fail');
            cy.xpath(searchPage.resultsNumber).contains('0');

            cy.log('**** remove the advanced search form and check it has been successfully removed ****')
            cy.get('button').contains('Remove').click();
            search.checkAdvancedSearchFormRemoved();
        })
    })

    it('can apply operators like equal or not from small dropdowns', () => {

        cy.xpath(searchPage.resultsNumber).then($res=>{
            let txt= $res.text();
            cy.log('Number of results: ',txt);

            search.selectAdvancedSearchFacet('NRHE to HER Accessioning');
            search.checkAdvancedSearchFormVisible();
            
            cy.log('**** set the accession status to completed and check results have refined ****')
            search.selectFromAdvancedSearchDropDown_NoSearchBar('Accession Status', 'Completed');
            
            search.checkAdvancedSearchFormVisible(txt);
            cy.xpath(searchPage.resultsNumber).contains('2');

            cy.log('**** change the accession status operator from EQUALS to NOT and check results have refined ****')
            search.selectOperatorFromAdvancedSearchDropDown('Accession Status', 'Not');
        
            cy.xpath(searchPage.resultsNumber).contains('20');    

            cy.get('button').contains('Remove').click();
            search.checkAdvancedSearchFormRemoved();
    
        })

    })

})
