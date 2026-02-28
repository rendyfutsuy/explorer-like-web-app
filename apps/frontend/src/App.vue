<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, computed, watch } from 'vue'
import { createPinia, storeToRefs } from 'pinia'
import FolderTree from './components/FolderTree.vue'
import RightPanel from './components/RightPanel.vue'
import type { FolderNode, ItemRecord } from '@repo/shared-types'
import { useFoldersStore } from './stores/folders'

const store = useFoldersStore()
const { tree, children, selectedId } = storeToRefs(store)
const query = ref('')
const results = ref<ItemRecord[]>([])
const showResults = ref(false)
const resultsPage = ref(1)
const resultsPerPage = ref(10)
const resultsTotal = ref(0)
const resultsBox = ref<HTMLDivElement | null>(null)
const leftBox = ref<HTMLDivElement | null>(null)
const leftEndSentinel = ref<HTMLDivElement | null>(null)
let leftObserver: IntersectionObserver | null = null
const LEFT_SCROLL_OFFSET = 100
const DEBOUNCE_MS = 300
let debounceTimer: number | null = null
let searchAbort: AbortController | null = null

const baseUrl = `${location.protocol}//${location.hostname}:8081`

onMounted(async () => {
  await store.loadTree()
  if (leftEndSentinel.value) {
    leftObserver = new IntersectionObserver((entries) => {
      const entry = entries[0]
      if (entry?.isIntersecting) store.loadMoreTree()
    }, { root: leftBox.value ?? undefined, threshold: 0, rootMargin: `0px 0px ${LEFT_SCROLL_OFFSET}px 0px` })
    leftObserver.observe(leftEndSentinel.value)
  }
})

async function onSelect(id: string) {
  await store.loadChildren(id)
}

async function runSearch(q: string) {
  if (!q) {
    results.value = []
    showResults.value = false
    if (searchAbort) {
      searchAbort.abort()
      searchAbort = null
    }
    return
  }
  resultsPage.value = 1
  if (searchAbort) searchAbort.abort()
  searchAbort = new AbortController()
  const res = await fetch(`${baseUrl}/api/v1/items?q=${encodeURIComponent(q)}&page=${resultsPage.value}&per_page=${resultsPerPage.value}`, { signal: searchAbort.signal })
  const data = await res.json()
  results.value = data.items
  resultsTotal.value = data.total
  resultsPage.value = data.page
  showResults.value = true
}

watch(query, (v) => {
  if (debounceTimer != null) clearTimeout(debounceTimer)
  debounceTimer = window.setTimeout(() => {
    runSearch(v)
    debounceTimer = null
  }, DEBOUNCE_MS)
})
const items = computed<ItemRecord[]>(() => children.value)
const parentId = computed(() => store.getParent(selectedId.value))

function pickItem(item: ItemRecord) {
  showResults.value = false
  query.value = ''
  if (item.is_file) {
    if (item.file_path) window.open(item.file_path, '_blank', 'noopener')
    return
  }
  onSelect(item.id)
}

async function loadMoreResults() {
  if (!query.value) return
  if (results.value.length >= resultsTotal.value) return
  const next = resultsPage.value + 1
  const res = await fetch(`${baseUrl}/api/v1/items?q=${encodeURIComponent(query.value)}&page=${next}&per_page=${resultsPerPage.value}`)
  const data = await res.json()
  results.value = results.value.concat(data.items)
  resultsTotal.value = data.total
  resultsPage.value = data.page
}

function onResultsScroll(e: Event) {
  const el = resultsBox.value
  if (!el) return
  const bottom = el.scrollTop + el.clientHeight
  if (bottom >= el.scrollHeight - 28) loadMoreResults()
}

function onLeftScroll() {
  const el = leftBox.value
  if (!el) return
  const bottom = el.scrollTop + el.clientHeight
  if (bottom >= el.scrollHeight - LEFT_SCROLL_OFFSET) store.loadMoreTree()
}

onBeforeUnmount(() => {
  if (leftObserver) {
    leftObserver.disconnect()
    leftObserver = null
  }
  if (debounceTimer != null) clearTimeout(debounceTimer)
  if (searchAbort) searchAbort.abort()
})
</script>

<template>
  <div class="layout">
    <header class="topbar">
      <input
        class="search"
        v-model="query"
        type="text"
        placeholder="Search folders..."
      />
      <div v-if="showResults" class="results" ref="resultsBox" @scroll="onResultsScroll">
        <div v-for="it in results" :key="it.id" class="result-row">
          <button class="result-link" @click="pickItem(it)">
            <span v-if="!it.is_file">📁</span>
            <span v-else>📄</span>
            {{ it.name }}
          </button>
        </div>
      </div>
    </header>
    <section class="left" ref="leftBox" @scroll="onLeftScroll">
      <FolderTree :tree="tree" @select="onSelect" />
      <div ref="leftEndSentinel" style="height: 1px;"></div>
    </section>
    <section class="right">
      <RightPanel
        :items="items"
        :parentId="parentId"
        @open-folder="onSelect"
        @open-parent="parentId && onSelect(parentId)"
        @load-more="store.loadMoreChildren()"
      />
    </section>
    <a
      class="api-doc"
      :href="`${baseUrl}/swagger`"
      target="_blank"
      rel="noopener"
      title="To API Documentation"
      aria-label="To API Documentation"
    >📄</a>
  </div>
</template>

<style scoped>
.layout { display: grid; grid-template-columns: 300px 1fr; grid-template-rows: auto 1fr; width: 100vw; height: 100vh; }
.topbar { position: relative; grid-column: 1 / span 2; padding: 8px; border-bottom: 1px solid #ddd; display: flex; justify-content: flex-end; align-items: center; }
.search { width: 320px; padding: 8px; border: 1px solid #ddd; border-radius: 6px; }
.results { position: absolute; right: 8px; top: calc(100% - 4px); background: #fff; border: 1px solid #ddd; border-radius: 6px; padding: 4px; max-height: 240px; overflow: auto; min-width: 320px; }
.result-row { height: 28px; display: flex; align-items: center; }
.result-link { background: none; border: none; color: #1e88e5; cursor: pointer; padding: 0; display: flex; gap: 6px; align-items: center; }
.left { overflow: auto; padding: 12px; }
.right { overflow: auto; }
.api-doc {
  position: fixed;
  right: 12px;
  bottom: 12px;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: #1e88e5;
  color: #fff;
  text-decoration: none;
  box-shadow: 0 2px 6px rgba(0,0,0,0.15);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
}
</style>
