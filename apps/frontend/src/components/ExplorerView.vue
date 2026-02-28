<template>
  <div class="explorer-view">
    <div class="sidebar" ref="sidebarBox" @scroll="onSidebarScroll">
      <h3>Folders</h3>
      <FolderTree :tree="foldersStore.tree" @select="selectFolder" />
      <div ref="treeEndSentinel" style="height: 1px;"></div>
    </div>
    <div class="main">
      <RightPanel :items="foldersStore.children" :parentId="foldersStore.selectedId" @load-more="foldersStore.loadMoreChildren()" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref } from 'vue'
import FolderTree from '../components/FolderTree.vue'
import RightPanel from '../components/RightPanel.vue'
import { useFoldersStore } from '../stores/folders'

const foldersStore = useFoldersStore()
const sidebarBox = ref<HTMLDivElement | null>(null)
const treeEndSentinel = ref<HTMLDivElement | null>(null)
let observer: IntersectionObserver | null = null
const SCROLL_TRIGGER_OFFSET = 100

const selectFolder = async (id: string) => {
  await foldersStore.loadChildren(id)
}

onMounted(async () => {
  await foldersStore.loadTree()
  if (treeEndSentinel.value) {
    observer = new IntersectionObserver((entries) => {
      const entry = entries[0]
      if (entry?.isIntersecting) foldersStore.loadMoreTree()
    }, { root: sidebarBox.value ?? undefined, threshold: 0, rootMargin: `0px 0px ${SCROLL_TRIGGER_OFFSET}px 0px` })
    observer.observe(treeEndSentinel.value)
  }
})

function onSidebarScroll() {
  const el = sidebarBox.value
  if (!el) return
  const bottom = el.scrollTop + el.clientHeight
  if (bottom >= el.scrollHeight - SCROLL_TRIGGER_OFFSET) foldersStore.loadMoreTree()
}

onBeforeUnmount(() => {
  if (observer) {
    observer.disconnect()
    observer = null
  }
})
</script>

<style scoped>
.explorer-view { display: flex; height: 100vh; }
.sidebar { width: 250px; border-right: 1px solid #e0e0e0; padding: 16px; overflow: auto; }
.main { flex: 1; padding: 16px; }
h3 { margin: 0 0 12px; font-size: 16px; }
</style>
