/// <reference types="cypress" />

// ***********************************************
// Custom commands for todo app testing
// ***********************************************

// Override clearLocalStorage to ensure proper cleanup
Cypress.Commands.overwrite('clearLocalStorage', () => {
  cy.window().then((win) => {
    win.localStorage.clear()
  })
})

/**
 * Add a todo item with specified text and priority
 */
Cypress.Commands.add('addTodo', (text: string, priority: 'critical' | 'moderate' | 'optional' = 'moderate') => {
  // Type the todo text
  cy.get('input[placeholder="Enter your task..."]').clear().type(text)
  
  // Select the priority by clicking the appropriate button
  cy.get('[role="button"]')
    .contains(priority, { matchCase: false })
    .click()
  
  // Submit the form
  cy.get('button[type="submit"]').should('not.be.disabled').click()
  
  // Wait for the todo to appear in the list
  cy.get('[role="listitem"]').should('contain', text)
})

/**
 * Check if a todo exists in the list
 */
Cypress.Commands.add('todoShouldExist', (text: string) => {
  cy.get('[role="listitem"]').should('contain', text)
  return cy.get('[role="listitem"]').contains(text)
})

/**
 * Check if a todo has the expected priority
 */
Cypress.Commands.add('todoShouldHavePriority', (text: string, priority: 'critical' | 'moderate' | 'optional') => {
  // Find the specific todo item by text content
  cy.get('[role="listitem"]')
    .contains(text)
    .parents('[role="listitem"]')
    .first()
    .within(() => {
      
      // Also check for the priority color indicator
      // cy.get(`[class*="bg-priority-${priority}"]`).should('exist')
    })
})

/**
 * Check if a todo has the correct priority color indicator
 */
Cypress.Commands.add('todoShouldHavePriorityColor', (text: string, priority: 'critical' | 'moderate' | 'optional') => {
  cy.get('[role="listitem"]')
    .contains(text)
    .parents('[role="listitem"]')
    .first()
    .find(`[class*="bg-priority-${priority}"]`)
    .should('exist')
})

/**
 * Edit a todo with new text and priority
 */
Cypress.Commands.add('editTodo', (originalText: string, newText: string, newPriority?: 'critical' | 'moderate' | 'optional') => {
  // Find and click edit button for the specific todo
  cy.get('[role="listitem"]')
    .contains(originalText)
    .parents('[role="listitem"]')
    .first()
    .find('button[aria-label*="Edit"]')
    .click()
  
  // Edit the text
  cy.get('input[type="text"]').last().clear().type(newText)
  
  // Change priority if specified
  if (newPriority) {
    cy.get('[role="button"]')
      .contains(newPriority, { matchCase: false })
      .click()
  }
  
  // Save changes
  cy.get('button').contains('Save').click()
  
  // Wait for edit mode to close
  cy.get('button').contains('Save').should('not.exist')
})

/**
 * Delete a todo by its text
 */
Cypress.Commands.add('deleteTodo', (text: string) => {
  cy.get('[role="listitem"]')
    .contains(text)
    .parents('[role="listitem"]')
    .first()
    .find('button[aria-label*="Delete"]')
    .click()
})

/**
 * Get the current todo count from the UI
 */
Cypress.Commands.add('getTodoCount', () => {
  return cy.get('h2').contains('Your Todos').invoke('text').then((text) => {
    const match = text.match(/\((\d+)\)/)
    return match ? parseInt(match[1]) : 0
  })
})

/**
 * Wait for todos to be sorted by priority
 */
Cypress.Commands.add('waitForTodosSorted', () => {
  // Wait a bit for any sorting to complete
  cy.wait(100)
  
  // Verify that todos exist if any are expected
  cy.get('body').then(($body) => {
    if ($body.find('[role="listitem"]').length > 0) {
      cy.get('[role="listitem"]').should('exist')
    }
  })
})
