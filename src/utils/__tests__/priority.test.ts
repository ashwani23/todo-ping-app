import { describe, it, expect } from '@jest/globals'
import { 
  PRIORITY_OPTIONS, 
  PRIORITY_ORDER, 
  getPriorityOption, 
  getPriorityButtonClasses,
  getPriorityIndicatorClasses 
} from '../priority'

describe('Priority Utils', () => {
  describe('PRIORITY_OPTIONS', () => {
    it('should have all priority options', () => {
      expect(PRIORITY_OPTIONS).toHaveLength(3)
      expect(PRIORITY_OPTIONS.map(p => p.value)).toEqual(['critical', 'moderate', 'optional'])
    })

    it('should have correct labels and colors', () => {
      const critical = PRIORITY_OPTIONS.find(p => p.value === 'critical')
      const moderate = PRIORITY_OPTIONS.find(p => p.value === 'moderate')
      const optional = PRIORITY_OPTIONS.find(p => p.value === 'optional')

      expect(critical).toEqual({ value: 'critical', label: 'Critical', color: 'red-500' })
      expect(moderate).toEqual({ value: 'moderate', label: 'Moderate', color: 'yellow-500' })
      expect(optional).toEqual({ value: 'optional', label: 'Optional', color: 'green-500' })
    })
  })

  describe('PRIORITY_ORDER', () => {
    it('should have correct priority order', () => {
      expect(PRIORITY_ORDER.critical).toBe(1)
      expect(PRIORITY_ORDER.moderate).toBe(2)
      expect(PRIORITY_ORDER.optional).toBe(3)
    })
  })

  describe('getPriorityOption', () => {
    it('should return correct priority option', () => {
      const critical = getPriorityOption('critical')
      expect(critical.value).toBe('critical')
      expect(critical.label).toBe('Critical')
      expect(critical.color).toBe('red-500')
    })

    it('should throw error for invalid priority', () => {
      expect(() => getPriorityOption('invalid' as any)).toThrow('Invalid priority: invalid')
    })
  })

  describe('getPriorityButtonClasses', () => {
    it('should return correct classes for selected critical priority', () => {
      const classes = getPriorityButtonClasses('critical', true)
      expect(classes).toContain('border-red-500')
      expect(classes).toContain('bg-red-50')
      expect(classes).toContain('px-3 py-2')
    })

    it('should return correct classes for unselected priority', () => {
      const classes = getPriorityButtonClasses('critical', false)
      expect(classes).toContain('border-gray-300')
      expect(classes).toContain('hover:border-gray-400')
    })

    it('should return compact classes when size is compact', () => {
      const classes = getPriorityButtonClasses('critical', true, 'compact')
      expect(classes).toContain('px-2 py-1')
    })

    it('should handle all priority types when selected', () => {
      const criticalClasses = getPriorityButtonClasses('critical', true)
      const moderateClasses = getPriorityButtonClasses('moderate', true)
      const optionalClasses = getPriorityButtonClasses('optional', true)

      expect(criticalClasses).toContain('border-red-500')
      expect(moderateClasses).toContain('border-yellow-500')
      expect(optionalClasses).toContain('border-green-500')
    })
  })

  describe('getPriorityIndicatorClasses', () => {
    it('should return correct classes for medium size', () => {
      const classes = getPriorityIndicatorClasses('critical')
      expect(classes).toContain('w-3 h-3')
      expect(classes).toContain('bg-priority-critical')
    })

    it('should return correct classes for small size', () => {
      const classes = getPriorityIndicatorClasses('critical', 'small')
      expect(classes).toContain('w-2 h-2')
      expect(classes).toContain('bg-priority-critical')
    })

    it('should handle all priority types', () => {
      const criticalClasses = getPriorityIndicatorClasses('critical')
      const moderateClasses = getPriorityIndicatorClasses('moderate')
      const optionalClasses = getPriorityIndicatorClasses('optional')

      expect(criticalClasses).toContain('bg-priority-critical')
      expect(moderateClasses).toContain('bg-priority-moderate')
      expect(optionalClasses).toContain('bg-priority-optional')
    })
  })
})
