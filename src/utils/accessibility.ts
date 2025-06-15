import { Priority } from '@/types/todo'

/**
 * Get ARIA label for priority
 */
export function getPriorityAriaLabel(priority: Priority): string {
  return `${priority} priority`
}

/**
 * Get ARIA label for todo action
 */
export function getTodoActionAriaLabel(action: 'edit' | 'delete', todoText: string): string {
  const actionText = action === 'edit' ? 'Edit' : 'Delete'
  return `${actionText} todo: ${todoText}`
}

/**
 * Get ARIA label for add todo button
 */
export function getAddTodoAriaLabel(priority: Priority): string {
  return `Add new ${priority} priority todo`
}

/**
 * Get ARIA label for clear all button
 */
export function getClearAllAriaLabel(count: number): string {
  return `Clear all ${count} todos`
}
