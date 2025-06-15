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

      <div>
        <fieldset>
          <legend class="block text-sm font-medium text-gray-700 mb-2">
            Priority Level
          </legend>
          <div class="flex gap-4">
            <label
              v-for="priority in priorities"
              :key="priority.value"
              class="flex items-center cursor-pointer"
            >
              <input
                v-model="selectedPriority"
                :value="priority.value"
                type="radio"
                :name="`priority-${formId}`"
                class="sr-only"
                @keydown.enter="selectPriority(priority.value)"
              />
              <div
                class="flex items-center px-3 py-2 rounded-md border-2 transition-all focus-outline"
                :class="getPriorityButtonClasses(priority.value)"
                tabindex="0"
                @click="selectPriority(priority.value)"
                @keydown.enter="selectPriority(priority.value)"
                @keydown.space.prevent="selectPriority(priority.value)"
                :aria-pressed="selectedPriority === priority.value"
                role="button"
              >
                <div
                  class="w-3 h-3 rounded-full mr-2"
                  :class="`bg-priority-${priority.value}`"
                  :aria-hidden="true"
                ></div>
                <span class="text-sm font-medium capitalize">
                  {{ priority.label }}
                </span>
              </div>
            </label>
          </div>
        </fieldset>
      </div>

      <button
        type="submit"
        class="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus-outline disabled:opacity-50 disabled:cursor-not-allowed"
        :disabled="!todoText.trim()"
        :aria-label="`Add new ${selectedPriority} priority todo`"
      >
        Add Todo
      </button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick, onMounted } from 'vue'
import { Priority } from '@/types/todo'

const emit = defineEmits<{
  addTodo: [{ text: string; priority: Priority }]
}>()

const todoText = ref('')
const selectedPriority = ref<Priority>('moderate')
const error = ref('')
const textInput = ref<HTMLInputElement>()
const formId = ref(Math.random().toString(36).substr(2, 9))

const priorities = [
  { value: 'critical' as Priority, label: 'Critical', color: 'red-500' },
  { value: 'moderate' as Priority, label: 'Moderate', color: 'yellow-500' },
  { value: 'optional' as Priority, label: 'Optional', color: 'green-500' }
]

const selectPriority = (priority: Priority) => {
  selectedPriority.value = priority
}

// Helper function to get priority button classes with guaranteed Tailwind compilation
const getPriorityButtonClasses = (priority: Priority) => {
  const isSelected = selectedPriority.value === priority
  
  if (isSelected) {
    switch (priority) {
      case 'critical':
        return 'border-red-500 bg-opacity-10'
      case 'moderate':
        return 'border-yellow-500 bg-opacity-10'
      case 'optional':
        return 'border-green-500 bg-opacity-10'
      default:
        return 'border-gray-300'
    }
  } else {
    return 'border-gray-300 hover:border-gray-400'
  }
}

const handleSubmit = async () => {
  error.value = ''
  
  if (!todoText.value.trim()) {
    error.value = 'Please enter a task description'
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
