class SearchPage{
    constructor(){
    }

    selectFromTimeFilters(ddlTitle,option){
        cy.xpath(`//h3[@class='search-label' and text()='${ddlTitle}']/../div/a/div/b`)
        .click({force: true});
        cy.xpath(`(//h3[@class="search-label" and text()='${ddlTitle}']/../div/div/ul/li[text()='${option}'])[1]`)
        .click();
        // Associated Activities - Start Date
    }

    advancedSearchCategoryIsPresent(category ){
        return cy.xpath(`//h4/strong[contains(text(),'${category}')]`);
    }

    selectAdvancedSearchFacet(searchFacet) {
        return cy.xpath(`//h4[contains(text(), '${searchFacet}')]`).click();
        }

      selectOperatorFromAdvancedSearchDropDown(label, option) {
        return cy.xpath(`(//div[contains(text(), '${label}')]/../div//b)[1]`).click()
        .get('.active-result').contains(option).click();
    }
    
    selectFromAdvancedSearchDropDown_WithSearchBar(label, option) {
        return cy.xpath(`(//div[contains(text(), '${label}')]/../div//b)[2]`).click()
        .get('.select2-result-label').contains(option).click();
    }

    selectFromAdvancedSearchDropDown(label, option) {
        return cy.xpath(`//div[contains(text(), '${label}')]/../div/div/div/a/span/b`)
        .click()
        .get('.select2-result-label')
        .contains(option)
        .click();
    }

    selectSearchResultsLabel(label) {
        return cy.get('.select2-results').within(() => {
            cy.xpath(`(//span[contains(text(), '${label}')])[1]`)
            .click();
        })
    }

    selectFromAdvancedSearchDropDown_NoSearchBar(label, option) {
        return cy.xpath(`(//div[contains(text(), '${label}')]/../div//b)[2]`).click()
        .get('li').contains(option).click();
    }

    inputIntoAdvancedSearchFormTextField(label, text) {
        return cy.xpath(`(//div[contains(text(), '${label}')]/../div//input[@placeholder='Name'])`).type(text);
    }
  
    checkAdvancedSearchFormVisible() {
        return cy.xpath('//div[@class="faceted-search-card-container"]').should('be.visible');
        // return cy.xpath(SearchPage.advancedSearchForm).should('be.visible');
    }
    
    checkResultsNumberChanges(txt) {
        return cy.xpath('//h2[@class="search-title"]').invoke('text').should('not.eq',txt);
        // return cy.xpath(SearchPage.resultsNumber).invoke('text').should('not.eq',txt);
    }

    checkAdvancedSearchFormRemoved() {
        return cy.xpath('//div[@class="rr-splash-title"]').contains('Advanced Search').should('be.visible');
    }

}

const webElems ={
    searchBar: '//input[@id="s2id_autogen2"]',
    searchTabNavBar : '//a[@href="/search"]',
    resultsNumber : '//h2[@class="search-title"]',
    findAResourceInput : '//li[@class="select2-search-field"]/input',
    searchResultsLabel : `(//span[contains(text(), '1628801')])[2]`,
    searchResultsLabel2: `(//span[contains(text(), 'Andover')])[2]`,
    timeFilterBtn : '//span[text()="Time Filter"]/..',
    mapInput : '//input[@class="mapboxgl-ctrl-geocoder--input"]',
    mapInputSuggLabel : '//div[@class="mapboxgl-ctrl-geocoder--suggestion-address"]',
    mapInputFirstSuggLabel : '(//div[@class="mapboxgl-ctrl-geocoder--suggestion"])[1]',
    outputSearchBtn : '//a[@href="/exporter/exporter"]',
    exportResultsToCsvBtn : '(//button[contains(text(),"Export Results to CSV")])[1]',
    advancedSearchBtn : '//span[text()="Advanced"]/..',
    advancedSearchForm : '//div[@class="faceted-search-card-container"]',
};

export default SearchPage;
export {webElems};