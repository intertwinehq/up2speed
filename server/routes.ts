import { Router, type Request, type Response } from 'express'
import type { DataStore } from './store'

export function createRoutes(store: DataStore): Router {
  const router = Router()

  router.get('/api/all', (_req: Request, res: Response) => {
    res.json(store.getData())
  })

  router.get('/api/search', (req: Request, res: Response) => {
    const q = (req.query.q as string) ?? ''
    res.json(store.search(q))
  })

  router.get('/api/trends', (_req: Request, res: Response) => {
    res.json({ trends: store.getData().trends })
  })

  router.get('/api/status', (_req: Request, res: Response) => {
    const d = store.getData()
    res.json({ status: d.status, last_update: d.last_update })
  })

  router.post('/api/refresh', (_req: Request, res: Response) => {
    store.refresh()
    res.json({ ok: true })
  })

  return router
}
