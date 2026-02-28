import { Elysia, t } from "elysia"
import { getItemsIndex } from "../../application/usecases/get-items-index"

export function registerItemController(app: Elysia): void {
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
    "/api/v1/items",
    async ({ query }) => {
      const q = typeof query?.q === "string" ? query.q : undefined
      const rows = await getItemsIndex(q)
      return rows
    },
    {
      detail: {
        summary: "Search items",
        description: "Mencari item (file/folder) berdasarkan kata kunci",
        tags: ["items"]
      },
      query: t.Object({
        q: t.Optional(t.String())
      }),
      response: {
        200: t.Array(itemRecordSchema)
      }
    }
  )
}
