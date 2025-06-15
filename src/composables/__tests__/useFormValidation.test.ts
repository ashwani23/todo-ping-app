import { describe, it, expect } from '@jest/globals'
import { useFormValidation } from '../useFormValidation'

describe('useFormValidation', () => {
  describe('validateText', () => {
    it('should return true for valid text', () => {
      const { validateText, error } = useFormValidation()
      
      const result = validateText('Valid text')
      
      expect(result).toBe(true)
      expect(error.value).toBe('')
    })

    it('should return false for empty text', () => {
      const { validateText, error } = useFormValidation()
      
      const result = validateText('')
      
      expect(result).toBe(false)
      expect(error.value).toBe('Please enter a field')
    })

    it('should return false for whitespace-only text', () => {
      const { validateText, error } = useFormValidation()
      
      const result = validateText('   ')
      
      expect(result).toBe(false)
      expect(error.value).toBe('Please enter a field')
    })

    it('should use custom field name in error message', () => {
      const { validateText, error } = useFormValidation()
      
      const result = validateText('', 'task description')
      
      expect(result).toBe(false)
      expect(error.value).toBe('Please enter a task description')
    })

    it('should clear error before validation', () => {
      const { validateText, error, setError } = useFormValidation()
      
      setError('Previous error')
      expect(error.value).toBe('Previous error')
      
      validateText('Valid text')
      expect(error.value).toBe('')
    })
  })

  describe('clearError', () => {
    it('should clear the error', () => {
      const { error, setError, clearError } = useFormValidation()
      
      setError('Some error')
      expect(error.value).toBe('Some error')
      
      clearError()
      expect(error.value).toBe('')
    })
  })

  describe('setError', () => {
    it('should set custom error message', () => {
      const { error, setError } = useFormValidation()
      
      setError('Custom error message')
      expect(error.value).toBe('Custom error message')
    })

    it('should overwrite previous error', () => {
      const { error, setError } = useFormValidation()
      
      setError('First error')
      expect(error.value).toBe('First error')
      
      setError('Second error')
      expect(error.value).toBe('Second error')
    })
  })

  describe('error reactivity', () => {
    it('should be reactive', () => {
      const { error } = useFormValidation()
      
      expect(error.value).toBe('')
      
      // Test that error is a reactive ref
      expect(typeof error.value).toBe('string')
    })
  })
})
