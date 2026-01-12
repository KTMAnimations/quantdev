# OpenQuant (QuantPad recreation)

Monorepo scaffold based on `quantpad_recreation_guide.md`.

## Local dev

- Web: `npm --workspace apps/web run dev`
- API: `cd apps/api && uvicorn app.main:app --reload --port 8000`

Env templates:
- `apps/web/.env.example`
- `apps/api/.env.example`

## Docker

- `docker compose up --build`
