# OpenQuant (QuantPad recreation)

Monorepo scaffold based on `quantpad_recreation_guide.md`.

## Local dev

- Copy env files:
  - `cp apps/web/.env.example apps/web/.env.local`
  - `cp apps/api/.env.example apps/api/.env`
- Start Postgres + Redis (Homebrew or Docker)
- Install deps:
  - `npm install`
  - `python3 -m pip install -r apps/api/requirements.txt`
- Prisma (dev):
  - `npx prisma generate`
  - `DATABASE_URL=postgresql://... npx prisma db push`
- Run:
  - Web: `npm --workspace apps/web run dev` (http://localhost:3000)
  - API: `cd apps/api && PYTHONPATH=\"$PWD\" uvicorn app.main:app --reload --port 8000` (http://localhost:8000)

Tip: visit `/library` and click “Seed samples” to populate starter templates.

Env templates:
- `apps/web/.env.example`
- `apps/api/.env.example`

## Docker

- `docker compose up --build`
