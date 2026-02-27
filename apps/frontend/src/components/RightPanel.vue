<template>
  <div class="right-panel">
    <button v-if="parentId" class="link parent" @click="emit('open-parent')" title="Kembali ke parent">⬅️ Parent</button>
    <VirtualList class="list" :items="folders" :itemHeight="28" :height="240">
      <template #default="{ item }">
        <div class="row">
          <button class="link" @click="emit('open-folder', item.id)">{{ item.name }}</button>
        </div>
      </template>
    </VirtualList>
    <VirtualList class="list" :items="files" :itemHeight="28" :height="240">
      <template #default="{ item }">
        <div class="row">{{ item.name }} ({{ item.size }} B)</div>
      </template>
    </VirtualList>
  </div>
</template>


<script setup lang="ts">
import type { FolderRecord, FileRecord } from '@repo/shared-types'
import VirtualList from './VirtualList.vue'
const emit = defineEmits<{ (e: 'open-folder', id: string): void; (e: 'open-parent'): void }>()
defineProps<{ folders: FolderRecord[]; files: FileRecord[]; parentId: string | null }>()
</script>

<style scoped>
.right-panel { padding: 8px 16px 16px 16px; border-left: 1px solid #ddd; }
.parent { margin-bottom: 4px; }
.list { margin-top: 4px; }
.row { display: flex; align-items: center; height: 28px; padding: 0 8px; }
.link { background: none; border: none; color: #1e88e5; cursor: pointer; padding: 0; }
</style>
