import { describe, it, expect, beforeEach, jest } from '@jest/globals'
import { mount } from '@vue/test-utils'
import TodoItem from '../TodoItem.vue'
import { Todo } from '@/types/todo'

// Mock window.confirm
const mockConfirm = jest.fn()
Object.defineProperty(window, 'confirm', {
  value: mockConfirm
})

describe('TodoItem', () => {
  let todo: Todo
  
  beforeEach(() => {
    todo = {
      id: '1',
      text: 'Test todo',
      priority: 'moderate',
      createdAt: new Date('2023-01-01T10:00:00Z')
    }
    mockConfirm.mockClear()
  })

  it('renders todo item correctly', () => {
    const wrapper = mount(TodoItem, {
      props: { todo, isEditing: false }
    })

    expect(wrapper.text()).toContain('Test todo')
    expect(wrapper.text()).toContain('moderate')
    expect(wrapper.find('[aria-label*="moderate priority"]').exists()).toBe(true)
  })

  it('displays formatted date', () => {
    const wrapper = mount(TodoItem, {
      props: { todo, isEditing: false }
    })

    const timeElement = wrapper.find('time')
    expect(timeElement.exists()).toBe(true)
    expect(timeElement.attributes('datetime')).toBe('2023-01-01T10:00:00.000Z')
  })

  it('shows edit and delete buttons when not editing', () => {
    const wrapper = mount(TodoItem, {
      props: { todo, isEditing: false }
    })

    const editButton = wrapper.find('[aria-label*="Edit todo"]')
    const deleteButton = wrapper.find('[aria-label*="Delete todo"]')

    expect(editButton.exists()).toBe(true)
    expect(deleteButton.exists()).toBe(true)
  })

  it('emits startEditing when edit button is clicked', async () => {
    const wrapper = mount(TodoItem, {
      props: { todo, isEditing: false }
    })

    const editButton = wrapper.find('[aria-label*="Edit todo"]')
    await editButton.trigger('click')

    expect(wrapper.emitted('startEditing')).toBeTruthy()
  })

  it('shows confirmation dialog and emits remove when delete is confirmed', async () => {
    mockConfirm.mockReturnValue(true)
    
    const wrapper = mount(TodoItem, {
      props: { todo, isEditing: false }
    })

    const deleteButton = wrapper.find('[aria-label*="Delete todo"]')
    await deleteButton.trigger('click')

    expect(mockConfirm).toHaveBeenCalledWith('Are you sure you want to delete "Test todo"?')
    expect(wrapper.emitted('remove')).toBeTruthy()
  })

  it('does not emit remove when delete is cancelled', async () => {
    mockConfirm.mockReturnValue(false)
    
    const wrapper = mount(TodoItem, {
      props: { todo, isEditing: false }
    })

    const deleteButton = wrapper.find('[aria-label*="Delete todo"]')
    await deleteButton.trigger('click')

    expect(mockConfirm).toHaveBeenCalled()
    expect(wrapper.emitted('remove')).toBeFalsy()
  })

  it('shows edit form when isEditing is true', async () => {
    const wrapper = mount(TodoItem, {
      props: { todo, isEditing: true }
    })

    await wrapper.vm.$nextTick()

    expect(wrapper.find('input[type="text"]').exists()).toBe(true)
    expect(wrapper.find('button[aria-label="Save changes"]').exists()).toBe(true)
    expect(wrapper.find('button[aria-label="Cancel editing"]').exists()).toBe(true)
  })

  it('initializes edit form with current todo values', async () => {
    const wrapper = mount(TodoItem, {
      props: { todo, isEditing: true }
    })

    await wrapper.vm.$nextTick()

    const textInput = wrapper.find('input[type="text"]')
    expect((textInput.element as HTMLInputElement).value).toBe('Test todo')
    expect(wrapper.vm.editPriority).toBe('moderate')
  })

  it('updates todo when save button is clicked', async () => {
    const wrapper = mount(TodoItem, {
      props: { todo, isEditing: true }
    })

    await wrapper.vm.$nextTick()

    const textInput = wrapper.find('input[type="text"]')
    await textInput.setValue('Updated todo')

    // Select critical priority
    const criticalButton = wrapper.findAll('[role="button"]')[0]
    await criticalButton.trigger('click')

    const saveButton = wrapper.find('button[aria-label="Save changes"]')
    await saveButton.trigger('click')

    expect(wrapper.emitted('update')).toBeTruthy()
    expect(wrapper.emitted('update')?.[0]?.[0]).toEqual({
      id: '1',
      text: 'Updated todo',
      priority: 'critical'
    })
  })

  it('shows error for empty text input', async () => {
    const wrapper = mount(TodoItem, {
      props: { todo, isEditing: true }
    })

    await wrapper.vm.$nextTick()

    const textInput = wrapper.find('input[type="text"]')
    await textInput.setValue('')

    // Since the save button is disabled when text is empty, trigger validation via Enter key
    await textInput.trigger('keydown.enter')

    await wrapper.vm.$nextTick()

    const errorElement = wrapper.find('[role="alert"]')
    expect(errorElement.exists()).toBe(true)
    expect(errorElement.text()).toBe('Please enter a task description')
    expect(wrapper.emitted('update')).toBeFalsy()
  })

  it('cancels editing when cancel button is clicked', async () => {
    const wrapper = mount(TodoItem, {
      props: { todo, isEditing: true }
    })

    await wrapper.vm.$nextTick()

    const cancelButton = wrapper.find('button[aria-label="Cancel editing"]')
    await cancelButton.trigger('click')

    expect(wrapper.emitted('cancelEditing')).toBeTruthy()
  })

  it('handles keyboard shortcuts in edit mode', async () => {
    const wrapper = mount(TodoItem, {
      props: { todo, isEditing: true }
    })

    await wrapper.vm.$nextTick()

    const textInput = wrapper.find('input[type="text"]')
    
    // Test Enter key to save
    await textInput.trigger('keydown.enter')
    expect(wrapper.emitted('update')).toBeTruthy()

    // Reset for next test
    wrapper.emitted().update = []

    // Test Escape key to cancel
    await textInput.trigger('keydown.escape')
    expect(wrapper.emitted('cancelEditing')).toBeTruthy()
  })

  it('disables save button when text is empty', async () => {
    const wrapper = mount(TodoItem, {
      props: { todo, isEditing: true }
    })

    await wrapper.vm.$nextTick()

    const textInput = wrapper.find('input[type="text"]')
    const saveButton = wrapper.find('button[aria-label="Save changes"]')

    await textInput.setValue('')
    expect(saveButton.attributes('disabled')).toBeDefined()

    await textInput.setValue('Some text')
    expect(saveButton.attributes('disabled')).toBeUndefined()
  })
})
