import { describe, it, expect, jest, beforeEach } from '@jest/globals'
import { useTodos } from '../useTodos'
import { useLocalStorage } from '../useLocalStorage'

// Mock the useLocalStorage composable
jest.mock('../useLocalStorage')

const mockUseLocalStorage = useLocalStorage as jest.MockedFunction<typeof useLocalStorage>

describe('useTodos', () => {
  const mockTodos = [
    {
      id: '1',
      text: 'Test todo 1',
      priority: 'critical' as const,
      createdAt: new Date('2024-01-01')
    },
    {
      id: '2', 
      text: 'Test todo 2',
      priority: 'moderate' as const,
      createdAt: new Date('2024-01-02')
    }
  ]

  const mockSaveTodos = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
    
    mockUseLocalStorage.mockReturnValue({
      todos: { value: [...mockTodos] },
      saveTodos: mockSaveTodos
    })
  })

  it('should sort todos by priority', () => {
    const { todos } = useTodos()
    
    // Critical should come before moderate
    expect(todos.value[0].priority).toBe('critical')
    expect(todos.value[1].priority).toBe('moderate')
  })

  it('should add a new todo', () => {
    const { addTodo } = useTodos()
    
    addTodo('New todo', 'optional')
    
    expect(mockSaveTodos).toHaveBeenCalledWith(
      expect.arrayContaining([
        ...mockTodos,
        expect.objectContaining({
          text: 'New todo',
          priority: 'optional',
          id: expect.any(String),
          createdAt: expect.any(Date)
        })
      ])
    )
  })

  it('should not add empty todo', () => {
    const { addTodo } = useTodos()
    
    addTodo('', 'moderate')
    addTodo('   ', 'moderate')
    
    expect(mockSaveTodos).not.toHaveBeenCalled()
  })

  it('should remove todo by id', () => {
    const { removeTodo } = useTodos()
    
    removeTodo('1')
    
    expect(mockSaveTodos).toHaveBeenCalledWith([mockTodos[1]])
  })

  it('should clear all todos', () => {
    const { clearAllTodos } = useTodos()
    
    clearAllTodos()
    
    expect(mockSaveTodos).toHaveBeenCalledWith([])
  })

  it('should start editing a todo', () => {
    const { startEditing, editingId } = useTodos()
    
    startEditing('1')
    
    expect(editingId.value).toBe('1')
  })

  it('should update todo', () => {
    const { updateTodo } = useTodos()
    
    updateTodo('1', 'Updated todo', 'optional')
    
    expect(mockSaveTodos).toHaveBeenCalledWith([
      {
        ...mockTodos[0],
        text: 'Updated todo',
        priority: 'optional'
      },
      mockTodos[1]
    ])
  })

  it('should cancel editing', () => {
    const { startEditing, cancelEditing, editingId } = useTodos()
    
    startEditing('1')
    expect(editingId.value).toBe('1')
    
    cancelEditing()
    expect(editingId.value).toBe(null)
  })

  it('should get todo by id', () => {
    const { getTodoById } = useTodos()
    
    const todo = getTodoById('1')
    
    expect(todo).toEqual(mockTodos[0])
  })

  it('should return undefined for non-existent todo', () => {
    const { getTodoById } = useTodos()
    
    const todo = getTodoById('999')
    
    expect(todo).toBeUndefined()
  })
})
