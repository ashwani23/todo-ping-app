import { describe, it, expect, beforeEach, jest } from '@jest/globals'
import { useLocalStorage } from '../useLocalStorage'
import { Todo } from '@/types/todo'

// Mock localStorage
const mockLocalStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn()
}

Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage
})

// Mock console.error to avoid noise in tests
const mockConsoleError = jest.fn()
global.console.error = mockConsoleError

describe('useLocalStorage', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockConsoleError.mockClear()
  })

  it('initializes with empty array when no stored data', () => {
    mockLocalStorage.getItem.mockReturnValue(null)
    
    const { todos } = useLocalStorage()
    
    expect(todos.value).toEqual([])
    expect(mockLocalStorage.getItem).toHaveBeenCalledWith('ping-todos')
  })

  it('loads existing todos from localStorage', () => {
    const storedTodos = [
      {
        id: '1',
        text: 'Test todo',
        priority: 'moderate',
        createdAt: '2023-01-01T10:00:00.000Z'
      }
    ]
    
    mockLocalStorage.getItem.mockReturnValue(JSON.stringify(storedTodos))
    
    const { todos } = useLocalStorage()
    
    expect(todos.value).toHaveLength(1)
    expect(todos.value[0].text).toBe('Test todo')
    expect(todos.value[0].createdAt).toBeInstanceOf(Date)
  })

  it('handles invalid JSON in localStorage gracefully', () => {
    mockLocalStorage.getItem.mockReturnValue('invalid json')
    
    const { todos } = useLocalStorage()
    
    expect(todos.value).toEqual([])
    expect(mockConsoleError).toHaveBeenCalledWith(
      'Failed to load todos from localStorage:',
      expect.any(Error)
    )
  })

  it('saves todos using saveTodos function', () => {
    const { todos, saveTodos } = useLocalStorage()
    
    const newTodos: Todo[] = [
      {
        id: '1',
        text: 'New todo',
        priority: 'critical',
        createdAt: new Date()
      }
    ]
    
    saveTodos(newTodos)
    
    expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
      'ping-todos',
      JSON.stringify(newTodos)
    )
    expect(todos.value).toEqual(newTodos)
  })

  it('handles localStorage save errors gracefully', () => {
    mockLocalStorage.setItem.mockImplementation(() => {
      throw new Error('Storage quota exceeded')
    })
    
    const { saveTodos } = useLocalStorage()
    
    const newTodos: Todo[] = []
    saveTodos(newTodos)
    
    expect(mockConsoleError).toHaveBeenCalledWith(
      'Failed to save todos to localStorage:',
      expect.any(Error)
    )
  })

  it('uses custom storage key when provided', () => {
    const customKey = 'custom-todos'
    mockLocalStorage.getItem.mockReturnValue(null)
    
    useLocalStorage(customKey)
    
    expect(mockLocalStorage.getItem).toHaveBeenCalledWith(customKey)
  })

  it('auto-saves when todos array changes', async () => {
    mockLocalStorage.getItem.mockReturnValue('[]')
    
    const { todos } = useLocalStorage()
    
    // Clear initial calls
    mockLocalStorage.setItem.mockClear()
    
    // Modify todos array
    const newTodo: Todo = {
      id: '1',
      text: 'Auto-save test',
      priority: 'moderate',
      createdAt: new Date()
    }
    
    todos.value.push(newTodo)
    
    // Wait for Vue's reactivity to trigger the watcher
    await new Promise(resolve => setTimeout(resolve, 0))
    
    expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
      'ping-todos',
      JSON.stringify([newTodo])
    )
  })

  it('handles auto-save errors gracefully', async () => {
    mockLocalStorage.getItem.mockReturnValue('[]')
    mockLocalStorage.setItem.mockImplementation(() => {
      throw new Error('Storage error')
    })
    
    const { todos } = useLocalStorage()
    
    todos.value.push({
      id: '1',
      text: 'Test',
      priority: 'moderate',
      createdAt: new Date()
    })
    
    // Wait for watcher
    await new Promise(resolve => setTimeout(resolve, 0))
    
    expect(mockConsoleError).toHaveBeenCalledWith(
      'Failed to auto-save todos:',
      expect.any(Error)
    )
  })
})
