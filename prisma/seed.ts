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
  const documentsId = crypto.randomUUID()
  const picturesId = crypto.randomUUID()
  const reportsId = crypto.randomUUID()

  await prisma.item.createMany({
    data: [
      { id: rootId, name: "root", parent_id: null, is_file: false },
      { id: documentsId, name: "Documents", parent_id: rootId, is_file: false },
      { id: picturesId, name: "Pictures", parent_id: rootId, is_file: false },
      { id: reportsId, name: "Reports", parent_id: documentsId, is_file: false },
      {
        id: crypto.randomUUID(),
        name: "Q1.pdf",
        parent_id: reportsId,
        is_file: true,
        size: BigInt(123456),
        file_path: "/files/Q1.pdf"
      },
      {
        id: crypto.randomUUID(),
        name: "photo.jpg",
        parent_id: picturesId,
        is_file: true,
        size: BigInt(98765),
        file_path: "/files/photo.jpg"
      }
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
