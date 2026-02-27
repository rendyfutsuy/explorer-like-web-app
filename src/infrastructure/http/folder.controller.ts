import { Elysia } from "elysia"
import { getFolderTree } from "../../application/usecases/get-folder-tree"
import { getFolderChildren } from "../../application/usecases/get-folder-children"

export function registerFolderController(app: Elysia): void {
  app.get("/api/v1/folders/tree", async () => {
    const tree = await getFolderTree()
    return tree
  })
  app.get("/api/v1/folders/:id/children", async ({ params }) => {
    const data = await getFolderChildren(params.id)
    return data
  })
}
