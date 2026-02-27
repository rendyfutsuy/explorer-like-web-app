<template>
  <div class="folder-tree">
    <FolderNode
      v-for="node in tree"
      :key="node.id"
      :folder="node"
      @select="emit('select', $event)"
    />
  </div>
</template>

<script setup lang="ts">
import FolderNode from './FolderNode.vue'
import type { FolderNode as FolderNodeType } from '@repo/shared-types'

defineProps<{ tree: FolderNodeType[] }>()
const emit = defineEmits<{ (e: 'select', id: string): void }>()
</script>

<style scoped>
.folder-tree { font-family: ui-sans-serif, system-ui; font-size: 14px; }
</style>
