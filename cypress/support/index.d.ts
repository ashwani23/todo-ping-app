/// <reference types="cypress" />

declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * Add a todo item with specified priority
       * @param text - The todo text
       * @param priority - Priority level (default: 'moderate')
       * @example cy.addTodo('My task', 'critical')
       */
      addTodo(text: string, priority?: 'critical' | 'moderate' | 'optional'): Chainable<void>
      
      /**
       * Check if todo exists in the list
       * @param text - The todo text to look for
       * @example cy.todoShouldExist('My task')
       */
      todoShouldExist(text: string): Chainable<JQuery<HTMLElement>>
      
      /**
       * Check if todo has the expected priority
       * @param text - The todo text
       * @param priority - Expected priority level
       * @example cy.todoShouldHavePriority('My task', 'critical')
       */
      todoShouldHavePriority(text: string, priority: 'critical' | 'moderate' | 'optional'): Chainable<void>
      
      /**
       * Check if todo has the correct priority color indicator
       * @param text - The todo text
       * @param priority - Expected priority level
       * @example cy.todoShouldHavePriorityColor('My task', 'critical')
       */
      todoShouldHavePriorityColor(text: string, priority: 'critical' | 'moderate' | 'optional'): Chainable<void>
      
      /**
       * Edit a todo with new text and optionally new priority
       * @param originalText - Current todo text
       * @param newText - New todo text
       * @param newPriority - New priority level (optional)
       * @example cy.editTodo('Old task', 'New task', 'critical')
       */
      editTodo(originalText: string, newText: string, newPriority?: 'critical' | 'moderate' | 'optional'): Chainable<void>
      
      /**
       * Delete a todo by its text
       * @param text - The todo text to delete
       * @example cy.deleteTodo('Task to remove')
       */
      deleteTodo(text: string): Chainable<void>
      
      /**
       * Get the current todo count from the UI
       * @example cy.getTodoCount().should('equal', 3)
       */
      getTodoCount(): Chainable<number>
      
      /**
       * Wait for todos to be sorted by priority
       * @example cy.waitForTodosSorted()
       */
      waitForTodosSorted(): Chainable<void>
    }
  }
}

export {}
