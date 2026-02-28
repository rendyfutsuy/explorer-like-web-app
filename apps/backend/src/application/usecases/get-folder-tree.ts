import { FolderRepository } from "../../infrastructure/repositories/folder.repository"
import type { FolderNode } from "@repo/shared-types"
export async function getFolderTreePaged(
  page: number,
  perPage: number,
  repo: Pick<FolderRepository, "getFolderTreePaged"> = new FolderRepository()
): Promise<{ tree: FolderNode[]; total: number }> {
  return repo.getFolderTreePaged(page, perPage)
}
