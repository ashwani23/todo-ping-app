<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-4xl mx-auto px-4">
      <header class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900 text-center">
          Todo List
        </h1>
        <p class="text-gray-600 text-center mt-2">
          Organize your tasks by priority: Critical, Moderate, and Optional
        </p>
      </header>

      <main>
        <TodoForm @add-todo="handleAddTodo" />
        <TodoList
          :todos="todos"
          :editing-id="editingId"
          @remove-todo="removeTodo"
          @start-editing="startEditing"
          @update-todo="updateTodo"
          @cancel-editing="cancelEditing"
          @clear-all="clearAllTodos"
        />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useTodos } from './composables/useTodos'
import { Priority } from './types/todo'
import TodoForm from './components/TodoForm.vue'
import TodoList from './components/TodoList.vue'

const {
  todos,
  editingId,
  addTodo,
  removeTodo,
  clearAllTodos,
  startEditing,
  updateTodo,
  cancelEditing
} = useTodos()

const handleAddTodo = (data: { text: string; priority: Priority }) => {
  addTodo(data.text, data.priority)
}
</script>
