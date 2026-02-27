<template>
  <div class="right-panel">
    <h3>Children</h3>
    <div class="section">
      <h4>Folders</h4>
      <VirtualList :items="folders" :itemHeight="28" :height="280">
        <template #default="{ item }">
          <div class="row">{{ item.name }}</div>
        </template>
      </VirtualList>
    </div>
    <div class="section">
      <h4>Files</h4>
      <VirtualList :items="files" :itemHeight="28" :height="280">
        <template #default="{ item }">
          <div class="row">{{ item.name }} ({{ item.size }} B)</div>
        </template>
      </VirtualList>
    </div>
  </div>
  </template>

<script setup lang="ts">
import type { FolderRecord, FileRecord } from '@repo/shared-types'
import VirtualList from './VirtualList.vue'
defineProps<{ folders: FolderRecord[]; files: FileRecord[] }>()
</script>

<style scoped>
.right-panel { padding: 12px; border-left: 1px solid #ddd; }
.section { margin-top: 8px; }
h3, h4 { margin: 0; }
.row { display: flex; align-items: center; height: 28px; padding: 0 8px; }
</style>
