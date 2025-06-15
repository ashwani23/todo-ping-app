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

  it('starts with moderate priority selected by default', () => {
    const wrapper = mount(TodoForm)
    
    const moderateButton = wrapper.findAll('[role="button"]')[1]
    expect(moderateButton.attributes('aria-pressed')).toBe('true')
    expect(wrapper.vm.selectedPriority).toBe('moderate')
  })

  it('emits add-todo event with correct data', async () => {
    const wrapper = mount(TodoForm)
    
    const textInput = wrapper.find('input[type="text"]')
    
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

  it('shows error for whitespace-only input', async () => {
    const wrapper = mount(TodoForm)
    
    const textInput = wrapper.find('input[type="text"]')
    await textInput.setValue('   ')
    
    await wrapper.vm.handleSubmit()
    await wrapper.vm.$nextTick()
    
    const errorElement = wrapper.find('[role="alert"]')
    expect(errorElement.exists()).toBe(true)
    expect(errorElement.text()).toBe('Please enter a task description')
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

  it('disables submit button for whitespace-only input', async () => {
    const wrapper = mount(TodoForm)
    
    const textInput = wrapper.find('input[type="text"]')
    const submitButton = wrapper.find('button[type="submit"]')
    
    await textInput.setValue('   ')
    expect(submitButton.attributes('disabled')).toBeDefined()
  })

  it('resets form after successful submission', async () => {
    const wrapper = mount(TodoForm)
    
    const textInput = wrapper.find('input[type="text"]')
    await textInput.setValue('Test todo')
    
    // Change priority to critical
    const criticalButton = wrapper.findAll('[role="button"]')[0]
    await criticalButton.trigger('click')
    
    // Submit the form
    await wrapper.find('form').trigger('submit')
    
    // Wait for all async operations to complete
    await wrapper.vm.$nextTick()
    await wrapper.vm.$nextTick()
    
    // Check that form is reset to default values
    expect(wrapper.vm.todoText).toBe('')
    expect(wrapper.vm.selectedPriority).toBe('moderate')
    expect((textInput.element as HTMLInputElement).value).toBe('')
  })

  it('allows keyboard navigation for priority selection with Enter', async () => {
    const wrapper = mount(TodoForm)
    
    const criticalButton = wrapper.findAll('[role="button"]')[0]
    
    await criticalButton.trigger('keydown.enter')
    
    expect(criticalButton.attributes('aria-pressed')).toBe('true')
    expect(wrapper.vm.selectedPriority).toBe('critical')
  })

  it('allows keyboard navigation for priority selection with Space', async () => {
    const wrapper = mount(TodoForm)
    
    const optionalButton = wrapper.findAll('[role="button"]')[2]
    
    await optionalButton.trigger('keydown.space')
    
    expect(optionalButton.attributes('aria-pressed')).toBe('true')
    expect(wrapper.vm.selectedPriority).toBe('optional')
  })

  it('allows radio input keyboard navigation with Enter', async () => {
    const wrapper = mount(TodoForm)
    
    const radioInput = wrapper.findAll('input[type="radio"]')[0]
    await radioInput.trigger('keydown.enter')
    
    expect(wrapper.vm.selectedPriority).toBe('critical')
  })

  it('clears error when valid input is provided after error', async () => {
    const wrapper = mount(TodoForm)
    
    // First trigger an error
    await wrapper.vm.handleSubmit()
    await wrapper.vm.$nextTick()
    
    expect(wrapper.find('[role="alert"]').exists()).toBe(true)
    
    // Now provide valid input and submit
    const textInput = wrapper.find('input[type="text"]')
    await textInput.setValue('Valid todo')
    await wrapper.find('form').trigger('submit')
    await wrapper.vm.$nextTick()
    
    // Error should be cleared
    expect(wrapper.find('[role="alert"]').exists()).toBe(false)
    expect(wrapper.vm.error).toBe('')
  })

  it('focuses text input on mount', async () => {
    const wrapper = mount(TodoForm, {
      attachTo: document.body
    })
    
    await wrapper.vm.$nextTick()
    
    const textInput = wrapper.find('input[type="text"]')
    expect(document.activeElement).toBe(textInput.element)
    
    wrapper.unmount()
  })

  it('refocuses text input after successful submission', async () => {
    const wrapper = mount(TodoForm, {
      attachTo: document.body
    })
    
    const textInput = wrapper.find('input[type="text"]')
    await textInput.setValue('Test todo')
    
    // Submit the form
    await wrapper.find('form').trigger('submit')
    await wrapper.vm.$nextTick()
    await wrapper.vm.$nextTick()
    
    // Input should be focused again
    expect(document.activeElement).toBe(textInput.element)
    
    wrapper.unmount()
  })

  it('has proper accessibility attributes', () => {
    const wrapper = mount(TodoForm)
    
    const textInput = wrapper.find('input[type="text"]')
    const fieldset = wrapper.find('fieldset')
    const legend = wrapper.find('legend')
    
    expect(textInput.attributes('aria-required')).toBe('true')
    expect(textInput.attributes('aria-describedby')).toBe('todo-text-error')
    expect(fieldset.exists()).toBe(true)
    expect(legend.text()).toBe('Priority Level')
  })

  it('has unique form ID for radio inputs', () => {
    const wrapper1 = mount(TodoForm)
    const wrapper2 = mount(TodoForm)
    
    const radio1 = wrapper1.find('input[type="radio"]')
    const radio2 = wrapper2.find('input[type="radio"]')
    
    // Radio names should be different to avoid conflicts
    expect(radio1.attributes('name')).not.toBe(radio2.attributes('name'))
  })

  it('updates aria-label dynamically based on selected priority', async () => {
    const wrapper = mount(TodoForm)
    
    const submitButton = wrapper.find('button[type="submit"]')
    
    // Should start with moderate priority
    expect(submitButton.attributes('aria-label')).toBe('Add new moderate priority todo')
    
    // Change to critical
    const criticalButton = wrapper.findAll('[role="button"]')[0]
    await criticalButton.trigger('click')
    
    expect(submitButton.attributes('aria-label')).toBe('Add new critical priority todo')
  })

  it('selects priority using selectPriority method directly', () => {
    const wrapper = mount(TodoForm)
    
    wrapper.vm.selectPriority('optional')
    expect(wrapper.vm.selectedPriority).toBe('optional')
    
    wrapper.vm.selectPriority('critical')
    expect(wrapper.vm.selectedPriority).toBe('critical')
  })
})
