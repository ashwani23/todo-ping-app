describe('Todo App E2E', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    cy.clearLocalStorage()
    cy.visit('/')
  })

  it('should display empty state initially', () => {
    cy.get('h1').should('contain', 'Todo List with Priorities')
    cy.get('[role="list"]').should('not.exist')
    cy.contains('No todos yet. Add one above to get started!').should('be.visible')
  })

  it('should add a new todo', () => {
    cy.addTodo('My first todo', 'critical')
    
    cy.todoShouldExist('My first todo')
    cy.todoShouldHavePriority('My first todo', 'critical')
  })

  it('should add multiple todos and sort by priority', () => {
    // Add todos in mixed priority order
    cy.addTodo('Optional task', 'optional')
    cy.addTodo('Critical task', 'critical')
    cy.addTodo('Moderate task', 'moderate')

    // Check that they are sorted by priority (critical, moderate, optional)
    cy.get('[role="listitem"]').first().should('contain', 'Critical task')
    cy.get('[role="listitem"]').eq(1).should('contain', 'Moderate task')
    cy.get('[role="listitem"]').last().should('contain', 'Optional task')
  })

  it('should edit a todo', () => {
    cy.addTodo('Original todo', 'moderate')
    
    // Click edit button
    cy.get('[aria-label*="Edit todo"]').click()
    
    // Clear and type new text
    cy.get('input[type="text"]').last().clear().type('Updated todo')
    
    // Change priority to critical
    cy.get('[role="button"]').contains('critical', { matchCase: false }).click()
    
    // Save changes
    cy.get('button').contains('Save').click()
    
    cy.todoShouldExist('Updated todo')
    cy.todoShouldHavePriority('Updated todo', 'critical')
  })

  it('should delete a todo', () => {
    cy.addTodo('Todo to delete', 'moderate')
    
    cy.todoShouldExist('Todo to delete')
    
    // Click delete button
    cy.get('[aria-label*="Delete todo"]').click()
    
    cy.todoShouldExist('Todo to delete').should('not.exist')
    cy.contains('No todos yet. Add one above to get started!').should('be.visible')
  })

  it('should clear all todos', () => {
    // Add multiple todos
    cy.addTodo('Todo 1', 'critical')
    cy.addTodo('Todo 2', 'moderate')
    cy.addTodo('Todo 3', 'optional')
    
    // Verify todos exist
    cy.get('[role="listitem"]').should('have.length', 3)
    
    // Click clear all
    cy.get('button').contains('Clear All').click()
    
    // Verify all todos are gone
    cy.get('[role="listitem"]').should('not.exist')
    cy.contains('No todos yet. Add one above to get started!').should('be.visible')
  })

  it('should persist todos in localStorage', () => {
    cy.addTodo('Persistent todo', 'critical')
    
    // Reload page
    cy.reload()
    
    // Todo should still exist
    cy.todoShouldExist('Persistent todo')
    cy.todoShouldHavePriority('Persistent todo', 'critical')
  })

  it('should show error for empty todo', () => {
    // Try to submit empty form
    cy.get('button[type="submit"]').click()
    
    cy.get('[role="alert"]').should('contain', 'Please enter a task description')
  })

  it('should disable submit button when input is empty', () => {
    cy.get('button[type="submit"]').should('be.disabled')
    
    cy.get('input[placeholder="Enter your task..."]').type('Some text')
    cy.get('button[type="submit"]').should('not.be.disabled')
    
    cy.get('input[placeholder="Enter your task..."]').clear()
    cy.get('button[type="submit"]').should('be.disabled')
  })

  it('should support keyboard navigation', () => {
    cy.get('input[placeholder="Enter your task..."]').type('Keyboard todo')
    
    // Use keyboard to select priority
    cy.get('[role="button"]').contains('critical', { matchCase: false }).focus().type('{enter}')
    
    // Submit with keyboard
    cy.get('button[type="submit"]').focus().type('{enter}')
    
    cy.todoShouldExist('Keyboard todo')
    cy.todoShouldHavePriority('Keyboard todo', 'critical')
  })

  it('should handle todo count display', () => {
    // Initially no count shown
    cy.contains('Your Todos (0)').should('be.visible')
    
    cy.addTodo('First todo', 'moderate')
    cy.contains('Your Todos (1)').should('be.visible')
    
    cy.addTodo('Second todo', 'critical')
    cy.contains('Your Todos (2)').should('be.visible')
    
    // Delete one
    cy.get('[aria-label*="Delete todo"]').first().click()
    cy.contains('Your Todos (1)').should('be.visible')
  })
})
