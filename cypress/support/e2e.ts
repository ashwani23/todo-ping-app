// ***********************************************************
// This example support/e2e.ts is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.ts using ES2015 syntax:
import './commands'

// Alternatively you can use CommonJS syntax:
// require('./commands')

// Custom commands for todo app
declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * Clear localStorage before test
       */
      clearLocalStorage(): Chainable<void>
      
      /**
       * Add a todo item with specified priority
       */
      addTodo(text: string, priority?: 'critical' | 'moderate' | 'optional'): Chainable<void>
      
      /**
       * Check if todo exists in the list
       */
      todoShouldExist(text: string): Chainable<void>
      
      /**
       * Check priority color indicator
       */
      todoShouldHavePriority(text: string, priority: 'critical' | 'moderate' | 'optional'): Chainable<void>
    }
  }
}
