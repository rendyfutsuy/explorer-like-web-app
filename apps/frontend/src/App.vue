<script setup lang="ts">
import { ref, onMounted } from 'vue'
import FolderTree from './components/FolderTree.vue'
import RightPanel from './components/RightPanel.vue'
import type { FolderNode, FolderRecord, FileRecord } from './types'

const tree = ref<FolderNode[]>([])
const children = ref<{ folders: FolderRecord[]; files: FileRecord[] }>({ folders: [], files: [] })

const baseUrl = `${location.protocol}//${location.hostname}:8081`

onMounted(async () => {
  const res = await fetch(`${baseUrl}/api/v1/folders/tree`)
  tree.value = await res.json()
})

async function onSelect(id: string) {
  const res = await fetch(`${baseUrl}/api/v1/folders/${id}/children`)
  children.value = await res.json()
}
</script>

<template>
  <div class="layout">
    <section class="left">
      <FolderTree :tree="tree" @select="onSelect" />
    </section>
    <section class="right">
      <RightPanel :folders="children.folders" :files="children.files" />
    </section>
  </div>
</template>

<style scoped>
.layout { display: grid; grid-template-columns: 1fr 2fr; height: 100vh; }
.left { overflow: auto; padding: 12px; }
.right { overflow: auto; }
</style>
