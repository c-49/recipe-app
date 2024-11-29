<script setup lang="ts">
import { defineComponent } from 'vue'
defineComponent({ name: 'ToolBar' })
defineProps<{
    title: string
}>()
defineEmits(['update:model-value'])
</script>

<template>
    <q-toolbar v-bind="$attrs">
        <q-btn flat round dense icon="menu" @click="$emit('update:model-value')" />
        <q-toolbar-title v-if="$q.screen.gt.xs">
            {{ title }}
        </q-toolbar-title>
        <q-space />
        <slot name="search" />
    </q-toolbar>
</template>