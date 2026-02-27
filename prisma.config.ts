import "dotenv/config"
import { defineConfig } from "prisma/config"

function buildDatabaseUrl() {
  const host = process.env.DATABASE_HOST
  const port = process.env.DATABASE_PORT
  const user = process.env.DATABASE_USER
  const password = process.env.DATABASE_PASSWORD
  const dbname = process.env.DATABASE_DB_NAME
  const sslmode = process.env.DATABASE_SSLMODE ?? "disable"
  if (host && port && user && password && dbname) {
    return `postgresql://${user}:${password}@${host}:${port}/${dbname}?schema=public&sslmode=${sslmode}`
  }
  return process.env.DATABASE_URL ?? ""
}

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations"
  },
  datasource: {
    url: buildDatabaseUrl()
  }
})
