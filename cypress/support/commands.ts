// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

// Custom commands for todo app
Cypress.Commands.add('clearLocalStorage', () => {
  cy.window().then((win) => {
    win.localStorage.clear()
  })
})

Cypress.Commands.add('addTodo', (text: string, priority: 'critical' | 'moderate' | 'optional' = 'moderate') => {
  // Type the todo text
  cy.get('input[placeholder="Enter your task..."]').type(text)
  
  // Select priority if not moderate (default)
  if (priority !== 'moderate') {
    cy.get(`[role="button"]`).contains(priority, { matchCase: false }).click()
  }
  
  // Submit the form
  cy.get('button[type="submit"]').click()
})

Cypress.Commands.add('todoShouldExist', (text: string) => {
  cy.get('[role="listitem"]').should('contain', text)
})

Cypress.Commands.add('todoShouldHavePriority', (text: string, priority: 'critical' | 'moderate' | 'optional') => {
  cy.get('[role="listitem"]')
    .contains(text)
    .parent()
    .should('contain', priority)
})
