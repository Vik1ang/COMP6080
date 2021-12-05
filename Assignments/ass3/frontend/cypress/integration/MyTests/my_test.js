context('Test one - happy path', () => {
    it ('Successfully signs up', () => {
        cy.visit('localhost:3000/register');
        const name = 'Selina Jiang';
        const email  = 'selinajiang321@gmail.com';
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
        

    });

    beforeEach(() => {
      cy.visit('localhost:3000/login');
      const email  = 'selinajiang321@gmail.com';
      const password = '123';
      cy.get('input[name=email]')
        .focus()
        .type(email)
      cy.get('input[name=password]')
        .focus()
        .type(password)
      
      cy.get('button[type = submit]')
        .click()
    });


    it ('Successfully create a new listing ', () => {
        cy.visit('localhost:3000/host/new');
        const title  = 'The best place in Sydney';
        const address  = '323 George Street';
        const price = '100000';
        const thumbnail = 'https://www.youtube.com/watch?v=12PMvXjnFdQ';
        const propertyType = "house";
        const bathrooms = "3";
        const bedrooms = "1";
        const amenities =  "Big Garden, swimmming pool";
        const images = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP';
        const beds = "10";
        const typeName = "queensize";
        
        cy.get('input[name=title]')
          .focus()
          .type(title)
        cy.get('input[name=address]')
          .focus()
          .type(address)
        cy.get('input[name=price]')
          .focus()
          .type(price)
        cy.get('input[name=amenities]')
          .focus()
          .type(amenities)
        cy.get('input[name=video]')
          .focus()
          .type(thumbnail)
        cy.get('input[name=bathrooms]')
          .focus()
          .type(bathrooms)
        cy.get('input[name=bedrooms]')
          .focus()
          .type(bedrooms)
        cy.get('input[name=propertyType]')
          .focus()
          .type(propertyType)
        
        cy.get('button[type = submit]')
          .click()

    });

    it ('Successfully update the thumbnail and the title' , () => {
       
        cy.visit('localhost:3000/host');
        const title  = 'The best place in Sydney ha ';
        const thumbnail = 'https://www.youtube.com/watch?v=jeZv5jgiDyo'
        cy.contains('Edit')
          .click()
        cy.get('input[name=title]')
          .focus()
          .type(title)
        
        cy.get('input[name= video]')
          .focus()
          .type(thumbnail)

        cy.get('button[type = submit]')
          .click()

    })


    it ("Successfully log out", () => {
      cy.visit('localhost:3000/');
      cy.contains('Profile')
          .click()
      cy.contains('Logout')
        .click()

    })

    it ("Successfully publish a listing", () => {
      cy.visit('localhost:3000/host');
      cy.contains('button','Publish')
          .click()
      cy.get('input[name = checkIn]')
        .focus()
        .type("11/17/2021")
      cy.get('input[name = checkOut]')
        .focus()
        .type("12/30/2021")
      // cy.get('[data-testid=RemoveIcon]').click()

      cy.get('button[name = confirmDate]')
      .click()
      cy.get('button[name = goLive]')
      .click()
    })

    it ("Successfully unpublish a listing", () => {
      cy.visit('localhost:3000/host');
      cy.get('button[name = unpublish]')
      .click()
    })

    it ("Successfully view the bookings", () => {
      cy.visit('localhost:3000/host');
      cy.get('button[name= bookings]')
        .click()
      cy.get('button[name= backProfit]')
        .click()

    })

    it ("Successfully delete a listing", () => {
      cy.visit('localhost:3000/host');

      cy.get('button[name= deleteListing]')
        .click()
    
     
    })

});