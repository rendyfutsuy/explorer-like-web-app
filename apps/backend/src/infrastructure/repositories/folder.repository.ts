import { prisma } from "../database/prisma"
import type { FolderNode, FolderRecord, FileRecord } from "@repo/shared-types"

type FolderRow = {
  id: string
  name: string
  parent_id: string | null
  created_at: Date
  updated_at: Date
}

type FileRow = {
  id: string
  name: string
  folder_id: string
  size: bigint | number
  created_at: Date
}

export class FolderRepository {
  async getAllFolders(): Promise<FolderRecord[]> {
    const rows: FolderRow[] = await prisma.folder.findMany({
      select: { id: true, name: true, parent_id: true, created_at: true, updated_at: true }
    })
    return rows.map((r: FolderRow) => ({
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

  async getChildren(folderId: string): Promise<{ folders: FolderRecord[]; files: FileRecord[] }> {
    const folders: FolderRow[] = await prisma.folder.findMany({
      where: { parent_id: folderId },
      select: { id: true, name: true, parent_id: true, created_at: true, updated_at: true }
    })
    const files: FileRow[] = await prisma.file.findMany({
      where: { folder_id: folderId },
      select: { id: true, name: true, folder_id: true, size: true, created_at: true }
    })
    return {
      folders: folders.map((f: FolderRow) => ({
        id: f.id,
        name: f.name,
        parent_id: f.parent_id ?? null,
        created_at: f.created_at,
        updated_at: f.updated_at
      })),
      files: files.map((fl: FileRow) => ({
        id: fl.id,
        name: fl.name,
        folder_id: fl.folder_id,
        size: Number(fl.size),
        created_at: fl.created_at
      }))
    }
  }
}
