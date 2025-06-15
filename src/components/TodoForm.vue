<template>
  <div class="bg-white rounded-lg shadow-md p-6 mb-6">
    <h2 class="text-xl font-semibold text-gray-800 mb-4">Add New Todo</h2>
    
    <form @submit.prevent="handleSubmit" class="space-y-4">
      <div>
        <label for="todo-text" class="block text-sm font-medium text-gray-700 mb-1">
          Task Description
        </label>
        <input
          id="todo-text"
          ref="textInput"
          v-model="todoText"
          type="text"
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus-outline"
          placeholder="Enter your task..."
          aria-required="true"
          aria-describedby="todo-text-error"
        />
        <div
          v-if="error"
          id="todo-text-error"
          class="text-red-600 text-sm mt-1"
          role="alert"
          aria-live="polite"
        >
          {{ error }}
        </div>
      </div>

      <PrioritySelector
        v-model="selectedPriority"
        :name="formId"
      />

      <button
        type="submit"
        class="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus-outline disabled:opacity-50 disabled:cursor-not-allowed"
        :disabled="!todoText.trim()"
        :aria-label="getAddTodoAriaLabel(selectedPriority)"
      >
        Add Todo
      </button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick, onMounted } from 'vue'
import { Priority } from '@/types/todo'
import { useFormValidation } from '@/composables/useFormValidation'
import { generateFormId } from '@/utils/helpers'
import { getAddTodoAriaLabel } from '@/utils/accessibility'
import PrioritySelector from './PrioritySelector.vue'

const emit = defineEmits<{
  addTodo: [{ text: string; priority: Priority }]
}>()

const todoText = ref('')
const selectedPriority = ref<Priority>('moderate')
const textInput = ref<HTMLInputElement>()
const formId = ref(generateFormId())

const { error, validateText, clearError } = useFormValidation()

const handleSubmit = async () => {
  clearError()
  
  if (!validateText(todoText.value, 'task description')) {
    return
  }

  emit('addTodo', {
    text: todoText.value,
    priority: selectedPriority.value
  })

  // Reset form
  todoText.value = ''
  selectedPriority.value = 'moderate'
  
  // Focus back to input for better UX
  await nextTick()
  textInput.value?.focus()
}

onMounted(() => {
  textInput.value?.focus()
})
</script>
