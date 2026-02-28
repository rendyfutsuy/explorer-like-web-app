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
  const items: Array<{
    id: string
    name: string
    parent_id: string | null
    is_file: boolean
    size?: bigint | null
    file_path?: string | null
  }> = []

  let fileSeq = 1
  for (let r = 1; r <= 20; r++) {
    const rootId = crypto.randomUUID()
    items.push({ id: rootId, name: `root-${r}`, parent_id: null, is_file: false })

    for (let c = 1; c <= 20; c++) {
      const childId = crypto.randomUUID()
      items.push({ id: childId, name: `folder-${r}-${c}`, parent_id: rootId, is_file: false })

      for (let s = 1; s <= 2; s++) {
        const subId = crypto.randomUUID()
        items.push({ id: subId, name: `folder-${r}-${c}-${s}`, parent_id: childId, is_file: false })

        for (let f = 1; f <= 2; f++) {
          const fileId = crypto.randomUUID()
          const size = BigInt(10_000 + (fileSeq % 90_000))
          items.push({
            id: fileId,
            name: `file-${r}-${c}-${s}-${f}.txt`,
            parent_id: subId,
            is_file: true,
            size,
            file_path: `/files/file-${r}-${c}-${s}-${f}.txt`
          })
          fileSeq++
        }
      }
    }

    for (let rf = 1; rf <= 15; rf++) {
      const fileId = crypto.randomUUID()
      const size = BigInt(10_000 + (fileSeq % 90_000))
      items.push({
        id: fileId,
        name: `file-${r}-${rf}.txt`,
        parent_id: rootId,
        is_file: true,
        size,
        file_path: `/files/file-${r}-${rf}.txt`
      })
      fileSeq++
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
