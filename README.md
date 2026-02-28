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

## Database & Prisma
### Migrasi & Seed
```bash
# dari root (dipipe ke apps/backend)
bun run prisma:migrate
bun run prisma:seed
```
 Struktur schema berada di `apps/backend/prisma/`. Konfigurasi Prisma di `apps/backend/prisma.config.ts`.

## Frontend
### Menjalankan Frontend
```bash
# dari root
bun run dev:frontend
```
Akses di `http://localhost:5173`. Frontend melakukan request ke backend base URL `http://localhost:8081`.

## Testing
- Menjalankan semua test:
  ```bash
  bun test --run
  ```
- Menjalankan test backend saja:
  ```bash
  bun test:backend --run
  ```
- Menjalankan test frontend saja:
  ```bash
  bun test:frontend --run
  ```
- Test UI (opsional):
  ```bash
  bun test:ui
  ```
