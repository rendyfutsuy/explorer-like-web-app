import { Elysia, t } from "elysia"
import { ItemRepository } from "../repositories/item.repository"

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
      const page = Number(query?.page ?? 1)
      const perPage = Number(query?.per_page ?? 10)
      const repo = new ItemRepository()
      const { items, total } = await repo.findPaged(q, page, perPage)
      return { items, page, per_page: perPage, total }
    },
    {
      detail: {
        summary: "Search items",
        description: "Mencari item (file/folder) berdasarkan kata kunci",
        tags: ["items"]
      },
      query: t.Object({
        q: t.Optional(t.String()),
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
