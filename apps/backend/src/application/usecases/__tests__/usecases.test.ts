import { describe, it, expect, vi } from 'vitest'
import { getFolderTreePaged } from '../get-folder-tree'
import type { FolderNode } from '@repo/shared-types'
import type { FolderRepository } from '../../../infrastructure/repositories/folder.repository'

// Only testing paginated folder tree usecase

describe('getFolderTreePaged', () => {
  it('should return paginated folder tree with metadata', async () => {
    const mockTree: FolderNode[] = [
      { id: 'a', name: 'A', children: [] },
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
