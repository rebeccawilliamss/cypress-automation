describe('Login to the Warden as a existing user',function(){

    beforeEach(() =>
    {
      cy.log("Before every scenario use existing auth token");
      Cypress.Cookies.preserveOnce(
      'ai_session',
      'csrftoken',
      'warden',
      'ai_user');
    })

    it('Log in',function(){

      cy.log('**** Navigate to warden website ****');
      cy.visit('/');
      cy.viewport(1600, 1200);

      cy.log('********** Log in as a user **********');
      cy.login({ username: '/', password: '/'});

      cy.log('********** Check if user can logout **********');
      cy.contains('Log off').click();
      cy.get('h1').contains('Sign In');

    })
})


