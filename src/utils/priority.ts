import { Priority } from '@/types/todo'

export interface PriorityOption {
  value: Priority
  label: string
  color: string
}

/**
 * Centralized priority configuration
 */
export const PRIORITY_OPTIONS: PriorityOption[] = [
  { value: 'critical', label: 'Critical', color: 'red-500' },
  { value: 'moderate', label: 'Moderate', color: 'yellow-500' },
  { value: 'optional', label: 'Optional', color: 'green-500' }
] as const

/**
 * Priority order for sorting
 */
export const PRIORITY_ORDER: Record<Priority, number> = {
  critical: 1,
  moderate: 2,
  optional: 3
} as const

/**
 * Get priority option by value
 */
export function getPriorityOption(priority: Priority): PriorityOption {
  const option = PRIORITY_OPTIONS.find(p => p.value === priority)
  if (!option) {
    throw new Error(`Invalid priority: ${priority}`)
  }
  return option
}

/**
 * Get CSS classes for priority button styling
 */
export function getPriorityButtonClasses(
  priority: Priority, 
  isSelected: boolean, 
  size: 'default' | 'compact' = 'default'
): string {
  const baseClasses = 'flex items-center rounded-md border-2 transition-all focus-outline'
  const sizeClasses = size === 'compact' ? 'px-2 py-1' : 'px-3 py-2'
  
  if (isSelected) {
    switch (priority) {
      case 'critical':
        return `${baseClasses} ${sizeClasses} border-red-500 bg-red-50`
      case 'moderate':
        return `${baseClasses} ${sizeClasses} border-yellow-500 bg-yellow-50`
      case 'optional':
        return `${baseClasses} ${sizeClasses} border-green-500 bg-green-50`
      default:
        return `${baseClasses} ${sizeClasses} border-gray-300`
    }
  } else {
    return `${baseClasses} ${sizeClasses} border-gray-300 hover:border-gray-400`
  }
}

/**
 * Get priority indicator (dot) classes
 */
export function getPriorityIndicatorClasses(priority: Priority, size: 'small' | 'medium' = 'medium'): string {
  const sizeClass = size === 'small' ? 'w-2 h-2' : 'w-3 h-3'
  return `${sizeClass} rounded-full bg-priority-${priority}`
}
