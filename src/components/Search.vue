<script setup lang="ts">
import { defineComponent } from 'vue'
defineComponent({ name: 'Search' })
defineProps<{
    modelValue: string
}>()
defineEmits(['update:model-value'])
</script>

<template>
    <q-input v-bind="$attrs" borderless dense debounce="300" :model-value="modelValue" placeholder="Search"
        @update:model-value="$emit('update:model-value', $event)">
        <template v-slot:append>
            <q-icon name="search" />
        </template>
    </q-input>
</template>