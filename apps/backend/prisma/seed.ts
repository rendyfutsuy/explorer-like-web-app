import { PrismaClient } from "./generated/client"
import { PrismaPg } from "@prisma/adapter-pg"

function buildDatabaseUrl(): string {
  const host = process.env.DATABASE_HOST
  const port = process.env.DATABASE_PORT
  const user = process.env.DATABASE_USER
  const password = process.env.DATABASE_PASSWORD
  const dbname = process.env.DATABASE_DB_NAME
  const sslmode = process.env.DATABASE_SSLMODE ?? "disable"
  return `postgresql://${user}:${password}@${host}:${port}/${dbname}?schema=public&sslmode=${sslmode}`
}

const adapter = new PrismaPg(
  { connectionString: buildDatabaseUrl() },
  { schema: "public" }
)
const prisma = new PrismaClient({ adapter })

async function main() {
  const totalFolders = 500
  const totalFiles = 500

  const items: Array<{
    id: string
    name: string
    parent_id: string | null
    is_file: boolean
    size?: bigint | null
    file_path?: string | null
  }> = []

  const rootId = crypto.randomUUID()
  items.push({ id: rootId, name: "root", parent_id: null, is_file: false })

  let folderCount = 1
  let fileCount = 0
  const queue: string[] = [rootId]

  while ((folderCount < totalFolders || fileCount < totalFiles) && queue.length) {
    const parent = queue.shift()!

    for (let i = 0; i < 5 && folderCount < totalFolders; i++) {
      const id = crypto.randomUUID()
      items.push({ id, name: `folder-${folderCount}`, parent_id: parent, is_file: false })
      queue.push(id)
      folderCount++
    }

    for (let j = 0; j < 2 && fileCount < totalFiles; j++) {
      const id = crypto.randomUUID()
      const size = BigInt(10_000 + (fileCount % 90_000))
      items.push({
        id,
        name: `file-${fileCount}.txt`,
        parent_id: parent,
        is_file: true,
        size,
        file_path: `/files/file-${fileCount}.txt`
      })
      fileCount++
    }
  }

  await prisma.item.createMany({
    data: items,
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
