import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { FolderNode, FolderRecord, ItemRecord } from '@repo/shared-types'

const baseUrl = typeof location !== 'undefined' 
  ? `${location.protocol}//${location.hostname}:8081`
  : 'http://localhost:8081'

export const useFoldersStore = defineStore('folders', () => {
  const tree = ref<FolderNode[]>([])
  const children = ref<ItemRecord[]>([])
  const selectedId = ref<string | null>(null)
  const searchQuery = ref('')
  const parentMap = ref<Record<string, string | null>>({})
  const childrenPage = ref(1)
  const childrenPerPage = ref(25)
  const childrenTotal = ref(0)

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
    childrenPage.value = 1
    const res = await fetch(`${baseUrl}/api/v1/folders/${id}/children?page=${childrenPage.value}&per_page=${childrenPerPage.value}`)
    const data = await res.json()
    children.value = data.items
    childrenTotal.value = data.total
    childrenPage.value = data.page
  }

  async function loadMoreChildren() {
    if (!selectedId.value) return
    if (children.value.length >= childrenTotal.value) return
    const nextPage = childrenPage.value + 1
    const res = await fetch(`${baseUrl}/api/v1/folders/${selectedId.value}/children?page=${nextPage}&per_page=${childrenPerPage.value}`)
    const data = await res.json()
    children.value = children.value.concat(data.items)
    childrenTotal.value = data.total
    childrenPage.value = data.page
  }

  function getParent(id: string | null): string | null {
    if (!id) return null
    return parentMap.value[id] ?? null
  }

  return { tree, children, selectedId, searchQuery, childrenPage, childrenPerPage, childrenTotal, loadTree, loadChildren, loadMoreChildren, getParent }
})
