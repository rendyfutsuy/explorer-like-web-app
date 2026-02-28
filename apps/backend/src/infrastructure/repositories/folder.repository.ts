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

  async getFolderTree(): Promise<FolderNode[]> {
    const folders = await this.getAllFolders()
    const childrenMap = new Map<string | null, FolderRecord[]>()
    for (const f of folders) {
      const key = f.parent_id ?? null
      const arr = childrenMap.get(key) ?? []
      arr.push(f)
      childrenMap.set(key, arr)
    }
    const build = (parentId: string | null): FolderNode[] => {
      const list = childrenMap.get(parentId) ?? []
      return list.map((f: FolderRecord) => ({
        id: f.id,
        name: f.name,
        children: build(f.id)
      }))
    }
    return build(null)
  }

  async getChildren(folderId: string): Promise<ItemRecord[]> {
    const rows: ItemRow[] = await prisma.item.findMany({
      where: { parent_id: folderId },
      select: { id: true, name: true, parent_id: true, size: true, file_path: true, is_file: true, created_at: true, updated_at: true },
      orderBy: [{ is_file: "asc" }, { name: "asc" }]
    })
    return rows.map((r: ItemRow) => ({
      id: r.id,
      name: r.name,
      parent_id: r.parent_id ?? null,
      size: r.size != null ? Number(r.size) : null,
      file_path: r.file_path,
      is_file: r.is_file,
      created_at: r.created_at
    }))
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
