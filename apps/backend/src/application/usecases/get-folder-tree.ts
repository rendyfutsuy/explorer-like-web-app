import { FolderRepository } from "../../infrastructure/repositories/folder.repository"
import type { FolderNode } from "@repo/shared-types"

export async function getFolderTree(): Promise<FolderNode[]> {
  const repo = new FolderRepository()
  return repo.getFolderTree()
}
