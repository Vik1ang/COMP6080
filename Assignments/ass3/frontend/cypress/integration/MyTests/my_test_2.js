context('Test four - unhappy path - listing', () => {
    // it ('Successfully signs up', () => {
    //     cy.visit('localhost:3000/register');
    //     const name = 'Selina Jiang';
    //     const email  = 'selinajiang1@gmail.com';
    //     const password = '123';
    //     cy.get('input[name=name]')
    //       .focus()
    //       .type(name)
    //     cy.get('input[name=email]')
    //       .focus()
    //       .type(email)
    //     cy.get('input[name=password]')
    //       .focus()
    //       .type(password)
        
    //     cy.get('button[type = submit]')
    //       .click()

    // });


    it ('Successfully login', () => {
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


    it ('Invalid Bedrooms, automatically set to min value 1 ', () => {
        cy.visit('localhost:3000/host/new');
        const title  = 'The best place in Sydney rllylllly';
        const address  = '323 George Street';
        const price = '100000';
        const thumbnail = 'https://www.youtube.com/watch?v=12PMvXjnFdQ';
        const propertyType = "house";
        const bathrooms = "3";
        const bedrooms = "-1";
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


    it ('Invalid Bathrooms, automatically set to min value 0 ', () => {
        cy.visit('localhost:3000/host/new');
        const title  = 'The best place in Sydney yeahyeah';
        const address  = '323 George Street';
        const price = '100000';
        const thumbnail = 'https://www.youtube.com/watch?v=12PMvXjnFdQ';
        const propertyType = "house";
        const bathrooms = "-1";
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





});