<template>
  <div
    class="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow"
    role="listitem"
    :aria-label="`Todo: ${todo.text}, Priority: ${todo.priority}`"
  >
    <div v-if="!isEditing" class="flex items-center justify-between">
      <div class="flex items-center flex-1 min-w-0">
        <div
          :class="getPriorityIndicatorClasses(todo.priority)"
          class="mr-3 flex-shrink-0"
          :aria-label="getPriorityAriaLabel(todo.priority)"
        ></div>
        <div class="flex-1 min-w-0">
          <p class="text-gray-900 font-medium truncate">{{ todo.text }}</p>
          <div class="flex items-center mt-1 text-sm text-gray-500">
            <span class="capitalize font-medium">{{ todo.priority }}</span>
            <span class="mx-2">•</span>
            <time :datetime="todo?.createdAt?.toISOString()">
              {{ formatDate(todo.createdAt) }}
            </time>
          </div>
        </div>
      </div>
      
      <div class="flex items-center gap-2 ml-4">
        <button
          @click="$emit('startEditing')"
          class="text-blue-600 hover:text-blue-800 p-1 rounded focus-outline"
          :aria-label="getTodoActionAriaLabel('edit', todo.text)"
        >
          <span class="sr-only">Edit</span>
          ✏️
        </button>
        <button
          @click="handleRemove"
          class="text-red-600 hover:text-red-800 p-1 rounded focus-outline"
          :aria-label="getTodoActionAriaLabel('delete', todo.text)"
        >
          <span class="sr-only">Delete</span>
          🗑️
        </button>
      </div>
    </div>

    <div v-else class="space-y-3">
      <div>
        <label :for="`edit-text-${todo.id}`" class="sr-only">
          Edit task description
        </label>
        <input
          :id="`edit-text-${todo.id}`"
          ref="editInput"
          v-model="editText"
          type="text"
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus-outline"
          :aria-describedby="`edit-error-${todo.id}`"
          @keydown.enter="handleUpdate"
          @keydown.escape="handleCancel"
        />
        <div
          v-if="error"
          :id="`edit-error-${todo.id}`"
          class="text-red-600 text-sm mt-1"
          role="alert"
          aria-live="polite"
        >
          {{ error }}
        </div>
      </div>

      <PrioritySelector
        v-model="editPriority"
        :name="todo.id"
        compact
      />

      <div class="flex gap-2">
        <button
          @click="handleUpdate"
          class="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 focus-outline"
          :disabled="!editText.trim()"
          aria-label="Save changes"
        >
          Save
        </button>
        <button
          @click="handleCancel"
          class="bg-gray-500 text-white px-3 py-1 rounded text-sm hover:bg-gray-600 focus-outline"
          aria-label="Cancel editing"
        >
          Cancel
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, nextTick } from 'vue'
import { Todo, Priority } from '@/types/todo'
import { useFormValidation } from '@/composables/useFormValidation'
import { formatDate, confirmAction } from '@/utils/helpers'
import { getPriorityIndicatorClasses } from '@/utils/priority'
import { getPriorityAriaLabel, getTodoActionAriaLabel } from '@/utils/accessibility'
import PrioritySelector from './PrioritySelector.vue'

const props = defineProps<{
  todo: Todo
  isEditing: boolean
}>()

const emit = defineEmits<{
  remove: []
  startEditing: []
  update: [{ id: string; text: string; priority: Priority }]
  cancelEditing: []
}>()

const editText = ref(props.todo.text)
const editPriority = ref<Priority>(props.todo.priority)
const editInput = ref<HTMLInputElement>()

const { error, validateText, clearError } = useFormValidation()

// Initialize edit values when editing starts
watch(() => props.isEditing, async (isEditing) => {
  if (isEditing) {
    editText.value = props.todo.text
    editPriority.value = props.todo.priority
    clearError()
    
    await nextTick()
    editInput.value?.focus()
    editInput.value?.select()
  }
}, { immediate: true })

const handleRemove = () => {
  if (confirmAction(`Are you sure you want to delete "${props.todo.text}"?`)) {
    emit('remove')
  }
}

const handleUpdate = () => {
  clearError()
  
  if (!validateText(editText.value, 'task description')) {
    return
  }

  emit('update', {
    id: props.todo.id,
    text: editText.value,
    priority: editPriority.value
  })
}

const handleCancel = () => {
  clearError()
  emit('cancelEditing')
}
</script>
