import { mount } from '@vue/test-utils'
import TodoForm from './src/components/TodoForm.vue'

// Debug test to see what's actually happening
const wrapper = mount(TodoForm)

console.log('=== DEBUGGING TODOFORM ===')

// Test 1: Check event emission
console.log('\n1. Testing event emission:')
const textInput = wrapper.find('input[type="text"]')
const submitButton = wrapper.find('button[type="submit"]')

await textInput.setValue('Test todo item')
console.log('Text input value after setValue:', (textInput.element as HTMLInputElement).value)

// Check priority selection
const criticalButton = wrapper.findAll('[role="button"]')[0]
console.log('Critical button text:', criticalButton.text())
await criticalButton.trigger('click')

console.log('Selected priority after click:', wrapper.vm.selectedPriority)

await submitButton.trigger('click')
console.log('All emitted events:', Object.keys(wrapper.emitted()))
console.log('Emitted events details:', wrapper.emitted())

// Test 2: Check error display
console.log('\n2. Testing error display:')
const wrapper2 = mount(TodoForm)
const submitButton2 = wrapper2.find('button[type="submit"]')
await submitButton2.trigger('click')
await wrapper2.vm.$nextTick()

console.log('Error ref value:', wrapper2.vm.error)
console.log('Error element exists:', wrapper2.find('[role="alert"]').exists())
console.log('All elements with role:', wrapper2.findAll('[role]').map(el => ({ role: el.attributes('role'), text: el.text() })))

// Test 3: Check form reset
console.log('\n3. Testing form reset:')
const wrapper3 = mount(TodoForm)
const textInput3 = wrapper3.find('input[type="text"]')
await textInput3.setValue('Test todo')
console.log('Before submit - input value:', (textInput3.element as HTMLInputElement).value)

const submitButton3 = wrapper3.find('button[type="submit"]')
await submitButton3.trigger('click')
console.log('After submit - todoText ref:', wrapper3.vm.todoText)
console.log('After submit - input value:', (textInput3.element as HTMLInputElement).value)

await wrapper3.vm.$nextTick()
console.log('After nextTick - todoText ref:', wrapper3.vm.todoText)
console.log('After nextTick - input value:', (textInput3.element as HTMLInputElement).value)
