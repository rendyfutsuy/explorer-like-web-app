import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { FolderNode, FolderRecord, FileRecord } from '@repo/shared-types'

const baseUrl = `${location.protocol}//${location.hostname}:8081`

export const useFoldersStore = defineStore('folders', () => {
  const tree = ref<FolderNode[]>([])
  const children = ref<{ folders: FolderRecord[]; files: FileRecord[] }>({ folders: [], files: [] })
  const selectedId = ref<string | null>(null)
  const searchQuery = ref('')

  async function loadTree() {
    const res = await fetch(`${baseUrl}/api/v1/folders/tree`)
    tree.value = await res.json()
  }

  async function loadChildren(id: string) {
    selectedId.value = id
    const res = await fetch(`${baseUrl}/api/v1/folders/${id}/children`)
    children.value = await res.json()
  }

  return { tree, children, selectedId, searchQuery, loadTree, loadChildren }
})
