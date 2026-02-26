# Up**2**Speed

A real-time tech intelligence dashboard that aggregates content from seven sources into one clean interface. Filter by topic tags, adjust the time range, customize your feeds, and stay on top of what matters in the tech ecosystem.

![MIT License](https://img.shields.io/badge/license-MIT-blue.svg)

## Sources

- **Hacker News** — Top stories and discussions
- **GitHub Trending** — Repositories gaining traction
- **Reddit** — Posts from r/programming, r/machinelearning, r/webdev, r/devops, r/rust, r/golang
- **Dev.to** — Community articles
- **ArXiv** — Latest AI/ML research papers
- **Lobsters** — Curated tech links
- **Podcasts** — Episodes from The Changelog, Syntax, Go Time, Ship It!, JS Party, Practical AI, Software Engineering Daily, and CoRecursive

## Features

- **Tag filtering** — 11 built-in tags (AI Agents, LLMs, Robotics, Web Dev, Rust, Go, DevOps, Security, Open Source, Data & ML, Systems) with keyword matching. Add your own custom tags.
- **Time range** — Filter items from the last 24 hours, 7 days, 14 days, or 30 days.
- **Customizable** — Add or remove podcast feeds, toggle source visibility, and create custom tags. All settings persist in localStorage.
- **Search** — Full-text search across all sources with keyboard shortcut (`/` or `Ctrl+K`).
- **Auto-refresh** — Data refreshes every 60 seconds with server-side caching (5 minutes).
- **Desktop app** — Runs as a native app via Tauri on macOS, Windows, and Linux.
- **Web deploy** — Ships to Vercel with serverless API functions.

## Tech Stack

- **Frontend**: React 19, TypeScript 5.9, Vite 7
- **Server**: Express 5 with shared TypeScript library
- **Desktop**: Tauri v2 (Rust shell)
- **Serverless**: Vercel edge functions with `s-maxage=300` caching
- **RSS parsing**: fast-xml-parser

## Quick Start

```bash
git clone https://github.com/intertwinehq/up2speed.git
cd up2speed
npm install
make dev
```

This starts the Vite dev server on `http://localhost:5173` and the Express API server concurrently.

## Project Structure

```
up2speed/
├── lib/                  # Shared TypeScript library (types, fetchers, tags)
│   ├── types.ts          # All type definitions
│   ├── tags.ts           # Tag definitions and keyword matching
│   ├── index.ts          # Re-exports
│   └── fetchers/         # Data fetchers for each source
│       ├── hn.ts
│       ├── github.ts
│       ├── reddit.ts
│       ├── devto.ts
│       ├── arxiv.ts
│       ├── lobsters.ts
│       ├── podcasts.ts
│       └── index.ts      # Orchestrator (Promise.allSettled)
├── server/               # Express API server
│   ├── index.ts
│   ├── routes.ts
│   └── store.ts          # In-memory data store with TTL caching
├── src/                  # React frontend
│   ├── App.tsx
│   ├── main.tsx
│   ├── api.ts
│   ├── types.ts
│   ├── utils.ts
│   ├── index.css
│   └── components/
│       ├── Header.tsx
│       ├── Dashboard.tsx
│       ├── Panel.tsx
│       ├── TagBar.tsx
│       ├── Settings.tsx
│       ├── SearchResults.tsx
│       └── Footer.tsx
├── api/                  # Vercel serverless functions
│   ├── data.ts
│   ├── search.ts
│   └── refresh.ts
├── src-tauri/            # Tauri desktop app (Rust)
├── public/               # Static assets (favicon)
├── Makefile              # Dev/build/deploy shortcuts
├── tsconfig.json         # Frontend TypeScript config
├── tsconfig.server.json  # Server/lib TypeScript config
└── vite.config.ts        # Vite configuration
```

## Available Commands

| Command | Description |
|---|---|
| `make dev` | Start frontend + API server for local development |
| `make dev-tauri` | Start as a native desktop app (requires Rust) |
| `make build` | TypeScript check + Vite production build |
| `make build-tauri` | Build native desktop binary |
| `make deploy` | Deploy to Vercel |
| `make typecheck` | Run TypeScript compiler checks |
| `make clean` | Remove build artifacts |

## Hosting on Vercel

1. Push to GitHub
2. Import the repo at [vercel.com/new](https://vercel.com/new)
3. Vercel auto-detects the Vite config — no additional setup needed
4. The `api/` directory is picked up as serverless functions automatically

Or deploy from the CLI:

```bash
npm run deploy
```

## Building the Desktop App

You'll need [Rust](https://rustup.rs/) installed.

```bash
# Development mode (hot reload)
make dev-tauri

# Production build
make build-tauri
```

This produces platform-specific binaries: `.dmg` on macOS, `.msi` on Windows, `.AppImage`/`.deb` on Linux.

Automated builds run via GitHub Actions on every version tag — check the [Releases](https://github.com/intertwinehq/up2speed/releases) page for downloads.

## Contributing

Contributions are welcome. Here's how to get started:

1. Fork the repo
2. Create a branch (`git checkout -b my-feature`)
3. Make your changes
4. Run `make typecheck` to verify nothing is broken
5. Commit and push
6. Open a pull request

Some areas where contributions would be especially useful:

- **New data sources** — Add a fetcher in `lib/fetchers/` and register it in `lib/fetchers/index.ts`
- **New tags** — Add entries to `DEFAULT_TAGS` in `lib/tags.ts`
- **New podcast feeds** — Add to `DEFAULT_FEEDS` in `lib/fetchers/podcasts.ts`
- **UI improvements** — All styles live in `src/index.css`
- **Tests** — There aren't any yet

## License

[MIT](LICENSE)
