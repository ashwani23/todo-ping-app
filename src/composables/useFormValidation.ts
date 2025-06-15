import { ref } from 'vue'

/**
 * Form validation composable for reusable validation logic
 */
export function useFormValidation() {
  const error = ref('')

  /**
   * Validate text input (non-empty after trimming)
   */
  const validateText = (text: string, fieldName: string = 'field'): boolean => {
    error.value = ''
    
    if (!text.trim()) {
      error.value = `Please enter a ${fieldName}`
      return false
    }
    
    return true
  }

  /**
   * Clear current error
   */
  const clearError = (): void => {
    error.value = ''
  }

  /**
   * Set custom error message
   */
  const setError = (message: string): void => {
    error.value = message
  }

  return {
    error,
    validateText,
    clearError,
    setError
  }
}
