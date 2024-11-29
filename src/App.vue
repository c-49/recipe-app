<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue'
import ToolBar from './components/ToolBar.vue'
import Search from './components/Search.vue'
import LeftDrawer from './components/LeftDrawer.vue'
import Card from './components/Card.vue'
import { searchRecipes, searchBookmarks } from './utils/axios'
import { useBookmarks, useAppSettings } from './composables/useQuasarStorage'

const keywords = ref('')
const currentView = ref('home')
const offsetNum = ref(0)
const leftDrawerOpen = ref(false)
const rightDrawerOpen = ref(false)
const loaded = ref(false)
const content = ref([])
const viewedContent = ref()

const { bookmarks, toggleBookmark, isBookmarked } = useBookmarks()
const { backgroundColor, isDarkMode } = useAppSettings()

const getRecipe = async ({ query, sort, sortDirection, offset }: { query?: string, sort?: string, sortDirection?: string, offset?: number }) => {
  loaded.value = false
  if (query) keywords.value = query
  if (offset) offsetNum.value = offset
  const { data } = await searchRecipes({ query, sort, sortDirection, offset: offsetNum.value })
  if (data) content.value = data.results
  loaded.value = true
}
const getBookmarks = async () => {
  loaded.value = false
  const { data } = await searchBookmarks({ ids: bookmarks.value.join(',') })
  if (data) content.value = data
  loaded.value = true
}

const updateView = async (value, done) => {
  currentView.value = value
  switch (value) {
    case 'home':
      await getRecipe({ query: '', sort: 'random', })
      break
    case 'bookmarks':
      await getBookmarks()
      break
    case 'trending':
      await getRecipe({ query: '', sort: 'popularity', sortDirection: 'desc' })
      break
    default:
      await getRecipe({ query: '', sort: 'random', })
      break
  }
  if (done) done()
}

onMounted(async () => {
  await updateView()
})

const ANIMATION_DELAY = 300 // 0.3 second delay between each card

const getAnimationDelay = computed(() => (index: number) => index * ANIMATION_DELAY)

// Apply dark mode and background color
// watch([isDarkMode, backgroundColor], ([newDarkMode, newBgColor]) => {
//   document.body.style.backgroundColor = newBgColor
//   document.body.classList.toggle('body--dark', newDarkMode)
// })

// const toggleDarkMode = () => {
//   isDarkMode.value = !isDarkMode.value
// }

// const changeBackgroundColor = (color: string) => {
//   backgroundColor.value = color
// }
</script>

<template>
  <q-layout view="lHr lpr lFr" :class="{ 'bg-dark': isDarkMode, 'bg-grey-3': !isDarkMode }">
    <ToolBar style="position: fixed;z-index: 999;" title="Recipe App" :class="`bg-${backgroundColor} text-white`"
      @update:model-value="leftDrawerOpen = !leftDrawerOpen">
      <template #search>
        <Search :model-value="keywords" dark @update:model-value="getRecipe({ query: $event })" />
      </template>
    </ToolBar>
    <q-drawer v-model="leftDrawerOpen" side="left" behavior="mobile" :dark="isDarkMode">
      <LeftDrawer :model-value="currentView" @update:model-value="updateView" />
    </q-drawer>

    <q-drawer v-model="rightDrawerOpen" side="right" overlay behavior="mobile" :dark="isDarkMode">
      <!-- drawer content -->
    </q-drawer>
    <q-page-container style="padding-top: 50px;">
      <q-pull-to-refresh @refresh="updateView(currentView, $event)">
        <div class="q-pa-md">
          <div v-if="loaded" class="row q-gutter-md justify-center">
            <Card v-for="(item, index) in content" :key="index" :model-value="item" :loaded="loaded"
              :animation-delay="getAnimationDelay(index)" :is-bookmarked="isBookmarked(item.id)"
              :app-color="backgroundColor" :dark="isDarkMode" class="col-lg-3 col-md-3 col-sm-3 col-xs-12" @toggle-bookmark="toggleBookmark(item.id)"
              @update:model-value="viewedContent = $event" />
          </div>
          <div v-else class="row justify-center">
            <q-spinner-cube size="xl" :color="backgroundColor" />
          </div>
        </div>
      </q-pull-to-refresh>
    </q-page-container>
    <q-footer :class="`bg-${backgroundColor} text-white`">
      <q-toolbar>
        <div class="row justify-center no-wrap full-width q-gutter-x-md">
          <q-btn :disable="offsetNum === 0" flat icon="chevron_left" round
            @click="getRecipe({ query: keywords, offset: offsetNum -= 10 })" />
          <q-btn flat icon="chevron_right" round @click="getRecipe({ query: keywords, offset: offsetNum += 10 })" />
        </div>
      </q-toolbar>
    </q-footer>
  </q-layout>
</template>