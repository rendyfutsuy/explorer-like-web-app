import { prisma } from "../database/prisma"
import type { ItemRecord } from "@repo/shared-types"

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

export class ItemRepository {
  async findAll(q?: string): Promise<ItemRecord[]> {
    const rows: ItemRow[] = await prisma.item.findMany({
      where: q ? { name: { contains: q, mode: "insensitive" } } : undefined,
      select: { id: true, name: true, parent_id: true, size: true, file_path: true, is_file: true, created_at: true, updated_at: true },
      orderBy: { name: "asc" }
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
}
