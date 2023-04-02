Cypress.Commands.add('fillMandatoryFieldsAndSubmit', project => {
  cy.visit('src/index.html')

  cy.get('#firstName').type('Felipe')
  cy.get('#lastName').type('Caferro Tampelini')
  cy.get('#email').type('felipetampelini@gmail.com')
  cy.get('#phone').type('44997256970')
  cy.get('#product').should('be.enabled').select('cursos').type('Cursos')
  cy.get('input[value=elogio]').check().should('have.checked')
  cy.get('#email-checkbox').click()
  cy.get('#open-text-area').should('be.visible').type('Belo curso, obrigado! Buscando conhecimento. Utilizei o comando personalizado "fillMandatoryFieldsAndSubmit" aqui nesse teste! :D', {delay: 0})
  cy.contains('button', 'Enviar').click()
  cy.get('.success').should('be.visible')
})