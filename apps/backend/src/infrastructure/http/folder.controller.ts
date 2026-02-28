import { Elysia, t } from "elysia"
import { getFolderTree } from "../../application/usecases/get-folder-tree"
import { getFolderChildren } from "../../application/usecases/get-folder-children"

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
    size: t.Optional(t.Number()),
    file_path: t.Optional(t.String())
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
    async ({ params }) => {
      const data = await getFolderChildren(params.id)
      return data
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
      response: {
        200: t.Array(itemRecordSchema)
      }
    }
  )
}
