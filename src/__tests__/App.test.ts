import { describe, it, expect, beforeEach } from '@jest/globals'
import { mount } from '@vue/test-utils'
import App from '../App.vue'
import TodoForm from '../components/TodoForm.vue'
import TodoList from '../components/TodoList.vue'

// Mock the useTodos composable
const mockTodos = [
  {
    id: '1',
    text: 'Test todo',
    priority: 'moderate' as const,
    createdAt: new Date('2023-01-01T10:00:00Z')  // Fixed: using Date object
  }
]

const mockUseTodos = {
  todos: { values: mockTodos },
  editingId: { values: null },
  addTodo: jest.fn(),
  removeTodo: jest.fn(),
  clearAllTodos: jest.fn(),
  startEditing: jest.fn(),
  updateTodo: jest.fn(),
  cancelEditing: jest.fn()
}

// Mock the composable module
jest.mock('../composables/useTodos', () => ({
  useTodos: () => mockUseTodos
}))

describe('App', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders main header correctly', () => {
    const wrapper = mount(App)

    const header = wrapper.find('header')
    expect(header.exists()).toBe(true)
    expect(header.text()).toContain('Todo List')
    expect(header.text()).toContain('Organize your tasks by priority: Critical, Moderate, and Optional')
  })

  it('renders TodoForm component', () => {
    const wrapper = mount(App)

    const todoForm = wrapper.findComponent(TodoForm)
    expect(todoForm.exists()).toBe(true)
  })

  it('renders TodoList component with correct props', () => {
    const wrapper = mount(App)

    const todoList = wrapper.findComponent(TodoList)
    expect(todoList.exists()).toBe(true);
  })

  it('calls addTodo when TodoForm emits add-todo', async () => {
    const wrapper = mount(App)

    const todoForm = wrapper.findComponent(TodoForm)
    const todoData = { text: 'New todo', priority: 'critical' as const }
    
    await todoForm.vm.$emit('add-todo', todoData)

    expect(mockUseTodos.addTodo).toHaveBeenCalledWith('New todo', 'critical')
  })

  it('calls removeTodo when TodoList emits remove-todo', async () => {
    const wrapper = mount(App)

    const todoList = wrapper.findComponent(TodoList)
    await todoList.vm.$emit('remove-todo', 'todo-id')

    expect(mockUseTodos.removeTodo).toHaveBeenCalledWith('todo-id')
  })

  it('calls startEditing when TodoList emits start-editing', async () => {
    const wrapper = mount(App)

    const todoList = wrapper.findComponent(TodoList)
    await todoList.vm.$emit('start-editing', 'todo-id')

    expect(mockUseTodos.startEditing).toHaveBeenCalledWith('todo-id')
  })

  it('calls updateTodo when TodoList emits update-todo', async () => {
    const wrapper = mount(App)

    const todoList = wrapper.findComponent(TodoList)
    await todoList.vm.$emit('update-todo', 'todo-id', 'Updated text', 'critical')

    expect(mockUseTodos.updateTodo).toHaveBeenCalledWith('todo-id', 'Updated text', 'critical')
  })

  it('calls cancelEditing when TodoList emits cancel-editing', async () => {
    const wrapper = mount(App)

    const todoList = wrapper.findComponent(TodoList)
    await todoList.vm.$emit('cancel-editing')

    expect(mockUseTodos.cancelEditing).toHaveBeenCalled()
  })

  it('calls clearAllTodos when TodoList emits clear-all', async () => {
    const wrapper = mount(App)

    const todoList = wrapper.findComponent(TodoList)
    await todoList.vm.$emit('clear-all')

    expect(mockUseTodos.clearAllTodos).toHaveBeenCalled()
  })

  it('has proper semantic structure', () => {
    const wrapper = mount(App)

    expect(wrapper.find('header').exists()).toBe(true)
    expect(wrapper.find('main').exists()).toBe(true)
    expect(wrapper.find('h1').text()).toBe('Todo List')
  })

  it('has responsive layout classes', () => {
    const wrapper = mount(App)

    const container = wrapper.find('.max-w-4xl')
    expect(container.exists()).toBe(true)
    expect(container.classes()).toContain('mx-auto')
    expect(container.classes()).toContain('px-4')
  })
})
