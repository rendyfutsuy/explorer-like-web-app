import { Elysia } from "elysia"
import { getItemsIndex } from "../../application/usecases/get-items-index"

export function registerItemController(app: Elysia): void {
  app.get("/api/v1/items", async ({ query }) => {
    const q = typeof query?.q === "string" ? query.q : undefined
    const rows = await getItemsIndex(q)
    return rows
  })
}
