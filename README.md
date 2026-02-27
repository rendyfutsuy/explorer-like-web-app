# Explorer-like Web App

## Instalasi
- Prasyarat:
  - Bun terpasang di mesin (versi terbaru disarankan)
  - PostgreSQL berjalan dan kredensial siap
- Clone repo:
  ```bash
  git clone git@github.com:rendyfutsuy/explorer-like-web-app.git
  cd explorer-like-web-app
  ```
- Install dependencies (terpusat di root):
  ```bash
  bun install
  ```
- Buat file `.env` di root:
  ```
  PORT=8081
  DATABASE_HOST=localhost
  DATABASE_PORT=5432
  DATABASE_USER=...
  DATABASE_PASSWORD=...
  DATABASE_DB_NAME=...
  DATABASE_SSLMODE=disable
  ```
- Jalankan migrasi & seed:
  ```bash
  bun run prisma:migrate
  bun run prisma:seed
  ```
- Jalankan server:
  ```bash
  # Backend (root)
  bun run dev:backend
  # Frontend (root)
  bun run dev:frontend
  ```
- Akses:
  - Backend: `http://localhost:8081`
  - Frontend: `http://localhost:5173`

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
# dari root
bun run dev:frontend
```
Akses di `http://localhost:5173`. Frontend melakukan request ke backend base URL `http://localhost:8081`.
