# AGENTS.md — Frontend (Next.js)

## What this is

Next.js 15 + React 19 frontend for OICA, a steel bar cutting optimizer. Single-page-style app that uploads Excel files, shows real-time optimization progress via WebSocket, and lets users download result artifacts (PDF, Excel, PNG).

No authentication. No API routes. All data comes from a Flask backend at `NEXT_PUBLIC_API_URL` (defaults to `http://localhost:5000`).

## Commands

```bash
npm run dev          # Dev server with Turbopack
npm run build        # Production build
npm start            # Start production server (port 3000)
npm run lint         # ESLint (next/core-web-vitals + next/typescript)
```

No test runner, no CI, no pre-commit hooks.

## Key constraints

- **3-space indentation** — Enforced by `.prettierrc` and `.vscode/settings.json`. Do not use 2 or 4 spaces.
- **ESLint and TypeScript errors are ignored during builds** — `next.config.ts` sets `ignoreDuringBuilds: true` and `ignoreBuildErrors: true`. The build will succeed even with type errors.
- **Path alias** — `@/*` maps to `src/*` (via `tsconfig.json` with `baseUrl: "src"`). Use `import X from '@/components/...'`, not relative paths.
- **`NEXT_PUBLIC_API_URL`** — Only env var. Defaults to `http://localhost:5000`. Some legacy components hardcode `http://localhost:5000` instead of using the env var.
- **No `.env` file committed** — Set env vars externally (Docker Compose or shell).
- **Spanish UI, mixed code language** — All user-facing text is in Spanish. Variable names and comments mix English and Spanish. Follow existing conventions.

## Architecture

```
src/
├── app/              # App Router pages (6 routes)
├── components/       # React components (all client-side)
│   └── ui/           # shadcn/ui-style primitives (Button, NavButton)
└── lib/
    ├── socket.ts     # Socket.IO singleton (real-time task progress)
    ├── utils.ts      # cn() = clsx + tailwind-merge
    ├── constants/    # Dead code (legacy AWS)
    └── services/     # Dead code (legacy AWS Lambda)
```

### Routes

| Route | Description |
|---|---|
| `/` | Landing page with hero image |
| `/subir-cartilla` | File upload + profile selector + WebSocket progress |
| `/archivos` | Paginated files table with filters, downloads, live progress |
| `/resultados` | Legacy PDF download (reads from localStorage, semi-orphaned) |
| `/tutorial` | Step-by-step guide, glossary, FAQ |
| `/contact-us` | Contact info + Formspree form |

### Data flow

- **Upload**: `POST /upload` with `FormData` (file + `perfil` param) → returns `task_id`
- **Progress**: Socket.IO `subscribe_task` / `task_update` events, with HTTP polling fallback (every 2s if no WS update for 30s)
- **Downloads**: `GET /descargar-excel/{uuid}`, `/descargar-pdf/{uuid}`, `/descargar-imagen/{uuid}`
- **Listing**: `GET /files?page=&per_page=&search=&status=&perfil=&date_from=&date_to=`
- **No global state** — All state is local `useState`/`useEffect`. Inter-page state uses `localStorage` (fragile).

### Socket.IO (`lib/socket.ts`)

Singleton client connecting to the backend. Auto-reconnects (5 attempts). Components subscribe/unsubscribe to task progress by `taskId`. Used by `FileUpload` and `FilesTable`.

## Dead code

- `src/components/Resultados.js` — Plain JS, not imported anywhere. Superseded by `resultados/page.tsx`.
- `src/lib/constants/services.tsx` and `src/lib/services/lambda.tsx` — Legacy AWS Lambda/S3 references. Not imported by any active code.

## Style and UI

- **Tailwind CSS 3** with CSS variables for `--background`/`--foreground`
- **shadcn/ui pattern** — CVA-based `Button` component with variants (default, destructive, outline, secondary, ghost, link)
- **Lucide React** for icons
- **react-dropzone** for file upload drag-and-drop
- **Geist** + **Geist Mono** fonts (loaded via `next/font/google`)
- Prettier config: single quotes, trailing commas (`es5`), no parens on single arrow params
