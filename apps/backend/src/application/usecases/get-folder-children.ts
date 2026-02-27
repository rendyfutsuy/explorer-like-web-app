import { FolderRepository } from "../../infrastructure/repositories/folder.repository"
import type { FolderRecord, FileRecord } from "@repo/shared-types"

export async function getFolderChildren(id: string): Promise<{ folders: FolderRecord[]; files: FileRecord[] }> {
  const repo = new FolderRepository()
  return repo.getChildren(id)
}
