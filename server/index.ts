import express from 'express'
import path from 'path'
import { existsSync } from 'fs'
import { DataStore } from './store'
import { createRoutes } from './routes'

const PORT = Number(process.env.PORT ?? 5000)
const REFRESH_INTERVAL = 300_000 // 5 minutes

const app = express()
const store = new DataStore()

// Serve Vite build in production
const distDir = path.resolve(import.meta.dirname, '..', 'dist')
if (existsSync(distDir)) {
  app.use(express.static(distDir))
}

// API routes
app.use(createRoutes(store))

// SPA fallback (production)
if (existsSync(distDir)) {
  app.get('/{*path}', (_req, res) => {
    res.sendFile(path.join(distDir, 'index.html'))
  })
}

// Background refresh
async function startPolling() {
  await store.refresh()
  setInterval(() => store.refresh(), REFRESH_INTERVAL)
}

app.listen(PORT, () => {
  const mode = existsSync(distDir) ? 'PRODUCTION' : 'API-ONLY'
  console.log(`
  ┌─────────────────────────────────────────┐
  │  UP2SPEED  ·  Tech Intelligence        │
  │  Mode: ${mode.padEnd(33)}│
  │  API:  http://localhost:${String(PORT).padEnd(18)}│
  └─────────────────────────────────────────┘
  `)
  startPolling()
})
