import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { FolderNode, FolderRecord, FileRecord } from '@repo/shared-types'

const baseUrl = `${location.protocol}//${location.hostname}:8081`

export const useFoldersStore = defineStore('folders', () => {
  const tree = ref<FolderNode[]>([])
  const children = ref<{ folders: FolderRecord[]; files: FileRecord[] }>({ folders: [], files: [] })
  const selectedId = ref<string | null>(null)
  const searchQuery = ref('')
  const parentMap = ref<Record<string, string | null>>({})

  async function loadTree() {
    const res = await fetch(`${baseUrl}/api/v1/folders/tree`)
    tree.value = await res.json()
    const map: Record<string, string | null> = {}
    const walk = (nodes: FolderNode[], parent: string | null) => {
      for (const n of nodes) {
        map[n.id] = parent
        if (n.children?.length) walk(n.children, n.id)
      }
    }
    walk(tree.value, null)
    parentMap.value = map
  }

  async function loadChildren(id: string) {
    selectedId.value = id
    const res = await fetch(`${baseUrl}/api/v1/folders/${id}/children`)
    children.value = await res.json()
  }

  function getParent(id: string | null): string | null {
    if (!id) return null
    return parentMap.value[id] ?? null
  }

  return { tree, children, selectedId, searchQuery, loadTree, loadChildren, getParent }
})
