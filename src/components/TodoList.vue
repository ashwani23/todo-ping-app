<template>
  <div class="bg-white rounded-lg shadow-md p-6">
    <div class="flex justify-between items-center mb-4">
      <h2 class="text-xl font-semibold text-gray-800">
        Your Todos ({{ todos.length }})
      </h2>
      <button
        v-if="todos.length > 0"
        @click="handleClearAll"
        class="text-red-600 hover:text-red-800 text-sm font-medium focus-outline px-2 py-1 rounded"
        :aria-label="getClearAllAriaLabel(todos.length)"
      >
        Clear All
      </button>
    </div>

    <div v-if="todos.length === 0" class="text-center py-8">
      <div class="text-gray-400 text-lg mb-2">📝</div>
      <p class="text-gray-500">No todos yet. Add one above to get started!</p>
    </div>

    <div v-else class="space-y-3" role="list" aria-label="Todo items">
      <TodoItem
        v-for="todo in todos"
        :key="todo.id"
        :todo="todo"
        :is-editing="editingId === todo.id"
        @remove="$emit('removeTodo', todo.id)"
        @start-editing="$emit('startEditing', todo.id)"
        @update="handleUpdate"
        @cancel-editing="$emit('cancelEditing')"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { Todo, Priority } from '@/types/todo'
import { confirmAction } from '@/utils/helpers'
import { getClearAllAriaLabel } from '@/utils/accessibility'
import TodoItem from './TodoItem.vue'

defineProps<{
  todos: Todo[]
  editingId: string | null
}>()

const emit = defineEmits<{
  removeTodo: [id: string]
  startEditing: [id: string]
  updateTodo: [id: string, text: string, priority: Priority]
  cancelEditing: []
  clearAll: []
}>()

const handleUpdate = (data: { id: string; text: string; priority: Priority }) => {
  emit('updateTodo', data.id, data.text, data.priority)
}

const handleClearAll = () => {
  if (confirmAction('Are you sure you want to clear all todos? This action cannot be undone.')) {
    emit('clearAll')
  }
}
</script>
