import { describe, it, expect } from '@jest/globals'
import { 
  getPriorityAriaLabel, 
  getTodoActionAriaLabel, 
  getAddTodoAriaLabel, 
  getClearAllAriaLabel 
} from '../accessibility'

describe('Accessibility Utils', () => {
  describe('getPriorityAriaLabel', () => {
    it('should return correct aria label for critical priority', () => {
      expect(getPriorityAriaLabel('critical')).toBe('critical priority')
    })

    it('should return correct aria label for moderate priority', () => {
      expect(getPriorityAriaLabel('moderate')).toBe('moderate priority')
    })

    it('should return correct aria label for optional priority', () => {
      expect(getPriorityAriaLabel('optional')).toBe('optional priority')
    })
  })

  describe('getTodoActionAriaLabel', () => {
    it('should return correct aria label for edit action', () => {
      const label = getTodoActionAriaLabel('edit', 'Buy groceries')
      expect(label).toBe('Edit todo: Buy groceries')
    })

    it('should return correct aria label for delete action', () => {
      const label = getTodoActionAriaLabel('delete', 'Walk the dog')
      expect(label).toBe('Delete todo: Walk the dog')
    })

    it('should handle special characters in todo text', () => {
      const label = getTodoActionAriaLabel('edit', 'Call John @ 5:00 PM')
      expect(label).toBe('Edit todo: Call John @ 5:00 PM')
    })
  })

  describe('getAddTodoAriaLabel', () => {
    it('should return correct aria label for critical priority', () => {
      expect(getAddTodoAriaLabel('critical')).toBe('Add new critical priority todo')
    })

    it('should return correct aria label for moderate priority', () => {
      expect(getAddTodoAriaLabel('moderate')).toBe('Add new moderate priority todo')
    })

    it('should return correct aria label for optional priority', () => {
      expect(getAddTodoAriaLabel('optional')).toBe('Add new optional priority todo')
    })
  })

  describe('getClearAllAriaLabel', () => {
    it('should return correct aria label for single todo', () => {
      expect(getClearAllAriaLabel(1)).toBe('Clear all 1 todos')
    })

    it('should return correct aria label for multiple todos', () => {
      expect(getClearAllAriaLabel(5)).toBe('Clear all 5 todos')
    })

    it('should return correct aria label for zero todos', () => {
      expect(getClearAllAriaLabel(0)).toBe('Clear all 0 todos')
    })
  })
})
