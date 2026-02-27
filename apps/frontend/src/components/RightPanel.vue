<template>
  <div class="right-panel">
    <div class="row" v-if="parentId">
        <button class="link" @click="emit('open-parent')" title="Kembali ke parent">...</button>
    </div>
    <VirtualList class="list" :items="items" :itemHeight="28" :height="240">
      <template #default="{ item }">
        <div class="row">
          <span v-if="!item.is_file" class="icon">📁</span>
          <button
            v-if="!item.is_file"
            class="link"
            @click="emit('open-folder', item.id)"
          >
            {{ item.name }}
          </button>
          <a
            v-else
            class="link"
            :href="item.file_path || '#'"
            target="_blank"
            rel="noopener noreferrer"
          >
            {{ item.name }}<span v-if="item.size != null"> ({{ item.size }} B)</span>
          </a>
        </div>
      </template>
    </VirtualList>
  </div>
</template>


<script setup lang="ts">
import type { ItemRecord } from '@repo/shared-types'
import VirtualList from './VirtualList.vue'
const emit = defineEmits<{ (e: 'open-folder', id: string): void; (e: 'open-parent'): void }>()
defineProps<{ items: ItemRecord[]; parentId: string | null }>()
</script>

<style scoped>
.right-panel { padding: 8px 8px 16px 0; border-left: 1px solid #ddd; }
.parent { margin-bottom: 4px; }
.list { margin-top: 4px; }
.row { display: flex; align-items: center; height: 28px; padding: 0 4px; }
.link { background: none; border: none; color: #1e88e5; cursor: pointer; padding: 0; }
.icon { margin-right: 6px; }
</style>
