import { PrismaClient } from "../../../prisma/generated/client"
import { PrismaPg } from "@prisma/adapter-pg"

function buildDatabaseUrl(): string {
  const env = typeof Bun !== "undefined" ? Bun.env : process.env
  const host = env.DATABASE_HOST
  const port = env.DATABASE_PORT
  const user = env.DATABASE_USER
  const password = env.DATABASE_PASSWORD
  const dbname = env.DATABASE_DB_NAME
  const sslmode = env.DATABASE_SSLMODE ?? "disable"
  return `postgresql://${user}:${password}@${host}:${port}/${dbname}?schema=public&sslmode=${sslmode}`
}

const adapter = new PrismaPg(
  { connectionString: buildDatabaseUrl() },
  { schema: "public" }
)

export const prisma = new PrismaClient({ adapter })
