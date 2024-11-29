<script setup lang="ts">
import { defineComponent, ref, computed } from 'vue'
import { convertMinutesToHoursAndMinutes } from '../utils/time'

defineComponent({ name: 'Card' })
const props = defineProps<{
    modelValue?: any,
    loaded?: boolean,
    animationDelay?: number,
    isBookmarked?: boolean
    appColor?: string
}>()
defineEmits(['update:model-value', 'toggle-bookmark'])

const readyTime = computed(() => convertMinutesToHoursAndMinutes(props.modelValue?.readyInMinutes || 0))
const attributes = computed(() => [
    { label: 'Vegetarian', value: props.modelValue?.vegetarian, color: 'green' },
    { label: 'Vegan', value: props.modelValue?.vegan, color: 'green-9' },
    { label: 'Gluten Free', value: props.modelValue?.glutenFree, color: 'brown' },
    { label: 'Dairy Free', value: props.modelValue?.dairyFree, color: 'light-blue' },
    { label: 'Very Healthy', value: props.modelValue?.veryHealthy, color: 'teal' },
    { label: 'Cheap', value: props.modelValue?.cheap, color: 'orange' },
    { label: 'Very Popular', value: props.modelValue?.veryPopular, color: 'red' },
    { label: 'Sustainable', value: props.modelValue?.sustainable, color: 'green-6' },
    { label: 'Low FODMAP', value: props.modelValue?.lowFodmap, color: 'purple' }
].filter(attr => attr.value))

const expanded = ref(false)
const visibleAttributes = computed(() => expanded.value ? attributes.value : attributes.value.slice(0, 2))
const toggleExpanded = () => {
    expanded.value = !expanded.value
}
</script>

<template>
    <transition name="card-pop" appear>
        <q-card v-if="loaded" v-bind="$attrs" flat bordered :style="{ animationDelay: `${animationDelay}ms` }" class="cursor-pointer" @click="$emit('update:model-value')">
            <q-img :src="modelValue?.image" />

            <q-card-section class="q-pt-sm">
                <q-btn fab :color="isBookmarked ? 'teal-4' : appColor" :icon="isBookmarked ? 'bookmark' : 'bookmark_border'" class="absolute"
                    style="top: 0; right: 12px; transform: translateY(-80%);" @click.stop="$emit('toggle-bookmark')"/>

                <div class="row no-wrap items-center">
                    <div class="col text-subtitle1 text-bold ellipsis">
                        {{ modelValue?.title }}
                    </div>
                </div>

                <div class="row text-caption text-grey no-wrap justify-between">
                    <div class="row no-wrap q-gutter-x-sm items-center">
                        <q-icon name="thumb_up" />
                        <div>
                            {{ modelValue?.aggregateLikes }}
                        </div>
                    </div>
                    <div class="row no-wrap q-gutter-x-sm items-center">
                        <q-icon name="timer" />
                        <div>
                            {{ readyTime }}
                        </div>
                    </div>
                </div>
            </q-card-section>

            <q-card-section class="q-pt-none">
                <div v-html="modelValue?.summary" class="text-caption text-grey ellipsis-2-lines" />
            </q-card-section>
            <q-separator/>
            <q-card-actions>
                <div class="q-gutter-xs text-caption">
                    <q-chip v-for="attr in visibleAttributes" :key="attr.label" :color="attr.color" text-color="white"
                        size="xs">
                        {{ attr.label }}
                    </q-chip>
                    <q-btn v-if="attributes.length > 3" flat round dense :icon="expanded ? 'remove' : 'add'" size="xs"
                        @click="toggleExpanded" />
                </div>
            </q-card-actions>
        </q-card>
    </transition>
</template>

<style scoped>
.card-pop-enter-active {
    animation: card-pop-in 0.5s;
    animation-fill-mode: both;
}

@keyframes card-pop-in {
    0% {
        transform: scale(0.95);
        opacity: 0;
    }

    70% {
        transform: scale(1.05);
    }

    100% {
        transform: scale(1);
        opacity: 1;
    }
}
</style>