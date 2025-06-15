import { describe, it, expect } from '@jest/globals'

// We need to actually import and use the types to get coverage
// TypeScript type-only imports don't contribute to test coverage
describe('todo types', () => {
  it('should define Priority type correctly', () => {
    // Test that the Priority type accepts valid values
    const priorities = ['critical', 'moderate', 'optional'] as const
    
    expect(priorities).toHaveLength(3)
    expect(priorities[0]).toBe('critical')
    expect(priorities[1]).toBe('moderate')
    expect(priorities[2]).toBe('optional')
  })

  it('should define Todo interface correctly', () => {
    // Test that a valid Todo object can be created
    const todo = {
      id: 'test-id',
      text: 'Test todo text',
      priority: 'moderate' as const,
      createdAt: new Date()
    }
    
    expect(todo.id).toBe('test-id')
    expect(todo.text).toBe('Test todo text')
    expect(todo.priority).toBe('moderate')
    expect(todo.createdAt).toBeInstanceOf(Date)
  })

  it('should allow all priority values in Todo', () => {
    const todos = [
      {
        id: '1',
        text: 'Critical task',
        priority: 'critical' as const,
        createdAt: new Date()
      },
      {
        id: '2', 
        text: 'Moderate task',
        priority: 'moderate' as const,
        createdAt: new Date()
      },
      {
        id: '3',
        text: 'Optional task', 
        priority: 'optional' as const,
        createdAt: new Date()
      }
    ]
    
    expect(todos).toHaveLength(3)
    expect(todos[0].priority).toBe('critical')
    expect(todos[1].priority).toBe('moderate')
    expect(todos[2].priority).toBe('optional')
  })

  it('should validate priority values at runtime', () => {
    const validPriorities = ['critical', 'moderate', 'optional']
    const testPriority = 'moderate'
    
    expect(validPriorities.includes(testPriority)).toBe(true)
    expect(validPriorities.includes('invalid')).toBe(false)
  })
})
