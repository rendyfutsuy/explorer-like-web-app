import { prisma } from "../database/prisma"
import type { FolderNode, FolderRecord, ItemRecord } from "@repo/shared-types"

type ItemRow = {
  id: string
  name: string
  parent_id: string | null
  size: bigint | number | null
  file_path: string | null
  is_file: boolean
  created_at: Date
  updated_at: Date
}

export class FolderRepository {
  async getAllFolders(): Promise<FolderRecord[]> {
    const rows: ItemRow[] = await prisma.item.findMany({
      where: { is_file: false },
      select: { id: true, name: true, parent_id: true, created_at: true, updated_at: true, size: true, file_path: true, is_file: true }
    })
    return rows.map((r: ItemRow) => ({
      id: r.id,
      name: r.name,
      parent_id: r.parent_id ?? null,
      created_at: r.created_at,
      updated_at: r.updated_at
    }))
  }

  async getRootFoldersPaged(page: number, perPage: number): Promise<{ folders: FolderRecord[]; total: number }> {
    const [rows, total] = await Promise.all([
      prisma.item.findMany({
        where: { is_file: false, parent_id: null },
        select: { id: true, name: true, parent_id: true, created_at: true, updated_at: true, size: true, file_path: true, is_file: true },
        orderBy: [{ name: "asc" }],
        skip: Math.max(0, (page - 1) * perPage),
        take: perPage
      }),
      prisma.item.count({ where: { is_file: false, parent_id: null } })
    ])
    const folders = rows.map((r: ItemRow) => ({
      id: r.id,
      name: r.name,
      parent_id: r.parent_id ?? null,
      created_at: r.created_at,
      updated_at: r.updated_at
    }))
    return { folders, total }
  }


  async getFolderTreePaged(page: number, perPage: number = 10): Promise<{ tree: FolderNode[]; total: number }> {
    const [allFolders, { folders: roots, total }] = await Promise.all([
      this.getAllFolders(),
      this.getRootFoldersPaged(page, perPage)
    ])

    if (roots.length === 0) {
      return { tree: [], total }
    }

    const childrenMap = new Map<string | null, FolderRecord[]>()
    for (const f of allFolders) {
      const key = f.parent_id ?? null
      const arr = childrenMap.get(key) ?? []
      arr.push(f)
      childrenMap.set(key, arr)
    }

    const buildChildren = (parentId: string | null): FolderNode[] => {
      const list = childrenMap.get(parentId) ?? []
      return list.map((f: FolderRecord) => ({
        id: f.id,
        name: f.name,
        children: buildChildren(f.id)
      }))
    }

    const tree = roots.map((root) => ({
      id: root.id,
      name: root.name,
      children: buildChildren(root.id)
    }))

    return { tree, total }
  }

  async getChildrenPaged(folderId: string, page: number, perPage: number): Promise<{ items: ItemRecord[]; total: number }> {
    const [rows, total] = await Promise.all([
      prisma.item.findMany({
        where: { parent_id: folderId },
        select: { id: true, name: true, parent_id: true, size: true, file_path: true, is_file: true, created_at: true, updated_at: true },
        orderBy: [{ is_file: "asc" }, { name: "asc" }],
        skip: Math.max(0, (page - 1) * perPage),
        take: perPage
      }),
      prisma.item.count({ where: { parent_id: folderId } })
    ])
    const items = rows.map((r: ItemRow) => ({
      id: r.id,
      name: r.name,
      parent_id: r.parent_id ?? null,
      size: r.size != null ? Number(r.size) : null,
      file_path: r.file_path,
      is_file: r.is_file,
      created_at: r.created_at
    }))
    return { items, total }
  }
}
