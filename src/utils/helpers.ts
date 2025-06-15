/**
 * Generate a unique ID for form elements
 */
export function generateFormId(): string {
  return Math.random().toString(36).substr(2, 9)
}

/**
 * Generate unique ID for any purpose
 */
export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2)
}

/**
 * Format date for display
 */
export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit'
  }).format(date)
}

/**
 * Confirmation dialog helper
 */
export function confirmAction(message: string): boolean {
  return window.confirm(message)
}
