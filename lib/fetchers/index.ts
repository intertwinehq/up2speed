import type { Sources, SourceStatus, SourceType } from '../types'
import { fetchHN } from './hn'
import { fetchGitHub } from './github'
import { fetchReddit } from './reddit'
import { fetchDevto } from './devto'
import { fetchArxiv } from './arxiv'
import { fetchLobsters } from './lobsters'
import { fetchPodcasts } from './podcasts'

export interface FetchResult {
  sources: Sources
  status: Record<string, SourceStatus>
}

const FETCHERS: Record<SourceType, () => Promise<any[]>> = {
  hn: fetchHN,
  github: fetchGitHub,
  reddit: fetchReddit,
  devto: fetchDevto,
  arxiv: fetchArxiv,
  lobsters: fetchLobsters,
  podcasts: fetchPodcasts,
}

export async function fetchAllSources(): Promise<FetchResult> {
  const keys = Object.keys(FETCHERS) as SourceType[]
  const start = Date.now()
  const results = await Promise.allSettled(keys.map((k) => FETCHERS[k]()))

  const sources: any = {}
  const status: Record<string, SourceStatus> = {}

  keys.forEach((key, i) => {
    const r = results[i]
    if (r.status === 'fulfilled') {
      sources[key] = r.value
      status[key] = { ok: true, error: '', count: r.value.length, updated: new Date().toISOString() }
    } else {
      sources[key] = []
      status[key] = { ok: false, error: String(r.reason), count: 0, updated: new Date().toISOString() }
    }
  })

  console.log(`[Up2Speed] fetched ${keys.length} sources in ${Date.now() - start}ms`)
  return { sources: sources as Sources, status }
}
