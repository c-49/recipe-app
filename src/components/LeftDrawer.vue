<script setup lang="ts">
import { defineComponent, ref } from 'vue'
defineComponent({ name: 'LeftDrawer' })
defineProps<{
    modelValue?: string
}>()
defineEmits(['update:model-value'])

const cats = ref([
    { label: 'Home', value: 'home' },
    { label: 'Bookmarks', value: 'bookmarks' },
    { label: 'Trending', value: 'trending' },
    { label: 'Settings', value: 'settings' }
])
</script>

<template>
    <q-list padding class="rounded-borders">
        <q-item v-for="(item, index) in cats" :active="modelValue === item.value" clickable v-ripple
            @click="$emit('update:model-value', item.value)">
            <q-item-section>
                {{ item.label }}
            </q-item-section>
        </q-item>
    </q-list>
</template>