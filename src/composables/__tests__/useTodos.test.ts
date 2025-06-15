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
    },
    {
      id: '3',
      text: 'Test todo 3', 
      priority: 'optional' as const,
      createdAt: new Date('2024-01-03')
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

  it('should sort todos by priority correctly', () => {
    const { todos } = useTodos()
    
    // Critical should come first, then moderate, then optional
    expect(todos.value[0].priority).toBe('critical')
    expect(todos.value[1].priority).toBe('moderate')
    expect(todos.value[2].priority).toBe('optional')
  })

  it('should sort todos with same priority by creation date (newest first)', () => {
    const todosWithSamePriority = [
      {
        id: '1',
        text: 'Older critical',
        priority: 'critical' as const,
        createdAt: new Date('2024-01-01')
      },
      {
        id: '2',
        text: 'Newer critical',
        priority: 'critical' as const,
        createdAt: new Date('2024-01-02')
      }
    ]
    
    mockUseLocalStorage.mockReturnValue({
      todos: { value: [...todosWithSamePriority] },
      saveTodos: mockSaveTodos
    })
    
    const { todos } = useTodos()
    
    // Newer critical should come first
    expect(todos.value[0].text).toBe('Newer critical')
    expect(todos.value[1].text).toBe('Older critical')
  })

  it('should add a new todo with generated ID and current date', () => {
    const { addTodo } = useTodos()
    
    const beforeAdd = Date.now()
    addTodo('New todo', 'optional')
    const afterAdd = Date.now()
    
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
    
    // Check that ID is non-empty string
    const calledWith = mockSaveTodos.mock.calls[0][0]
    const newTodo = calledWith[calledWith.length - 1]
    expect(newTodo.id.length).toBeGreaterThan(0)
    
    // Check that createdAt is recent
    const createdTime = newTodo.createdAt.getTime()
    expect(createdTime).toBeGreaterThanOrEqual(beforeAdd)
    expect(createdTime).toBeLessThanOrEqual(afterAdd)
  })

  it('should not add empty todo', () => {
    const { addTodo } = useTodos()
    
    addTodo('', 'moderate')
    addTodo('   ', 'moderate')
    addTodo('\t\n', 'moderate')
    
    expect(mockSaveTodos).not.toHaveBeenCalled()
  })

  it('should remove todo by id', () => {
    const { removeTodo } = useTodos()
    
    removeTodo('1')
    
    expect(mockSaveTodos).toHaveBeenCalledWith([
      mockTodos[1],
      mockTodos[2]
    ])
  })

  it('should handle removing non-existent todo gracefully', () => {
    const { removeTodo } = useTodos()
    
    removeTodo('non-existent-id')
    
    // Should still call saveTodos with unchanged array
    expect(mockSaveTodos).toHaveBeenCalledWith(mockTodos)
  })

  it('should clear all todos', () => {
    const { clearAllTodos } = useTodos()
    
    clearAllTodos()
    
    expect(mockSaveTodos).toHaveBeenCalledWith([])
  })

  it('should start editing a todo', () => {
    const { startEditing, editingId } = useTodos()
    
    expect(editingId.value).toBe(null)
    
    startEditing('1')
    
    expect(editingId.value).toBe('1')
  })

  it('should switch editing between todos', () => {
    const { startEditing, editingId } = useTodos()
    
    startEditing('1')
    expect(editingId.value).toBe('1')
    
    startEditing('2')
    expect(editingId.value).toBe('2')
  })

  it('should update todo and stop editing', () => {
    const { updateTodo, startEditing, editingId } = useTodos()
    
    startEditing('1')
    expect(editingId.value).toBe('1')
    
    updateTodo('1', 'Updated todo', 'optional')
    
    expect(mockSaveTodos).toHaveBeenCalledWith([
      {
        ...mockTodos[0],
        text: 'Updated todo',
        priority: 'optional'
      },
      mockTodos[1],
      mockTodos[2]
    ])
    
    // Should stop editing after update
    expect(editingId.value).toBe(null)
  })

  it('should handle updating non-existent todo', () => {
    const { updateTodo } = useTodos()
    
    updateTodo('non-existent-id', 'Updated text', 'critical')
    
    // Should still call saveTodos with unchanged array
    expect(mockSaveTodos).toHaveBeenCalledWith(mockTodos)
  })

  it('should not update todo with empty text', () => {
    const { updateTodo } = useTodos()
    
    updateTodo('1', '', 'critical')
    updateTodo('1', '   ', 'critical')
    
    expect(mockSaveTodos).not.toHaveBeenCalled()
  })

  it('should cancel editing', () => {
    const { startEditing, cancelEditing, editingId } = useTodos()
    
    startEditing('1')
    expect(editingId.value).toBe('1')
    
    cancelEditing()
    expect(editingId.value).toBe(null)
  })

  it('should handle cancel editing when not editing', () => {
    const { cancelEditing, editingId } = useTodos()
    
    expect(editingId.value).toBe(null)
    
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

  it('should handle empty todos array', () => {
    mockUseLocalStorage.mockReturnValue({
      todos: { value: [] },
      saveTodos: mockSaveTodos
    })
    
    const { todos, getTodoById } = useTodos()
    
    expect(todos.value).toEqual([])
    expect(getTodoById('any-id')).toBeUndefined()
  })

  it('should maintain reactive todos list', () => {
    const todosList = { value: [...mockTodos] }
    
    mockUseLocalStorage.mockReturnValue({
      todos: todosList,
      saveTodos: mockSaveTodos
    })
    
    const { todos } = useTodos()
    
    // todos should be a computed ref, not the same reference as the storage
    // but should have the same data
    expect(todos.value).toEqual(todosList.value)
    expect(Array.isArray(todos.value)).toBe(true)
  })

  it('should generate unique IDs for multiple todos', () => {
    const { addTodo } = useTodos()
    
    addTodo('Todo 1', 'critical')
    addTodo('Todo 2', 'moderate')
    
    expect(mockSaveTodos).toHaveBeenCalledTimes(2)
    
    const firstCall = mockSaveTodos.mock.calls[0][0]
    const secondCall = mockSaveTodos.mock.calls[1][0]
    
    const firstNewTodo = firstCall[firstCall.length - 1]
    const secondNewTodo = secondCall[secondCall.length - 1]
    
    expect(firstNewTodo.id).not.toBe(secondNewTodo.id)
  })
})
