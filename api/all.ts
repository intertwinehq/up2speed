import type { VercelRequest, VercelResponse } from '@vercel/node'
import { fetchAllSources, analyzeTrends, SOURCE_META } from '../lib'

export default async function handler(_req: VercelRequest, res: VercelResponse) {
  try {
    const { sources, status } = await fetchAllSources()
    const trends = analyzeTrends(sources)

    res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=86400')
    res.status(200).json({
      sources,
      trends,
      status,
      source_meta: SOURCE_META,
      last_update: new Date().toISOString(),
    })
  } catch (err) {
    res.status(500).json({ error: String(err) })
  }
}
