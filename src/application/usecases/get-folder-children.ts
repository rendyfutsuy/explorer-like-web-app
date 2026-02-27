import { FolderRepository } from "../../infrastructure/repositories/folder.repository"
import type { FolderRecord } from "../../domain/folder.entity"
import type { FileRecord } from "../../domain/file.entity"

export async function getFolderChildren(id: string): Promise<{ folders: FolderRecord[]; files: FileRecord[] }> {
  const repo = new FolderRepository()
  return repo.getChildren(id)
}
