<template>
  <div class="right-panel">
    <h3>Children</h3>
    <div class="section">
      <h4>Folders</h4>
      <ul>
        <li v-for="f in folders" :key="f.id">{{ f.name }}</li>
      </ul>
    </div>
    <div class="section">
      <h4>Files</h4>
      <ul>
        <li v-for="fl in files" :key="fl.id">{{ fl.name }} ({{ fl.size }} B)</li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { FolderRecord, FileRecord } from '../types'
defineProps<{ folders: FolderRecord[]; files: FileRecord[] }>()
</script>

<style scoped>
.right-panel { padding: 12px; border-left: 1px solid #ddd; }
.section { margin-top: 8px; }
h3, h4 { margin: 0; }
ul { margin: 4px 0 0; padding-left: 18px; }
</style>
