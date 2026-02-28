import { FolderRepository } from "../../infrastructure/repositories/folder.repository"
import type { ItemRecord } from "@repo/shared-types"

export async function getFolderChildren(
  id: string,
  repo: Pick<FolderRepository, "getChildren"> = new FolderRepository()
): Promise<ItemRecord[]> {
  return repo.getChildren(id)
}
