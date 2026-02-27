import { ItemRepository } from "../../infrastructure/repositories/item.repository"
import type { ItemRecord } from "@repo/shared-types"

export async function getItemsIndex(q?: string): Promise<ItemRecord[]> {
  const repo = new ItemRepository()
  return repo.findAll(q)
}
