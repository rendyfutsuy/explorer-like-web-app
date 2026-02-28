import { Elysia, t } from "elysia"
import { getFolderTree } from "../../application/usecases/get-folder-tree"
import { getFolderChildren } from "../../application/usecases/get-folder-children"
import { FolderRepository } from "../repositories/folder.repository"

export function registerFolderController(app: Elysia): void {
  const folderNodeSchema = t.Object({
    id: t.String(),
    name: t.String(),
    children: t.Array(t.Unknown())
  })
  const itemRecordSchema = t.Object({
    id: t.String(),
    name: t.String(),
    parent_id: t.Union([t.String(), t.Null()]),
    is_file: t.Boolean(),
    size: t.Union([t.Number(), t.Null()]),
    file_path: t.Union([t.String(), t.Null()]),
    created_at: t.Date()
  })

  app.get(
    "/api/v1/folders/tree",
    async () => {
      const tree = await getFolderTree()
      return tree
    },
    {
      detail: {
        summary: "Get folder tree",
        description: "Mengambil seluruh struktur folder sebagai tree",
        tags: ["folders"]
      },
      response: {
        200: t.Array(folderNodeSchema)
      }
    }
  )

  app.get(
    "/api/v1/folders/:id/children",
    async ({ params, query }) => {
      const page = Number(query?.page ?? 1)
      const perPage = Number(query?.per_page ?? 25)
      const repo = new FolderRepository()
      const { items, total } = await repo.getChildrenPaged(params.id, page, perPage)
      return {
        items,
        page,
        per_page: perPage,
        total
      }
    },
    {
      detail: {
        summary: "Get folder children",
        description: "Mengambil daftar item (file/folder) di dalam folder tertentu",
        tags: ["folders"]
      },
      params: t.Object({
        id: t.String()
      }),
      query: t.Object({
        page: t.Optional(t.Number()),
        per_page: t.Optional(t.Number())
      }),
      response: {
        200: t.Object({
          items: t.Array(itemRecordSchema),
          page: t.Number(),
          per_page: t.Number(),
          total: t.Number()
        })
      }
    }
  )
}
