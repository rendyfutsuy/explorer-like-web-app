<template>
  <div class="explorer-view">
    <div class="sidebar">
      <h3>Folders</h3>
      <FolderTree :tree="foldersStore.tree" @select="selectFolder" />
    </div>
    <div class="main">
      <RightPanel :items="foldersStore.children" :parentId="foldersStore.selectedId" @load-more="foldersStore.loadMoreChildren()" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import FolderTree from '../components/FolderTree.vue'
import RightPanel from '../components/RightPanel.vue'
import { useFoldersStore } from '../stores/folders'

const foldersStore = useFoldersStore()

const selectFolder = async (id: string) => {
  await foldersStore.loadChildren(id)
}

onMounted(async () => {
  await foldersStore.loadTree()
})
</script>

<style scoped>
.explorer-view { display: flex; height: 100vh; }
.sidebar { width: 250px; border-right: 1px solid #e0e0e0; padding: 16px; }
.main { flex: 1; padding: 16px; }
h3 { margin: 0 0 12px; font-size: 16px; }
</style>
