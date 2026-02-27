import { PrismaClient } from "../../../../../prisma/generated/client"
import { PrismaPg } from "@prisma/adapter-pg"

function ensureDatabaseUrl() {
  const env = typeof Bun !== "undefined" ? Bun.env : process.env
  const host = env.DATABASE_HOST
  const port = env.DATABASE_PORT
  const user = env.DATABASE_USER
  const password = env.DATABASE_PASSWORD
  const dbname = env.DATABASE_DB_NAME
  const sslmode = env.DATABASE_SSLMODE ?? "disable"
  if (!process.env.DATABASE_URL) {
    if (host && port && user && password && dbname) {
      process.env.DATABASE_URL = `postgresql://${user}:${password}@${host}:${port}/${dbname}?schema=public&sslmode=${sslmode}`
    }
  }
}

ensureDatabaseUrl()

const adapter = new PrismaPg(
  { connectionString: process.env.DATABASE_URL! },
  { schema: "public" }
)

export const prisma = new PrismaClient({ adapter })
