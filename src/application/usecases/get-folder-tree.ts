import { FolderRepository } from "../../infrastructure/repositories/folder.repository"
import type { FolderNode } from "../../domain/folder.entity"

export async function getFolderTree(): Promise<FolderNode[]> {
  const repo = new FolderRepository()
  return repo.getFolderTree()
}
