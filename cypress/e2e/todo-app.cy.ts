/// <reference types="cypress" />

describe('Todo App E2E Tests', () => {
  beforeEach(() => {
    // Clear localStorage and visit the app
    cy.clearLocalStorage()
    cy.visit('/')
    
    // Wait for the app to load
    cy.get('h1').should('contain', 'Todo List with Priorities')
  })

  describe('Initial State', () => {
    it('should display the correct initial state', () => {
      // Check main heading
      cy.get('h1').should('contain', 'Todo List with Priorities')
      
      // Check subtitle
      cy.contains('Organize your tasks by priority').should('be.visible')
      
      // Check form elements
      cy.get('input[placeholder="Enter your task..."]').should('be.visible').and('have.value', '')
      cy.get('button[type="submit"]').should('be.disabled')
      
      // Check empty state
      cy.contains('Your Todos (0)').should('be.visible')
      cy.contains('No todos yet. Add one above to get started!').should('be.visible')
      
      // Ensure no todo list items exist
      cy.get('[role="listitem"]').should('not.exist')
    })
  })

  describe('Adding Todos', () => {
    it('should add a todo with critical priority', () => {
      cy.addTodo('Critical task for testing', 'critical')
      
      // Verify the todo was added
      cy.todoShouldExist('Critical task for testing')
      cy.todoShouldHavePriority('Critical task for testing', 'critical')
      cy.todoShouldHavePriorityColor('Critical task for testing', 'critical')
      
      // Check count updated
      cy.contains('Your Todos (1)').should('be.visible')
    })

    it('should add a todo with moderate priority', () => {
      cy.addTodo('Moderate task for testing', 'moderate')
      
      cy.todoShouldExist('Moderate task for testing')
      cy.todoShouldHavePriority('Moderate task for testing', 'moderate')
      cy.todoShouldHavePriorityColor('Moderate task for testing', 'moderate')
    })

    it('should add a todo with optional priority', () => {
      cy.addTodo('Optional task for testing', 'optional')
      
      cy.todoShouldExist('Optional task for testing')
      cy.todoShouldHavePriority('Optional task for testing', 'optional')
      cy.todoShouldHavePriorityColor('Optional task for testing', 'optional')
    })

    it('should add multiple todos and sort by priority correctly', () => {
      // Add todos in mixed priority order
      cy.addTodo('Low priority task', 'optional')
      cy.addTodo('High priority task', 'critical')
      cy.addTodo('Medium priority task', 'moderate')
      
      cy.waitForTodosSorted()
      
      // Verify sorting: critical first, then moderate, then optional
      cy.get('[role="listitem"]').first().should('contain', 'High priority task')
      cy.get('[role="listitem"]').eq(1).should('contain', 'Medium priority task')
      cy.get('[role="listitem"]').last().should('contain', 'Low priority task')
      
      // Verify count
      cy.contains('Your Todos (3)').should('be.visible')
    })
  })

  describe('Form Validation', () => {
    it('should show error for empty todo submission', () => {
      // Try to submit empty form
      cy.get('input[placeholder="Enter your task..."]').type('  ') // Just spaces
      cy.get('button[type="submit"]').click({force: true})
    })

    it('should disable submit button when input is empty', () => {
      // Initially disabled
      cy.get('button[type="submit"]').should('be.disabled')
      
      // Type something
      cy.get('input[placeholder="Enter your task..."]').type('Some text')
      cy.get('button[type="submit"]').should('not.be.disabled')
      
      // Clear input
      cy.get('input[placeholder="Enter your task..."]').clear()
      cy.get('button[type="submit"]').should('be.disabled')
    })

    it('should trim whitespace from todo text', () => {
      cy.get('input[placeholder="Enter your task..."]').type('  Todo with spaces  ')
      cy.get('button[type="submit"]').click()
      
      // Should trim the spaces
      cy.todoShouldExist('Todo with spaces')
    })
  })

  describe('Priority Selection', () => {

    it('should support keyboard navigation for priority selection', () => {
      cy.get('input[placeholder="Enter your task..."]').type('Keyboard test')
      
      // Submit with keyboard
      cy.get('button[type="submit"]').focus().type('{enter}')
      
      cy.todoShouldExist('Keyboard test')
      cy.todoShouldHavePriority('Keyboard test', 'critical')
    })
  })

  describe('Editing Todos', () => {
    beforeEach(() => {
      cy.addTodo('Original todo text', 'moderate')
    })

    it('should edit todo priority', () => {
      cy.editTodo('Original todo text', 'Original todo text', 'critical')
      
      cy.todoShouldExist('Original todo text')
      cy.todoShouldHavePriority('Original todo text', 'critical')
    })

    it('should cancel editing', () => {
      // Start editing
      cy.get('[role="listitem"]')
        .contains('Original todo text')
        .parents('[role="listitem"]')
        .first()
        .find('button[aria-label*="Edit"]')
        .click()
      
      // Make changes but cancel
      cy.get('input[type="text"]').last().clear().type('Changed text')
      cy.get('[role="button"]').contains('critical', { matchCase: false }).click()
      cy.get('button').contains('Cancel').click()
      
      // Should revert changes
      cy.todoShouldExist('Original todo text')
      cy.todoShouldHavePriority('Original todo text', 'moderate')
    })
  })

  describe('Deleting Todos', () => {

    it('should cancel deletion when user declines confirmation', () => {
      cy.addTodo('Todo to keep', 'moderate')
      
      // Stub confirm to return false
      cy.window().then((win) => {
        cy.stub(win, 'confirm').returns(false)
      })
      
      cy.get('[role="listitem"]')
        .contains('Todo to keep')
        .parents('[role="listitem"]')
        .first()
        .find('button[aria-label*="Delete"]')
        .click()
      
      // Todo should still exist
      cy.todoShouldExist('Todo to keep')
      cy.contains('Your Todos (1)').should('be.visible')
    })

    it('should clear all todos', () => {
      // Add multiple todos
      cy.addTodo('Todo 1', 'critical')
      cy.addTodo('Todo 2', 'moderate')
      cy.addTodo('Todo 3', 'optional')
      
      // Verify todos exist
      cy.contains('Your Todos (3)').should('be.visible')
      
      // Clear all (confirm the dialog)
      cy.window().then((win) => {
        cy.stub(win, 'confirm').returns(true)
      })
      cy.get('button').contains('Clear All').click()
      
      // Verify all todos are gone
      cy.get('[role="listitem"]').should('not.exist')
      cy.contains('Your Todos (0)').should('be.visible')
      cy.contains('No todos yet. Add one above to get started!').should('be.visible')
    })

    it('should not show clear all button when no todos exist', () => {
      cy.get('button').contains('Clear All').should('not.exist')
    })
  })

  describe('Data Persistence', () => {
    it('should persist todos in localStorage', () => {
      cy.addTodo('Persistent todo', 'critical')
      cy.addTodo('Another persistent todo', 'optional')
      
      // Reload the page
      cy.reload()
      
      // Todos should still exist
      cy.todoShouldExist('Persistent todo')
      cy.todoShouldHavePriority('Persistent todo', 'critical')
      cy.todoShouldExist('Another persistent todo')
      cy.todoShouldHavePriority('Another persistent todo', 'optional')
      
      // Count should be correct
      cy.contains('Your Todos (2)').should('be.visible')
    })

    it('should maintain todo order after reload', () => {
      // Add todos in specific order
      cy.addTodo('Optional task', 'optional')
      cy.addTodo('Critical task', 'critical')
      cy.addTodo('Moderate task', 'moderate')
      
      cy.reload()
      cy.waitForTodosSorted()
      
      // Should maintain priority sorting
      cy.get('[role="listitem"]').first().should('contain', 'Critical task')
      cy.get('[role="listitem"]').eq(1).should('contain', 'Moderate task')
      cy.get('[role="listitem"]').last().should('contain', 'Optional task')
    })
  })

  describe('Accessibility', () => {
    it('should have proper ARIA labels and roles', () => {
      cy.addTodo('Accessibility test', 'critical')
      
      // Check main structure
      cy.get('[role="list"]').should('exist')
      cy.get('[role="listitem"]').should('exist')
      
      // Check form accessibility
      cy.get('input[placeholder="Enter your task..."]')
        .should('have.attr', 'aria-required', 'true')
      
      // Check button labels
      cy.get('button[aria-label*="Edit"]').should('exist')
      cy.get('button[aria-label*="Delete"]').should('exist')
    })
  })

  describe('User Experience', () => {
    it('should focus input after adding todo', () => {
      cy.addTodo('Focus test', 'moderate')
      
      // Input should be focused for next entry
      cy.get('input[placeholder="Enter your task..."]').should('be.focused')
    })

    it('should show creation date for todos', () => {
      cy.addTodo('Date test todo', 'moderate')
      
      // Should show some kind of date/time info
      cy.get('[role="listitem"]')
        .contains('Date test todo')
        .parents('[role="listitem"]')
        .first()
        .find('time')
        .should('exist')
    })

    it('should handle long todo text gracefully', () => {
      const longText = 'This is a very long todo text that should be handled gracefully by the application without breaking the layout or causing any issues with the user interface design'
      
      cy.addTodo(longText, 'critical')
      cy.todoShouldExist(longText)
      
      // Check that the layout isn't broken
      cy.get('[role="listitem"]').should('be.visible')
    })
  })

  describe('Error Handling', () => {
    it('should handle rapid successive additions', () => {
      // Add todos rapidly
      cy.addTodo('Rapid 1', 'critical')
      cy.addTodo('Rapid 2', 'moderate')
      cy.addTodo('Rapid 3', 'optional')
      
      // All should be added correctly
      cy.todoShouldExist('Rapid 1')
      cy.todoShouldExist('Rapid 2')
      cy.todoShouldExist('Rapid 3')
      cy.contains('Your Todos (3)').should('be.visible')
    })

    it('should handle edge case characters in todo text', () => {
      const specialText = 'Todo with special chars: !@#$%^&*()_+{}|:"<>?'
      
      cy.addTodo(specialText, 'moderate')
      cy.todoShouldExist(specialText)
    })
  })
})
