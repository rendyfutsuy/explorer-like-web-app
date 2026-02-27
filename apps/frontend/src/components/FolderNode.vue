<template>
  <div class="folder-node">
    <div class="folder-header" @click="toggle">
      <span>{{ isOpen ? '📂' : '📁' }}</span>
      <button class="name" @click.stop="select">{{ folder.name }}</button>
    </div>
    <div v-if="isOpen" class="children">
      <FolderNode
        v-for="child in folder.children"
        :key="child.id"
        :folder="child"
        @select="emit('select', $event)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { FolderNode as FolderNodeType } from '@repo/shared-types'
import FolderNode from './FolderNode.vue'

const props = defineProps<{ folder: FolderNodeType }>()
const emit = defineEmits<{ (e: 'select', id: string): void }>()

const isOpen = ref(false)
const toggle = () => { isOpen.value = !isOpen.value }
const select = () => emit('select', props.folder.id)
</script>

<style scoped>
.folder-header { display: flex; gap: 8px; align-items: center; }
.name { background: none; border: none; color: #1e88e5; cursor: pointer; padding: 0; }
.children { padding-left: 16px; border-left: 1px dashed #ccc; margin-left: 8px; }
</style>
