import type { VercelRequest, VercelResponse } from '@vercel/node'
import { fetchAllSources, SOURCE_META } from '../lib'
import type { SourceType } from '../lib'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const q = ((req.query.q as string) ?? '').toLowerCase().trim()
  if (!q) return res.status(200).json({ results: [], count: 0, query: '' })

  try {
    const { sources } = await fetchAllSources()
    const results: any[] = []

    for (const [src, items] of Object.entries(sources) as [SourceType, any[]][]) {
      for (const item of items) {
        const text = [item.title ?? '', item.description ?? '', item.summary ?? '', ...(item.tags ?? []), ...(item.topics ?? [])].join(' ').toLowerCase()
        if (text.includes(q)) {
          results.push({ ...item, _source: src, _source_label: SOURCE_META[src].label, _source_color: SOURCE_META[src].color })
        }
      }
    }

    res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=86400')
    res.status(200).json({ results: results.slice(0, 50), count: results.length, query: q })
  } catch (err) {
    res.status(500).json({ error: String(err) })
  }
}
