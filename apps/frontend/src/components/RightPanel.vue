<template>
  <div class="right-panel" ref="container">
    <div class="header">
      <span class="cell name">Name</span>
      <span class="cell size">Size</span>
      <span class="cell created">Created At</span>
    </div>
    <div class="row" v-if="parentId">
        <button class="link" @click="emit('open-parent')" title="Kembali ke parent">...</button>
    </div>
    <VirtualList class="list" :items="items" :itemHeight="28" :height="listHeight" :endOffset="100" @reach-end="emit('load-more')">
      <template #default="{ item }">
        <div class="row">
          <span class="cell name">
            <span v-if="!item.is_file" class="icon">📁</span>
            <button
              v-if="!item.is_file"
              class="link"
              @click="emit('open-folder', item.id)"
              :title="item.name"
            >
              {{ truncateName(item.name) }}
            </button>
            <a
              v-else
              class="link"
              :href="item.file_path || '#'"
              target="_blank"
              rel="noopener noreferrer"
              :title="item.name"
            >
              {{ truncateName(item.name) }}
            </a>
          </span>
          <span class="cell size">
            <span v-if="item.size != null">{{ item.size }} B</span>
            <span v-else>—</span>
          </span>
          <span class="cell created">{{ formatDate(item.created_at) }}</span>
        </div>
      </template>
    </VirtualList>
  </div>
</template>


<script setup lang="ts">
import type { ItemRecord } from '@repo/shared-types'
import VirtualList from './VirtualList.vue'
import { ref, onMounted, onBeforeUnmount } from 'vue'
const emit = defineEmits<{ (e: 'open-folder', id: string): void; (e: 'open-parent'): void; (e: 'load-more'): void }>()
defineProps<{ items: ItemRecord[]; parentId: string | null }>()
const container = ref<HTMLDivElement | null>(null)
const listHeight = ref(240)
function truncateName(name: string) {
  return name.length > 50 ? name.slice(0, 50) + '...' : name
}
function updateHeight() {
  const h = container.value?.clientHeight ?? 240
  listHeight.value = Math.max(120, h)
}
function formatDate(d: Date | string) {
  const dt = typeof d === 'string' ? new Date(d) : d
  return isNaN(dt.getTime()) ? '' : dt.toLocaleString()
}
onMounted(() => {
  updateHeight()
  window.addEventListener('resize', updateHeight)
})
onBeforeUnmount(() => {
  window.removeEventListener('resize', updateHeight)
})
</script>

<style scoped>
.right-panel { height: 100%; padding: 8px 8px 16px 0; border-left: 1px solid #ddd; }
.parent { margin-bottom: 4px; }
.list { margin-top: 4px; }
.header { display: grid; grid-template-columns: 1fr 120px 180px; gap: 8px; padding: 0 8px 6px; border-bottom: 1px solid #eee; font-weight: 600; color: #444; }
.row { display: grid; grid-template-columns: 1fr 120px 180px; height: 28px; padding: 0 8px; }
.cell { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; text-align: left;}
.link { background: none; border: none; color: #1e88e5; cursor: pointer; padding: 0; text-align: left;}
.icon { margin-right: 6px; }
</style>
