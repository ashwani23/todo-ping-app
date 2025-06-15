<template>
  <div
    class="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow"
    role="listitem"
    :aria-label="`Todo: ${todo.text}, Priority: ${todo.priority}`"
  >
    <div v-if="!isEditing" class="flex items-center justify-between">
      <div class="flex items-center flex-1 min-w-0">
        <div
          class="w-3 h-3 rounded-full mr-3 flex-shrink-0"
          :class="`bg-priority-${todo.priority}`"
          :aria-label="`${todo.priority} priority`"
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
          :aria-label="`Edit todo: ${todo.text}`"
        >
          <span class="sr-only">Edit</span>
          ✏️
        </button>
        <button
          @click="handleRemove"
          class="text-red-600 hover:text-red-800 p-1 rounded focus-outline"
          :aria-label="`Delete todo: ${todo.text}`"
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
          v-if="editError"
          :id="`edit-error-${todo.id}`"
          class="text-red-600 text-sm mt-1"
          role="alert"
          aria-live="polite"
        >
          {{ editError }}
        </div>
      </div>

      <div>
        <fieldset>
          <legend class="block text-sm font-medium text-gray-700 mb-2">
            Priority Level
          </legend>
          <div class="flex gap-2">
            <label
              v-for="priority in priorities"
              :key="priority.value"
              class="flex items-center cursor-pointer"
            >
              <input
                v-model="editPriority"
                :value="priority.value"
                type="radio"
                :name="`edit-priority-${todo.id}`"
                class="sr-only"
              />
              <div
                class="flex items-center px-2 py-1 rounded text-xs border-2 transition-all focus-outline"
                :class="getEditPriorityButtonClasses(priority.value)"
                tabindex="0"
                @click="editPriority = priority.value"
                @keydown.enter="editPriority = priority.value"
                @keydown.space.prevent="editPriority = priority.value"
                :aria-pressed="editPriority === priority.value"
                role="button"
              >
                <div
                  class="w-2 h-2 rounded-full mr-1"
                  :class="`bg-priority-${priority.value}`"
                  :aria-hidden="true"
                ></div>
                <span class="capitalize">{{ priority.label }}</span>
              </div>
            </label>
          </div>
        </fieldset>
      </div>

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
const editError = ref('')
const editInput = ref<HTMLInputElement>()

const priorities = [
  { value: 'critical' as Priority, label: 'Critical', color: 'red-500' },
  { value: 'moderate' as Priority, label: 'Moderate', color: 'yellow-500' },
  { value: 'optional' as Priority, label: 'Optional', color: 'green-500' }
]

// Helper function to get edit priority button classes with guaranteed Tailwind compilation
const getEditPriorityButtonClasses = (priority: Priority) => {
  const isSelected = editPriority.value === priority
  
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

// Initialize edit values when editing starts
watch(() => props.isEditing, async (isEditing) => {
  if (isEditing) {
    editText.value = props.todo.text
    editPriority.value = props.todo.priority
    editError.value = ''
    
    await nextTick()
    editInput.value?.focus()
    editInput.value?.select()
  }
}, { immediate: true })

const handleRemove = () => {
  if (window.confirm(`Are you sure you want to delete "${props.todo.text}"?`)) {
    emit('remove')
  }
}

const handleUpdate = () => {
  editError.value = ''
  
  if (!editText.value.trim()) {
    editError.value = 'Please enter a task description'
    return
  }

  emit('update', {
    id: props.todo.id,
    text: editText.value,
    priority: editPriority.value
  })
}

const handleCancel = () => {
  editError.value = ''
  emit('cancelEditing')
}

const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit'
  }).format(date)
}
</script>
