import { fetchAllSources, analyzeTrends, SOURCE_META } from '../lib'
import type { AppData, SourceStatus, SourceType } from '../lib'

export class DataStore {
  private data: AppData = {
    sources: { hn: [], github: [], reddit: [], devto: [], arxiv: [], lobsters: [], podcasts: [] },
    trends: [],
    status: {},
    source_meta: SOURCE_META,
    last_update: null,
  }
  private refreshing = false

  async refresh(): Promise<void> {
    if (this.refreshing) return
    this.refreshing = true

    try {
      const { sources, status } = await fetchAllSources()
      const trends = analyzeTrends(sources)

      this.data = {
        sources,
        trends,
        status,
        source_meta: SOURCE_META,
        last_update: new Date().toISOString(),
      }

      const ok = Object.values(status).filter((s) => s.ok).length
      console.log(`[Up2Speed] ${ok}/${Object.keys(status).length} sources OK | ${trends.length} trends`)
    } catch (err) {
      console.error('[Up2Speed] refresh error:', err)
    } finally {
      this.refreshing = false
    }
  }

  getData(): AppData {
    return this.data
  }

  search(query: string): { results: any[]; count: number; query: string } {
    const q = query.toLowerCase().trim()
    if (!q) return { results: [], count: 0, query: '' }

    const results: any[] = []
    const meta = SOURCE_META

    for (const [src, items] of Object.entries(this.data.sources) as [SourceType, any[]][]) {
      for (const item of items) {
        const text = [
          item.title ?? '',
          item.description ?? '',
          item.summary ?? '',
          item.podcast ?? '',
          ...(item.tags ?? []),
          ...(item.topics ?? []),
        ]
          .join(' ')
          .toLowerCase()

        if (text.includes(q)) {
          results.push({
            ...item,
            _source: src,
            _source_label: meta[src].label,
            _source_color: meta[src].color,
          })
        }
      }
    }

    return { results: results.slice(0, 50), count: results.length, query: q }
  }
}
