import { describe, it, expect, vi } from 'vitest'
import { getFolderChildren } from '../get-folder-children'
import { getFolderTree } from '../get-folder-tree'
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
        size: BigInt(1024),
        file_path: '/files/file1.txt'
      },
      {
        id: '2',
        name: 'subfolder',
        parent_id: 'folder1',
        is_file: false,
        size: null,
        file_path: null
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
