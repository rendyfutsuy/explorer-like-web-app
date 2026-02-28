import { describe, it, expect, vi } from 'vitest'
import { getFolderChildren } from '../get-folder-children'
import { getFolderTree, getFolderTreePaged } from '../get-folder-tree'
import type { ItemRecord, FolderNode } from '@repo/shared-types'
import type { FolderRepository } from '../../../infrastructure/repositories/folder.repository'

describe('getFolderChildren', () => {
  it('should return children items for given folder id', async () => {
    const mockChildren: ItemRecord[] = [
      {
        id: '1',
        name: 'file1.txt',
        parent_id: 'folder1',
        is_file: true,
        size: 1024,
        file_path: '/files/file1.txt',
        created_at: new Date()
      },
      {
        id: '2',
        name: 'subfolder',
        parent_id: 'folder1',
        is_file: false,
        size: null,
        file_path: null,
        created_at: new Date()
      }
    ]

    const mockRepo: Pick<FolderRepository, 'getChildren'> = {
      getChildren: vi.fn().mockResolvedValue(mockChildren)
    }

    const result = await getFolderChildren('folder1', mockRepo)

    expect(mockRepo.getChildren).toHaveBeenCalledWith('folder1')
    expect(result).toEqual(mockChildren)
  })

  it('should return empty array when no children', async () => {
    const mockRepo: Pick<FolderRepository, 'getChildren'> = {
      getChildren: vi.fn().mockResolvedValue([])
    }

    const result = await getFolderChildren('empty-folder', mockRepo)

    expect(mockRepo.getChildren).toHaveBeenCalledWith('empty-folder')
    expect(result).toEqual([])
  })
})

describe('getFolderTree', () => {
  it('should return folder tree structure', async () => {
    const mockTree: FolderNode[] = [
      {
        id: 'root',
        name: 'root',
        children: [
          {
            id: 'folder1',
            name: 'Documents',
            children: []
          }
        ]
      }
    ]

    const mockRepo: Pick<FolderRepository, 'getFolderTree'> = {
      getFolderTree: vi.fn().mockResolvedValue(mockTree)
    }

    const result = await getFolderTree(mockRepo)

    expect(mockRepo.getFolderTree).toHaveBeenCalled()
    expect(result).toEqual(mockTree)
  })

  it('should return empty array when no folders', async () => {
    const mockRepo: Pick<FolderRepository, 'getFolderTree'> = {
      getFolderTree: vi.fn().mockResolvedValue([])
    }

    const result = await getFolderTree(mockRepo)

    expect(mockRepo.getFolderTree).toHaveBeenCalled()
    expect(result).toEqual([])
  })
})

describe('getFolderTreePaged', () => {
  it('should return paginated folder tree with metadata', async () => {
    const mockTree: FolderNode[] = [
      { id: 'a', name: 'A', children: [] },
      { id: 'b', name: 'B', children: [] }
    ]
    const mockRepo: Pick<FolderRepository, 'getFolderTreePaged'> = {
      getFolderTreePaged: vi.fn().mockResolvedValue({ tree: mockTree, total: 42 })
    }
    const page = 2
    const perPage = 10
    const result = await getFolderTreePaged(page, perPage, mockRepo)
    expect(mockRepo.getFolderTreePaged).toHaveBeenCalledWith(page, perPage)
    expect(result.tree).toEqual(mockTree)
    expect(result.total).toEqual(42)
  })

  it('should return empty tree when no folders', async () => {
    const mockRepo: Pick<FolderRepository, 'getFolderTreePaged'> = {
      getFolderTreePaged: vi.fn().mockResolvedValue({ tree: [], total: 0 })
    }
    const result = await getFolderTreePaged(1, 10, mockRepo)
    expect(mockRepo.getFolderTreePaged).toHaveBeenCalledWith(1, 10)
    expect(result.tree).toEqual([])
    expect(result.total).toEqual(0)
  })
})
