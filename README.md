# Explorer-like Web App

## Backend
### Menjalankan Server
```bash
# dari root
bun run dev:backend
```
Default base URL: `http://localhost:8081`

### Environment
Konfigurasi di `.env` (root):
```
PORT=8081
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USER=...
DATABASE_PASSWORD=...
DATABASE_DB_NAME=...
DATABASE_SSLMODE=disable
```

## API
Base: `http://localhost:8081`

### GET /api/v1/folders/tree
- Deskripsi: Mengambil seluruh struktur folder sebagai tree.
- Response: `FolderNode[]`
```json
[
  { "id": "root-id", "name": "root", "children": [
    { "id": "child-a", "name": "Documents", "children": [] }
  ] }
]
```
- Contoh:
```bash
curl http://localhost:8081/api/v1/folders/tree
```

### GET /api/v1/folders/:id/children
- Deskripsi: Mengambil anak-anak dari folder tertentu.
- Params: `id` (string)
- Response:
```json
{
  "folders": [
    { "id": "child-a", "name": "Documents", "parent_id": "root-id" }
  ],
  "files": [
    { "id": "file-1", "name": "photo.jpg", "folder_id": "pictures-id", "size": 98765 }
  ]
}
```
- Contoh:
```bash
curl http://localhost:8081/api/v1/folders/<folderId>/children
```

## Database & Prisma
### Migrasi & Seed
```bash
# dari root (dipipe ke apps/backend)
bun run prisma:migrate
bun run prisma:seed
```
Struktur schema berada di folder `prisma/`. Konfigurasi Prisma di `apps/backend/prisma.config.ts`.

## Frontend
### Menjalankan Frontend
```bash
cd apps/frontend
bun install
bun run dev
```
Akses di `http://localhost:5173`. Frontend melakukan request ke backend base URL `http://localhost:8081`.
