## A ToDo App

This project is a small full‑stack todo application built with:

- **Backend**: NestJS + TypeORM (users, todos)
- **Frontend**: Next.js App Router (todo UI with auth)

Use the backend README and frontend README for detailed commands:

- Backend: `backend/README.md`
- Frontend: `frontend/README.md`

## How to Run

Start the database (Docker only):

```bash
docker compose up -d
```

Start the backend (opens another terminal):

```bash
cd backend
cp .env.example .env
npm install
npm run start:dev
```

Start the frontend (opens another terminal):

```bash
cd frontend
cp .env.example .env.local
npm install
npm run dev
```

Open http://localhost:3000 in your browser. Register, log in, and manage your todos.

The database schema will auto-sync when the backend starts.

