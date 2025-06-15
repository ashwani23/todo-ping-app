import { describe, it, expect, jest } from '@jest/globals'
import { generateFormId, generateId, formatDate, confirmAction } from '../helpers'

// Mock window.confirm
const mockConfirm = jest.fn()
Object.defineProperty(window, 'confirm', {
  value: mockConfirm
})

describe('Helpers Utils', () => {
  describe('generateFormId', () => {
    it('should generate a unique form ID', () => {
      const id1 = generateFormId()
      const id2 = generateFormId()
      
      expect(id1).toBeTruthy()
      expect(id2).toBeTruthy()
      expect(id1).not.toBe(id2)
      expect(typeof id1).toBe('string')
      expect(id1.length).toBeGreaterThan(0)
    })
  })

  describe('generateId', () => {
    it('should generate a unique ID', () => {
      const id1 = generateId()
      const id2 = generateId()
      
      expect(id1).toBeTruthy()
      expect(id2).toBeTruthy()
      expect(id1).not.toBe(id2)
      expect(typeof id1).toBe('string')
      expect(id1.length).toBeGreaterThan(0)
    })

    it('should generate different IDs each time', () => {
      const ids = Array.from({ length: 10 }, () => generateId())
      const uniqueIds = new Set(ids)
      
      expect(uniqueIds.size).toBe(10)
    })
  })

  describe('formatDate', () => {
    it('should handle different dates', () => {
      const date1 = new Date('2023-12-25T23:59:00Z')
      const date2 = new Date('2023-06-01T01:00:00Z')
      
      const formatted1 = formatDate(date1)
      const formatted2 = formatDate(date2)
      
      expect(formatted1).toContain('Dec')
      expect(formatted2).toContain('Jun')
      expect(formatted1).not.toBe(formatted2)
    })
  })

  describe('confirmAction', () => {
    beforeEach(() => {
      mockConfirm.mockClear()
    })

    it('should call window.confirm with the message', () => {
      mockConfirm.mockReturnValue(true)
      
      const result = confirmAction('Are you sure?')
      
      expect(mockConfirm).toHaveBeenCalledWith('Are you sure?')
      expect(result).toBe(true)
    })

    it('should return false when user cancels', () => {
      mockConfirm.mockReturnValue(false)
      
      const result = confirmAction('Delete item?')
      
      expect(mockConfirm).toHaveBeenCalledWith('Delete item?')
      expect(result).toBe(false)
    })
  })
})
