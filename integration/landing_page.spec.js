
describe('Landing page functionalities',function(){
      beforeEach(()=>{
        Cypress.Cookies.preserveOnce('ai_session', 'csrftoken','/','ai_user');
        cy.visit('/');
        cy.viewport(1600, 1200);
    })

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

it('can log into the application', () => {

    cy.login({ username: '/', password: '/'});
    cy.xpath('//a[contains(text(), "Log off")]').should('be.visible');
})

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

it('nav bar should have 7 links when user is logged in', () => {

    cy.get('.navbar-nav').children().should('have.length', 5);
})

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

it('can click all links in the nav bar', () => {

    const links = ['About/', 'Search', 'Manage Data']

    links.forEach(link => {

        cy
        .contains(link)
        .then((link) =>{
            cy
            .request(link.prop('href'))
            .its('status')
            .should('eq', 200);
        })
    })
})
})



