import { FolderRepository } from "../../infrastructure/repositories/folder.repository"
import type { ItemRecord } from "@repo/shared-types"

export async function getFolderChildren(id: string): Promise<ItemRecord[]> {
  const repo = new FolderRepository()
  return repo.getChildren(id)
}
