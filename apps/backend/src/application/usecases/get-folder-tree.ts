import { FolderRepository } from "../../infrastructure/repositories/folder.repository"
import type { FolderNode } from "@repo/shared-types"

export async function getFolderTree(
  repo: Pick<FolderRepository, "getFolderTree"> = new FolderRepository()
): Promise<FolderNode[]> {
  return repo.getFolderTree()
}
