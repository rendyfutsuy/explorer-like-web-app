<template>
  <div class="right-panel">
    <!-- Khusus untuk menampilkan folder -->
    <div class="section">
      <VirtualList :items="folders" :itemHeight="28" :height="28">
        <template #default="{ item }">
          <div class="row">{{ item.name }}</div>
        </template>
      </VirtualList>
    </div>

    <!-- Khusus untuk menampilkan file -->
    <div class="section">
      <VirtualList :items="files" :itemHeight="28" :height="28">
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
