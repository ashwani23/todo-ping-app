<template>
  <fieldset>
    <legend class="block text-sm font-medium text-gray-700 mb-2">
      Priority Level
    </legend>
    <div class="flex" :class="compact ? 'gap-2' : 'gap-4'">
      <label
        v-for="priority in PRIORITY_OPTIONS"
        :key="priority.value"
        class="flex items-center cursor-pointer"
      >
        <input
          v-model="internalValue"
          :value="priority.value"
          type="radio"
          :name="uniqueName"
          class="sr-only"
          @keydown.enter="selectPriority(priority.value)"
        />
        <div
          :class="getPriorityButtonClasses(priority.value, internalValue === priority.value, compact ? 'compact' : 'default')"
          tabindex="0"
          @click="selectPriority(priority.value)"
          @keydown.enter="selectPriority(priority.value)"
          @keydown.space.prevent="selectPriority(priority.value)"
          :aria-pressed="internalValue === priority.value"
          role="button"
        >
          <div
            :class="[
              getPriorityIndicatorClasses(priority.value, compact ? 'small' : 'medium'),
              compact ? 'mr-1' : 'mr-2'
            ]"
            :aria-hidden="true"
          ></div>
          <span :class="compact ? 'text-xs' : 'text-sm'" class="font-medium capitalize">
            {{ priority.label }}
          </span>
        </div>
      </label>
    </div>
  </fieldset>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Priority } from '@/types/todo'
import { PRIORITY_OPTIONS, getPriorityButtonClasses, getPriorityIndicatorClasses } from '@/utils/priority'
import { generateFormId } from '@/utils/helpers'

interface Props {
  modelValue: Priority
  compact?: boolean
  name?: string
}

const props = withDefaults(defineProps<Props>(), {
  compact: false,
  name: () => generateFormId()
})

const emit = defineEmits<{
  'update:modelValue': [value: Priority]
}>()

const internalValue = computed({
  get: () => props.modelValue,
  set: (value: Priority) => emit('update:modelValue', value)
})

const uniqueName = computed(() => `priority-${props.name}`)

const selectPriority = (priority: Priority) => {
  internalValue.value = priority
}
</script>
