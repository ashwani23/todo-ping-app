import { computed, ref, Ref } from 'vue'
import { Todo, Priority } from '@/types/todo'
import { useLocalStorage } from './useLocalStorage'

export function useTodos() {
  const { todos, saveTodos } = useLocalStorage()
  const editingId = ref<string | null>(null)

  // Priority order for sorting
  const priorityOrder: Record<Priority, number> = {
    critical: 1,
    moderate: 2,
    optional: 3
  }

  // Computed sorted todos
  const sortedTodos = computed(() => {
    return [...todos.value].sort((a, b) => {
      const priorityDiff = priorityOrder[a.priority] - priorityOrder[b.priority]
      if (priorityDiff !== 0) return priorityDiff
      // If same priority, sort by creation date (newest first)
      return b.createdAt.getTime() - a.createdAt.getTime()
    })
  })

  // Generate unique ID
  const generateId = (): string => {
    return Date.now().toString(36) + Math.random().toString(36).substr(2)
  }

  // Add new todo
  const addTodo = (text: string, priority: Priority): void => {
    if (!text.trim()) return

    const newTodo: Todo = {
      id: generateId(),
      text: text.trim(),
      priority,
      createdAt: new Date()
    }

    const updatedTodos = [...todos.value, newTodo]
    saveTodos(updatedTodos)
  }

  // Remove todo
  const removeTodo = (id: string): void => {
    const updatedTodos = todos.value.filter(todo => todo.id !== id)
    saveTodos(updatedTodos)
    
    // Clear editing state if we're editing the removed todo
    if (editingId.value === id) {
      editingId.value = null
    }
  }

  // Clear all todos
  const clearAllTodos = (): void => {
    saveTodos([])
    editingId.value = null
  }

  // Start editing
  const startEditing = (id: string): void => {
    editingId.value = id
  }

  // Update todo
  const updateTodo = (id: string, text: string, priority: Priority): void => {
    if (!text.trim()) return

    const updatedTodos = todos.value.map(todo =>
      todo.id === id
        ? { ...todo, text: text.trim(), priority }
        : todo
    )
    saveTodos(updatedTodos)
    editingId.value = null
  }

  // Cancel editing
  const cancelEditing = (): void => {
    editingId.value = null
  }

  // Get todo by id
  const getTodoById = (id: string): Todo | undefined => {
    return todos.value.find(todo => todo.id === id)
  }

  return {
    todos: sortedTodos,
    editingId,
    addTodo,
    removeTodo,
    clearAllTodos,
    startEditing,
    updateTodo,
    cancelEditing,
    getTodoById
  }
}
