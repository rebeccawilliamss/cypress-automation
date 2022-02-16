class HomePage {

  checkLoggedIn() {
    return cy.xpath('//a[contains(text(), "Log off")]').should('be.visible');
    
}

}

const webElems = {
  signInBtn: '//a[@class="application-login"]',
  searchBtn: '//a[contains(text(), "Search")]',
  logOffBtn: '//a[contains(text(), "Log off")]',
  expandNavBarBtn: '//button[@class="navbar-toggle"]',
  welcomeBtn: '//a[@href="/user"]',
  manageDataBtn: '//a[@href="/resource"]',
  cookiesBtn: '//span[contains(text(),"Accept all cookies")]/..',
};

export default HomePage;
export { webElems };
