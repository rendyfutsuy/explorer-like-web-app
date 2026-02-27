import { PrismaClient } from "./generated/client"
import { PrismaPg } from "@prisma/adapter-pg"

function buildDatabaseUrl(): string {
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

const adapter = new PrismaPg(
  { connectionString: buildDatabaseUrl() },
  { schema: "public" }
)
const prisma = new PrismaClient({ adapter })

async function main() {
  const rootId = crypto.randomUUID()
  const childA = crypto.randomUUID()
  const childB = crypto.randomUUID()
  const subA1 = crypto.randomUUID()

  await prisma.folder.createMany({
    data: [
      { id: rootId, name: "root", parent_id: null },
      { id: childA, name: "Documents", parent_id: rootId },
      { id: childB, name: "Pictures", parent_id: rootId },
      { id: subA1, name: "Reports", parent_id: childA }
    ],
    skipDuplicates: true
  })

  await prisma.file.createMany({
    data: [
      { id: crypto.randomUUID(), name: "Q1.pdf", folder_id: subA1, size: BigInt(123456) },
      { id: crypto.randomUUID(), name: "photo.jpg", folder_id: childB, size: BigInt(98765) }
    ],
    skipDuplicates: true
  })
}

main()
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
