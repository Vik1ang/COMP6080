context('Test three - unhappy path', () => {

    it ('Login in with an invalid email', () => {
        cy.visit('localhost:3000/login');
        const email  = 'selinajiang21@gmail.com';
        const password = '123';
        cy.get('input[name=email]')
          .focus()
          .type(email)
        cy.get('input[name=password]')
          .focus()
          .type(password)
        
        cy.get('button[type = submit]')
          .click()

        cy.wait(1000)
    });

    it ('Successfully signs up', () => {
        cy.visit('localhost:3000/register');
        const name = 'Selina Jiang';
        const email  = 'selinajiang21@gmail.com';
        const password = '123';
        cy.get('input[name=name]')
          .focus()
          .type(name)
        cy.get('input[name=email]')
          .focus()
          .type(email)
        cy.get('input[name=password]')
          .focus()
          .type(password)
          cy.get('button[type = submit]')
          .click()
        
        cy.get('button[type = submit]')
          .click()

    });

    it ('Empty User name', () => {
        cy.visit('localhost:3000/register');
        const email  = 'selinajiang21@gmail.com';
        const password = '123';
        cy.get('input[name=email]')
          .focus()
          .type(email)
        cy.get('input[name=password]')
          .focus()
          .type(password)
        
        cy.get('button[type = submit]')
          .click()
        cy.wait(1000)

    });

    it ('Signs up again', () => {
        cy.visit('localhost:3000/register');
        const name = 'Selina Jiang';
        const email  = 'selinajiang21@gmail.com';
        const password = '123';
        cy.get('input[name=name]')
          .focus()
          .type(name)
        cy.get('input[name=email]')
          .focus()
          .type(email)
        cy.get('input[name=password]')
          .focus()
          .type(password)
        cy.get('button[type = submit]')
          .click()

        cy.wait(1000)

    });


    
});