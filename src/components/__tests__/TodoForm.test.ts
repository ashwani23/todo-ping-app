import { describe, it, expect } from '@jest/globals'
import { mount } from '@vue/test-utils'
import TodoForm from '../TodoForm.vue'

describe('TodoForm', () => {
  it('renders correctly', () => {
    const wrapper = mount(TodoForm)
    
    expect(wrapper.find('h2').text()).toBe('Add New Todo')
    expect(wrapper.find('input[type="text"]').exists()).toBe(true)
    expect(wrapper.find('button[type="submit"]').exists()).toBe(true)
  })

  it('has all priority options', () => {
    const wrapper = mount(TodoForm)
    
    const priorityButtons = wrapper.findAll('[role="button"]')
    expect(priorityButtons).toHaveLength(3)
    
    const priorities = ['Critical', 'Moderate', 'Optional']
    priorities.forEach((priority, index) => {
      expect(priorityButtons[index].text()).toContain(priority)
    })
  })

  it('emits add-todo event with correct data', async () => {
    const wrapper = mount(TodoForm)
    
    const textInput = wrapper.find('input[type="text"]')
    const submitButton = wrapper.find('button[type="submit"]')
    
    await textInput.setValue('Test todo item')
    
    // Select critical priority
    const criticalButton = wrapper.findAll('[role="button"]')[0]
    await criticalButton.trigger('click')
    
    // Trigger form submission
    await wrapper.find('form').trigger('submit')
    
    // Check for both possible event names (Vue can emit as addTodo or add-todo)
    const addTodoEvents = wrapper.emitted('addTodo') || wrapper.emitted('add-todo')
    expect(addTodoEvents).toBeTruthy()
    expect(addTodoEvents?.[0]?.[0]).toEqual({
      text: 'Test todo item',
      priority: 'critical'
    })
  })

  it('shows error for empty input', async () => {
    const wrapper = mount(TodoForm)
    
    // Directly call the submit handler since button is disabled for empty input
    await wrapper.vm.handleSubmit()
    
    // Wait for the error to appear
    await wrapper.vm.$nextTick()
    
    const errorElement = wrapper.find('[role="alert"]')
    expect(errorElement.exists()).toBe(true)
    expect(errorElement.text()).toBe('Please enter a task description')
    
    // Check that no event was emitted
    const addTodoEvents = wrapper.emitted('addTodo') || wrapper.emitted('add-todo')
    expect(addTodoEvents).toBeFalsy()
  })

  it('disables submit button when input is empty', async () => {
    const wrapper = mount(TodoForm)
    
    const textInput = wrapper.find('input[type="text"]')
    const submitButton = wrapper.find('button[type="submit"]')
    
    expect(submitButton.attributes('disabled')).toBeDefined()
    
    await textInput.setValue('Some text')
    expect(submitButton.attributes('disabled')).toBeUndefined()
    
    await textInput.setValue('')
    expect(submitButton.attributes('disabled')).toBeDefined()
  })

  it('resets form after successful submission', async () => {
    const wrapper = mount(TodoForm)
    
    const textInput = wrapper.find('input[type="text"]')
    await textInput.setValue('Test todo')
    
    // Submit the form
    await wrapper.find('form').trigger('submit')
    
    // Wait for all async operations to complete
    await wrapper.vm.$nextTick()
    await wrapper.vm.$nextTick()
    
    // Check that both the Vue ref and the DOM element are reset
    expect(wrapper.vm.todoText).toBe('')
    expect((textInput.element as HTMLInputElement).value).toBe('')
  })

  it('allows keyboard navigation for priority selection', async () => {
    const wrapper = mount(TodoForm)
    
    const moderateButton = wrapper.findAll('[role="button"]')[1]
    
    await moderateButton.trigger('keydown.enter')
    
    expect(moderateButton.attributes('aria-pressed')).toBe('true')
  })
})
