import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import ExplorerView from '../ExplorerView.vue'
import FolderTree from '../FolderTree.vue'
import RightPanel from '../RightPanel.vue'
import { createPinia, setActivePinia } from 'pinia'
import { useFoldersStore } from '../../stores/folders'

vi.mock('../../stores/folders')

describe('ExplorerView', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('renders sidebar and main panels', () => {
    const mockStore = {
      tree: [],
      children: [],
      selectedId: null,
      loadTree: vi.fn(),
      loadChildren: vi.fn()
    }
    vi.mocked(useFoldersStore).mockReturnValue(mockStore as any)

    const wrapper = mount(ExplorerView)

    expect(wrapper.find('h3').text()).toBe('Folders')
    expect(wrapper.findComponent(FolderTree).exists()).toBe(true)
    expect(wrapper.findComponent(RightPanel).exists()).toBe(true)
  })

  it('loads tree on mount', async () => {
    const mockStore = {
      tree: [],
      children: [],
      selectedId: null,
      loadTree: vi.fn(),
      loadChildren: vi.fn()
    }
    vi.mocked(useFoldersStore).mockReturnValue(mockStore as any)

    mount(ExplorerView)

    expect(mockStore.loadTree).toHaveBeenCalled()
  })

  it('handles folder selection', async () => {
    const mockStore = {
      tree: [],
      children: [],
      selectedId: null,
      loadTree: vi.fn(),
      loadChildren: vi.fn()
    }
    vi.mocked(useFoldersStore).mockReturnValue(mockStore as any)

    const wrapper = mount(ExplorerView)
    const folderTree = wrapper.findComponent(FolderTree)

    await folderTree.vm.$emit('select', 'folder1')

    expect(mockStore.loadChildren).toHaveBeenCalledWith('folder1')
  })

  it('passes correct props to RightPanel', () => {
    const mockStore = {
      tree: [],
      children: [{ id: '1', name: 'file.txt', is_file: true }],
      selectedId: 'folder1',
      loadTree: vi.fn(),
      loadChildren: vi.fn()
    }
    vi.mocked(useFoldersStore).mockReturnValue(mockStore as any)

    const wrapper = mount(ExplorerView)
    const rightPanel = wrapper.findComponent(RightPanel)

    expect(rightPanel.props('items')).toEqual(mockStore.children)
    expect(rightPanel.props('parentId')).toBe('folder1')
  })
})