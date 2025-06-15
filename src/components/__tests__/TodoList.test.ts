import { describe, it, expect, beforeEach, jest } from '@jest/globals'
import { mount } from '@vue/test-utils'
import TodoList from '../TodoList.vue'
import TodoItem from '../TodoItem.vue'
import { Todo } from '@/types/todo'

// Mock window.confirm
const mockConfirm = jest.fn()
Object.defineProperty(window, 'confirm', {
  value: mockConfirm
})

describe('TodoList', () => {
  let todos: Todo[]

  beforeEach(() => {
    todos = [
      {
        id: '1',
        text: 'Test todo 1',
        priority: 'critical',
        createdAt: new Date('2023-01-01T10:00:00Z')
      },
      {
        id: '2', 
        text: 'Test todo 2',
        priority: 'moderate',
        createdAt: new Date('2023-01-01T11:00:00Z')
      },
      {
        id: '3',
        text: 'Test todo 3',
        priority: 'optional',
        createdAt: new Date('2023-01-01T12:00:00Z')
      }
    ]
    mockConfirm.mockClear()
  })

  it('renders todo count correctly', () => {
    const wrapper = mount(TodoList, {
      props: { todos, editingId: null }
    })

    expect(wrapper.text()).toContain('Your Todos (3)')
  })

  it('shows clear all button when there are todos', () => {
    const wrapper = mount(TodoList, {
      props: { todos, editingId: null }
    })

    const clearButton = wrapper.find('button[aria-label*="Clear all"]')
    expect(clearButton.exists()).toBe(true)
    expect(clearButton.text()).toBe('Clear All')
    expect(clearButton.attributes('aria-label')).toBe('Clear all 3 todos')
  })

  it('does not show clear all button when there are no todos', () => {
    const wrapper = mount(TodoList, {
      props: { todos: [], editingId: null }
    })

    const clearButton = wrapper.find('button[aria-label*="Clear all"]')
    expect(clearButton.exists()).toBe(false)
  })

  it('shows empty state when no todos', () => {
    const wrapper = mount(TodoList, {
      props: { todos: [], editingId: null }
    })

    expect(wrapper.text()).toContain('No todos yet. Add one above to get started!')
    expect(wrapper.text()).toContain('📝')
  })

  it('renders TodoItem components for each todo', () => {
    const wrapper = mount(TodoList, {
      props: { todos, editingId: null }
    })

    const todoItems = wrapper.findAllComponents(TodoItem)
    expect(todoItems).toHaveLength(3)
    
    // Check that each todo is passed correctly
    expect(todoItems[0].props('todo')).toEqual(todos[0])
    expect(todoItems[1].props('todo')).toEqual(todos[1])
    expect(todoItems[2].props('todo')).toEqual(todos[2])
  })

  it('passes editing state correctly to TodoItem', () => {
    const wrapper = mount(TodoList, {
      props: { todos, editingId: '2' }
    })

    const todoItems = wrapper.findAllComponents(TodoItem)
    expect(todoItems[0].props('isEditing')).toBe(false)
    expect(todoItems[1].props('isEditing')).toBe(true) // todo with id '2'
    expect(todoItems[2].props('isEditing')).toBe(false)
  })

  it('emits removeTodo when TodoItem emits remove', async () => {
    const wrapper = mount(TodoList, {
      props: { todos, editingId: null }
    })

    const firstTodoItem = wrapper.findAllComponents(TodoItem)[0]
    await firstTodoItem.vm.$emit('remove')

    expect(wrapper.emitted('removeTodo')).toBeTruthy()
    expect(wrapper.emitted('removeTodo')?.[0]).toEqual(['1'])
  })

  it('emits startEditing when TodoItem emits startEditing', async () => {
    const wrapper = mount(TodoList, {
      props: { todos, editingId: null }
    })

    const firstTodoItem = wrapper.findAllComponents(TodoItem)[0]
    await firstTodoItem.vm.$emit('startEditing')

    expect(wrapper.emitted('startEditing')).toBeTruthy()
    expect(wrapper.emitted('startEditing')?.[0]).toEqual(['1'])
  })

  it('emits updateTodo when TodoItem emits update', async () => {
    const wrapper = mount(TodoList, {
      props: { todos, editingId: '1' }
    })

    const firstTodoItem = wrapper.findAllComponents(TodoItem)[0]
    const updateData = { id: '1', text: 'Updated text', priority: 'critical' as const }
    await firstTodoItem.vm.$emit('update', updateData)

    expect(wrapper.emitted('updateTodo')).toBeTruthy()
    expect(wrapper.emitted('updateTodo')?.[0]).toEqual(['1', 'Updated text', 'critical'])
  })

  it('emits cancelEditing when TodoItem emits cancelEditing', async () => {
    const wrapper = mount(TodoList, {
      props: { todos, editingId: '1' }
    })

    const firstTodoItem = wrapper.findAllComponents(TodoItem)[0]
    await firstTodoItem.vm.$emit('cancelEditing')

    expect(wrapper.emitted('cancelEditing')).toBeTruthy()
  })

  it('shows confirmation and emits clearAll when clear all button is clicked and confirmed', async () => {
    mockConfirm.mockReturnValue(true)
    
    const wrapper = mount(TodoList, {
      props: { todos, editingId: null }
    })

    const clearButton = wrapper.find('button[aria-label*="Clear all"]')
    await clearButton.trigger('click')

    expect(mockConfirm).toHaveBeenCalledWith('Are you sure you want to clear all todos? This action cannot be undone.')
    expect(wrapper.emitted('clearAll')).toBeTruthy()
  })

  it('does not emit clearAll when clear all is cancelled', async () => {
    mockConfirm.mockReturnValue(false)
    
    const wrapper = mount(TodoList, {
      props: { todos, editingId: null }
    })

    const clearButton = wrapper.find('button[aria-label*="Clear all"]')
    await clearButton.trigger('click')

    expect(mockConfirm).toHaveBeenCalled()
    expect(wrapper.emitted('clearAll')).toBeFalsy()
  })

  it('has proper ARIA attributes', () => {
    const wrapper = mount(TodoList, {
      props: { todos, editingId: null }
    })

    const todoContainer = wrapper.find('[role="list"]')
    expect(todoContainer.exists()).toBe(true)
    expect(todoContainer.attributes('aria-label')).toBe('Todo items')
  })

  it('updates todo count in header when todos change', async () => {
    const wrapper = mount(TodoList, {
      props: { todos: [todos[0]], editingId: null }
    })

    expect(wrapper.text()).toContain('Your Todos (1)')

    await wrapper.setProps({ todos })
    expect(wrapper.text()).toContain('Your Todos (3)')
  })
})
