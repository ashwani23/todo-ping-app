import { ref, Ref, watch } from 'vue'
import { Todo } from '@/types/todo'

const STORAGE_KEY = 'ping-todos'

export function useLocalStorage(key: string = STORAGE_KEY): {
  todos: Ref<Todo[]>
  saveTodos: (todos: Todo[]) => void
} {
  const todos = ref<Todo[]>([])

  // Load todos from localStorage on initialization
  const loadTodos = (): void => {
    try {
      const stored = localStorage.getItem(key)
      if (stored) {
        const parsedTodos = JSON.parse(stored)
        // Convert date strings back to Date objects
        todos.value = parsedTodos.map((todo: any) => ({
          ...todo,
          createdAt: new Date(todo.createdAt)
        }))
      }
    } catch (error) {
      console.error('Failed to load todos from localStorage:', error)
      todos.value = []
    }
  }

  // Save todos to localStorage
  const saveTodos = (newTodos: Todo[]): void => {
    try {
      localStorage.setItem(key, JSON.stringify(newTodos))
      todos.value = newTodos
    } catch (error) {
      console.error('Failed to save todos to localStorage:', error)
    }
  }

  // Watch for changes and auto-save
  watch(todos, (newTodos) => {
    try {
      localStorage.setItem(key, JSON.stringify(newTodos))
    } catch (error) {
      console.error('Failed to auto-save todos:', error)
    }
  }, { deep: true })

  // Initialize
  loadTodos()

  return {
    todos,
    saveTodos
  }
}
