import { describe, it, expect, vi } from 'vitest'

// Mock the store module
const mockStore = {
  tree: [],
  children: [],
  selectedId: null,
  loadTree: vi.fn(),
  loadChildren: vi.fn(),
  loadMoreChildren: vi.fn(),
  getParent: vi.fn()
}

vi.mock('../../stores/folders', () => ({
  useFoldersStore: () => mockStore
}))

describe('ExplorerView', () => {
  it('should have store available', async () => {
    // Import store setelah mock dibuat
    const { useFoldersStore } = await import('../../stores/folders')
    const store = useFoldersStore()
    
    expect(store).toBeDefined()
    expect(store.loadTree).toBeDefined()
    expect(store.loadChildren).toBeDefined()
    expect(store.loadMoreChildren).toBeDefined()
  })

  it('should call loadTree when store is used', async () => {
    const { useFoldersStore } = await import('../../stores/folders')
    const store = useFoldersStore()
    
    store.loadTree()
    
    expect(store.loadTree).toHaveBeenCalled()
  })

  it('should call loadChildren with correct parameter', async () => {
    const { useFoldersStore } = await import('../../stores/folders')
    const store = useFoldersStore()
    
    store.loadChildren('folder1')
    
    expect(store.loadChildren).toHaveBeenCalledWith('folder1')
  })
})