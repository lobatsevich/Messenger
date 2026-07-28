# Messenger (FastAPI Backend)

A real-time messenger backend built with FastAPI, SQLAlchemy, PostgreSQL, Alembic, and JWT auth.

Current status:
- Backend is the source of truth and is actively used.
- Static frontend assets are served from `app/static`.

## Features

- JWT authentication (`/auth/register`, `/auth/login`, `/auth/me`)
- Private chat creation (`/chats/private`)
- Chat list for current user (`/chats`)
- Message history (`/chats/{chat_id}/messages`)
- Send message (`POST /chats/{chat_id}/messages`)
- Mark chat messages as read (`PATCH /chats/{chat_id}/read`)
- WebSocket endpoint for live events (`/ws?token=...`)
- Real-time broadcast of `new_message` events to chat members

## Tech Stack

- FastAPI
- SQLAlchemy 2.x (sync engine)
- PostgreSQL
- Alembic migrations
- Pydantic
- python-jose (JWT)
- Argon2 (password hashing)

## Project Layout

```text
app/
  api/                # REST routes
  database/           # engine, session, models
  repositories/       # data access layer
  services/           # business logic layer
  schemas/            # pydantic DTOs
  static/             # static frontend (HTML/CSS/JS)
  websocket/          # websocket router/auth/manager/notifier
alembic/              # migrations
```

## How It Works

### HTTP flow

1. Client authenticates via `/auth/login`.
2. Backend returns JWT `access_token`.
3. Client sends `Authorization: Bearer <token>` to protected endpoints.
4. Chat and message operations are handled by service/repository layers.

### WebSocket flow

1. Client opens WebSocket connection to `/ws?token=<jwt>`.
2. Backend validates token in websocket auth layer.
3. Connection manager stores active sockets by user id.
4. On message creation, notifier sends `new_message` event to all chat members currently online.

Example event payload:

```json
{
  "type": "new_message",
  "message": {
    "id": 123,
    "chat_id": 1,
    "sender_id": 2,
    "content": "Hello",
    "created_at": "2026-07-29T10:20:00Z",
    "edited": false,
    "is_read": false
  }
}
```

## Environment Variables

Create `.env` in the repo root.

Required:

- `DATABASE_URL`
- `SECRET_KEY`

Recommended in Docker mode:

- `POSTGRES_DB`
- `POSTGRES_USER`
- `POSTGRES_PASSWORD`

Example for Docker:

```env
SECRET_KEY=replace-with-a-long-random-secret
DEBUG=True
POSTGRES_DB=messenger
POSTGRES_USER=messenger
POSTGRES_PASSWORD=messenger
DATABASE_URL=postgresql+psycopg2://messenger:messenger@db:5432/messenger
```

Example for local (no Docker DB service):

```env
DATABASE_URL=postgresql://your_db_user:your_db_password@localhost:5432/messenger
SECRET_KEY=your_secret_key
DEBUG=True
```

Important:
- In Docker, DB host should be `db` (service name).
- In local run, DB host is usually `localhost`.

## Run Locally (without Docker)

1. Create and activate venv.
2. Install dependencies from `requirements.txt`.
3. Configure `.env`.
4. Run migrations.
5. Start server.

Typical command sequence (PowerShell):

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
alembic upgrade head
python -m uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

Open:
- `http://127.0.0.1:8000/`
- `http://127.0.0.1:8000/auth`

## Run with Docker

Prerequisites:
- Docker Desktop installed and running
- Virtualization enabled in BIOS/UEFI

Start:

```bash
docker compose up --build
```

Stop:

```bash
docker compose down
```

Stop and remove DB volume:

```bash
docker compose down -v
```

Useful:

```bash
docker compose logs -f app
docker compose logs -f db
docker compose exec app alembic upgrade head
```

## Docker Files in This Repo

- `Dockerfile`:
  - Uses `python:3.13-slim`
  - Installs runtime dependency `libpq5`
  - Converts UTF-16 `requirements.txt` to UTF-8 before `pip install`
  - Runs `alembic upgrade head` then starts Uvicorn

- `docker-compose.yml`:
  - `db` service: PostgreSQL 16
  - `app` service: FastAPI container
  - Healthcheck for PostgreSQL
  - App waits for healthy DB before start

- `.dockerignore`:
  - Excludes caches, venvs, node_modules, and other unnecessary files from build context

## GitHub and Secrets

- Commit `.env.example` to GitHub: yes, recommended.
- Do NOT commit real `.env` with secrets.
- Keep `.env` in `.gitignore`.

## Testing Status and Plan

Current state:
- In this snapshot, there is no active test suite in the repository tree.

Should tests be added?
- Yes. For a messenger backend with auth, chat membership, and websocket notifications, tests are strongly recommended.

Suggested minimum test layers:

1. Unit tests
- Service-layer validation (chat access, message rules, auth edge cases).

2. API integration tests
- Auth flow (`register -> login -> /auth/me`), chat/message endpoints, read status updates.

3. WebSocket integration tests
- Connect with JWT, send message through HTTP, verify `new_message` arrives via WS.

Suggested tools:
- `pytest`
- `httpx` (for async test client)
- test database setup (separate DB/schema)

## Roadmap

### Phase 1: Stabilize current backend

- Harden error handling and input validation
- Improve logging and observability
- Add baseline automated tests (unit + API)

### Phase 2: Real-time improvements

- Typing indicators event flow
- Presence (online/offline) tracking
- Better reconnect behavior and delivery guarantees

### Phase 3: Frontend refactor/migration (planned)

- Introduce a React-based frontend as the next iteration
- Introduce centralized client state management
- Formalize API/WS client layers
- Preserve backward compatibility during transition

This is planned as a frontend refactor/migration, not a full rewrite from zero.

### Phase 4: Quality and deployment

- CI for lint/tests/migrations checks
- Container hardening and production env profiles
- Basic monitoring and runtime diagnostics

## Notes

- This project was originally implemented as a Node.js prototype and later migrated to FastAPI.
- The backend currently serves static pages from `app/static`.
- Docker files can be safely committed even before local virtualization is enabled.
