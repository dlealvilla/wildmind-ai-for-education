# Wildmind Education — AI LMS

Multi-tenant learning management system for written assessments with an integrated AI writing assistant. Students draft in a TipTap rich-text editor beside a Gemini-powered chat panel; teachers open or close assessments, attach brief PDFs, review attempts (including AI chat and insertions), and mark out of 100; admins see tenant users, courses, and stats. Built as a Vite + React SPA with Vercel serverless APIs and PostgreSQL via Prisma.


## Live demo

**https://wildmind-education.vercel.app** (Vercel project `wildmind-education`, production branch `main`)

Mock login — **any password** works. On the login screens, pick a demo user (or use the emails below):

| Role | Demo control | Email |
| --- | --- | --- |
| Teacher | **Dr. Smith** | `teacher@wildmind.edu` |
| Student | **Alice** | `alice@wildmind.edu` |
| Student | **Bob** | `bob@wildmind.edu` |
| Student | **Charlie** | `charlie@wildmind.edu` |

> A second Vercel project (`lms-ai` / lms-ai-sand.vercel.app) also builds from this repo and is being retired — prefer **wildmind-education**.

## Key features

- **Role-based portals** — Student, teacher, and admin experiences with route guards and mock login for demos
- **Multi-tenant data model** — Tenants, users, courses, enrollments, teachers, assessments, and attempts (Prisma / PostgreSQL)
- **Assessment workspace** — TipTap editor + AI chat; paste/drop blocked for integrity; AI-inserted text tracked; autosave of document, chat, and insertions
- **Teacher controls** — Course roster and assessments; open/close status with audit history; due dates and auto-close; PDF brief upload (Vercel Blob); attempt review and marks (0–100)
- **Admin dashboard** — Tenant user list, courses, and aggregate stats
- **Cron auto-close** — Due assessments can be closed automatically (`/api/cron/auto-close-assessments`)
- **Theme** — Day/night UI via app shell

## Tech stack

| Layer | Choices |
| --- | --- |
| Frontend | React 19, TypeScript, Vite 7, React Router 7, Tailwind CSS 4, shadcn/ui (Radix), Lucide |
| Editor / AI | TipTap, Google Generative AI (Gemini 2.5 Flash via `/api/chat`) |
| Backend | Vercel serverless functions (`api/`), mock Bearer tokens |
| Data | PostgreSQL, Prisma 6 |
| Storage | Vercel Blob (assessment PDFs) |
| Deploy | Vercel (`vercel.json` SPA + API rewrites) |

## Architecture

```mermaid
flowchart LR
  Browser["React SPA\n(Vite)"]
  API["Vercel serverless\n/api/*"]
  DB[(PostgreSQL\nPrisma)]
  Blob[(Vercel Blob)]
  Gemini["Gemini API"]

  Browser -->|"Bearer mock token"| API
  API --> DB
  API --> Blob
  Browser -->|"POST /api/chat"| API
  API --> Gemini
```

**Roles & main routes**

| Role | Routes |
| --- | --- |
| Public | `/`, `/login/:role` |
| Student | `/student/home`, `/student/courses/:courseId`, `.../assessments/:assessmentId` |
| Teacher | `/teacher/home`, `/teacher/courses/:courseId`, student + attempt mark views |
| Admin | `/admin` |

**API surface (high level)** — `/api/auth/mock-login`, `/api/chat`, `/api/health` (DB ping / keep-warm), `/api/student/*`, `/api/teacher/*` (+ `pdf-upload`), `/api/admin/*`, `/api/cron/auto-close-assessments`.

## Getting started

### Prerequisites

- Node.js 20+ (recommended)
- A PostgreSQL database (local, Neon, or Vercel Postgres)
- Optional: Google AI (Gemini) API key; optional Vercel Blob token for PDF uploads

### Install

```bash
git clone https://github.com/dlealvilla/lms_ai.git
cd lms_ai
npm install
cp .env.example .env
# edit .env — at minimum set DATABASE_URL
```

### Database

```bash
npm run db:generate   # prisma generate
npm run db:push       # push schema (or use db:migrate)
npm run db:seed       # demo tenant "wildmind-academy" + sample users/courses
```

Seed demo emails (password ignored by mock login): `alice@wildmind.edu` / `bob@wildmind.edu` / `charlie@wildmind.edu` (students), `teacher@wildmind.edu`, `admin@wildmind.edu`.

### Run locally

```bash
npm run dev
```

Open the Vite URL (typically `http://localhost:5173` or the port Vite prints). For full API behaviour matching production, deploy to Vercel or run the serverless handlers with the Vercel CLI (`vercel dev`) so `/api/*` is available.

### Useful scripts

| Script | Purpose |
| --- | --- |
| `npm run dev` | Vite frontend |
| `npm run build` | Typecheck + production build |
| `npm run db:studio` | Prisma Studio |
| `npm run lint` | ESLint |

## Environment variables

Names and purpose only — never commit real values. See `.env.example`.

| Variable | Purpose |
| --- | --- |
| `DATABASE_URL` | PostgreSQL connection string for Prisma (prefer Neon **pooled** URL; `connect_timeout` is added automatically if missing) |
| `GEMINI_API_KEY` | **Server-only** Gemini key for `/api/chat`. Never use a `VITE_` prefix — that would embed the key in the browser bundle |
| `TOKEN_SECRET` | Required in production (app refuses a weak default). Mock auth tokens are still unsigned base64 today |
| `CRON_SECRET` | Shared secret for `x-cron-secret` on the auto-close cron route |
| `BLOB_READ_WRITE_TOKEN` | Vercel Blob read/write token for assessment PDF upload |
| `NODE_ENV` | Runtime mode (`development` / `production`) |

## Project structure

```
api/                     # Vercel serverless handlers
  auth/mock-login.ts
  chat.ts
  health.ts              # DB ping / keep-warm
  student|teacher|admin/ # role APIs (catch-all [[...path]])
  teacher/pdf-upload.ts
  cron/auto-close-assessments.ts
  lib/auth.ts, lib/db.ts
prisma/
  schema.prisma          # tenants, users, courses, assessments, attempts, …
  seed.ts
src/
  pages/                 # Landing, Login, student|teacher|admin
  components/            # AssessmentWorkspace, Editor, Chat, Layout, ui
  lib/ai, lib/auth, lib/theme, lib/storage
  types/assessment.ts
vercel.json
```

## Screenshots

> Note: these were captured while production CSS was broken; re-shoot after the Tailwind fix is deployed.

| View | Screenshot |
| --- | --- |
| Teacher dashboard | ![Teacher dashboard](docs/screenshots/teacher-dashboard.png) |
| Student home | ![Student home](docs/screenshots/student-home.png) |
| Course with assessments | ![Course with assessments](docs/screenshots/course-assessments.png) |
| Assessment editor with AI panel | ![Assessment editor with AI panel](docs/screenshots/assessment-ai-panel.png) |

## License

TODO: choose a licence (none selected yet).
