// useQuasarStorage.ts
import { LocalStorage } from 'quasar'
import { ref, watch } from 'vue'

function isValidType<T>(value: unknown, defaultValue: T): value is T {
  return (
    (typeof value === 'string' && typeof defaultValue === 'string') ||
    (typeof value === 'number' && typeof defaultValue === 'number') ||
    (typeof value === 'boolean' && typeof defaultValue === 'boolean') ||
    (Array.isArray(value) && Array.isArray(defaultValue)) ||
    (typeof value === 'object' && typeof defaultValue === 'object' && value !== null && defaultValue !== null)
  )
}

export function useQuasarStorage<T>(key: string, defaultValue: T) {
  const storedValue = LocalStorage.getItem(key)
  const value = ref<T>(
    isValidType(storedValue, defaultValue) ? storedValue : defaultValue
  )

  watch(value, (newValue) => {
    LocalStorage.set(key, newValue)
  }, { deep: true })

  return value
}

export function useBookmarks() {
  const bookmarks = useQuasarStorage<number[]>('bookmarks', [])

  const toggleBookmark = (id: number) => {
    const index = bookmarks.value.indexOf(id)
    if (index === -1) {
      bookmarks.value.push(id)
    } else {
      bookmarks.value.splice(index, 1)
    }
  }

  const isBookmarked = (id: number) => bookmarks.value.includes(id)

  return { bookmarks, toggleBookmark, isBookmarked }
}

export function useAppSettings() {
  const backgroundColor = useQuasarStorage<string>('backgroundColor', 'red')
  const isDarkMode = useQuasarStorage<boolean>('isDarkMode', true)

  return { backgroundColor, isDarkMode }
}