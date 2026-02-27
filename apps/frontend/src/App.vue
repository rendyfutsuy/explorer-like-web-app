<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue'
import { createPinia } from 'pinia'
import FolderTree from './components/FolderTree.vue'
import RightPanel from './components/RightPanel.vue'
import type { FolderNode, FolderRecord, FileRecord } from '@repo/shared-types'
import { useFoldersStore } from './stores/folders'

const store = useFoldersStore()
const tree = computed(() => store.tree)
const children = computed(() => store.children)
const query = ref('')

const baseUrl = `${location.protocol}//${location.hostname}:8081`

onMounted(async () => {
  await store.loadTree()
})

async function onSelect(id: string) {
  await store.loadChildren(id)
}

function filterTree(nodes: FolderNode[], q: string): FolderNode[] {
  if (!q) return nodes
  const lower = q.toLowerCase()
  const visit = (n: FolderNode): FolderNode | null => {
    const children = n.children.map(visit).filter(Boolean) as FolderNode[]
    if (n.name.toLowerCase().includes(lower) || children.length) {
      return { ...n, children }
    }
    return null
  }
  return nodes.map(visit).filter(Boolean) as FolderNode[]
}

const filtered = computed(() => filterTree(store.tree, query.value))
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
    </header>
    <section class="left">
      <FolderTree :tree="filtered" @select="onSelect" />
    </section>
    <section class="right">
      <RightPanel :folders="children.folders" :files="children.files" />
    </section>
  </div>
</template>

<style scoped>
.layout { display: grid; grid-template-columns: 1fr 2fr; height: 100vh; }
.topbar { grid-column: 1 / span 2; padding: 8px; border-bottom: 1px solid #ddd; }
.search { width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 6px; }
.left { overflow: auto; padding: 12px; }
.right { overflow: auto; }
</style>
