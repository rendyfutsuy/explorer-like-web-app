import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { FolderNode, ItemRecord } from '@repo/shared-types'

const baseUrl = typeof location !== 'undefined' 
  ? `${location.protocol}//${location.hostname}:8081`
  : 'http://localhost:8081'

export const useFoldersStore = defineStore('folders', () => {
  const tree = ref<FolderNode[]>([])
  const children = ref<ItemRecord[]>([])
  const selectedId = ref<string | null>(null)
  const searchQuery = ref('')
  const parentMap = ref<Record<string, string | null>>({})
  const treePage = ref(1)
  const treePerPage = ref(10)
  const treeTotal = ref(0)
  const treeLoading = ref(false)
  const childrenPage = ref(1)
  const childrenPerPage = ref(31)
  const childrenTotal = ref(0)
  const childrenLoading = ref(false)

  async function loadTree() {
    if (treeLoading.value) return
    treeLoading.value = true
    treePage.value = 1
    const res = await fetch(`${baseUrl}/api/v1/folders/tree?page=${treePage.value}&per_page=${treePerPage.value}`)
    const data = await res.json()
    tree.value = data.tree ?? []
    treeTotal.value = data.total ?? 0
    treePage.value = data.page ?? treePage.value
    const map: Record<string, string | null> = {}
    const walk = (nodes: FolderNode[], parent: string | null) => {
      for (const n of nodes) {
        map[n.id] = parent
        if (n.children?.length) walk(n.children, n.id)
      }
    }
    walk(tree.value, null)
    parentMap.value = map
    treeLoading.value = false
  }

  async function loadMoreTree() {
    if (treeLoading.value) return
    if (tree.value.length >= treeTotal.value) return
    treeLoading.value = true
    const nextPage = treePage.value + 1
    const res = await fetch(`${baseUrl}/api/v1/folders/tree?page=${nextPage}&per_page=${treePerPage.value}`)
    const data = await res.json()
    const appended = data.tree ?? []
    tree.value = tree.value.concat(appended)
    treeTotal.value = data.total ?? treeTotal.value
    treePage.value = data.page ?? nextPage
    for (const root of appended) {
      const stack: { node: FolderNode; parent: string | null }[] = [{ node: root, parent: null }]
      while (stack.length) {
        const { node, parent } = stack.pop()!
        parentMap.value[node.id] = parent
        if (node.children?.length) {
          for (const ch of node.children) stack.push({ node: ch, parent: node.id })
        }
      }
    }
    treeLoading.value = false
  }

  async function loadChildren(id: string) {
    if (childrenLoading.value) return
    selectedId.value = id
    childrenPage.value = 1
    childrenLoading.value = true
    const res = await fetch(`${baseUrl}/api/v1/folders/${id}/children?page=${childrenPage.value}&per_page=${childrenPerPage.value}`)
    const data = await res.json()
    children.value = data.items
    childrenTotal.value = data.total
    childrenPage.value = data.page
    childrenLoading.value = false
  }

  async function loadMoreChildren() {
    if (!selectedId.value) return
    if (children.value.length >= childrenTotal.value) return
    if (childrenLoading.value) return
    childrenLoading.value = true
    const nextPage = childrenPage.value + 1
    const res = await fetch(`${baseUrl}/api/v1/folders/${selectedId.value}/children?page=${nextPage}&per_page=${childrenPerPage.value}`)
    const data = await res.json()
    children.value = children.value.concat(data.items)
    childrenTotal.value = data.total
    childrenPage.value = data.page
    childrenLoading.value = false
  }

  function getParent(id: string | null): string | null {
    if (!id) return null
    return parentMap.value[id] ?? null
  }

  return { tree, children, selectedId, searchQuery, treePage, treePerPage, treeTotal, treeLoading, childrenPage, childrenPerPage, childrenTotal, childrenLoading, loadTree, loadMoreTree, loadChildren, loadMoreChildren, getParent }
})
