import type { Sources, SourceStatus, SourceType } from '../types.js'
import { fetchHN } from './hn.js'
import { fetchGitHub } from './github.js'
import { fetchWired, fetchArsTechnica, fetchTechCrunch } from './technews.js'
import { fetchDevto } from './devto.js'
import { fetchArxiv } from './arxiv.js'
import { fetchLobsters } from './lobsters.js'
import { fetchPodcasts } from './podcasts.js'

export interface FetchResult {
  sources: Sources
  status: Record<string, SourceStatus>
}

const FETCHERS: Record<SourceType, () => Promise<any[]>> = {
  hn: fetchHN,
  github: fetchGitHub,
  wired: fetchWired,
  arstechnica: fetchArsTechnica,
  techcrunch: fetchTechCrunch,
  devto: fetchDevto,
  arxiv: fetchArxiv,
  lobsters: fetchLobsters,
  podcasts: fetchPodcasts,
}

// Wrap each fetcher with its own timeout so one slow source can't stall everything
function withTimeout<T>(fn: () => Promise<T>, ms: number): () => Promise<T> {
  return () =>
    Promise.race([
      fn(),
      new Promise<T>((_, reject) =>
        setTimeout(() => reject(new Error(`Source timeout after ${ms}ms`)), ms)
      ),
    ])
}

export async function fetchAllSources(): Promise<FetchResult> {
  const keys = Object.keys(FETCHERS) as SourceType[]
  const start = Date.now()

  // 8s per source, all in parallel. Worst case: 8s total, not 8s * 7.
  const results = await Promise.allSettled(
    keys.map((k) => withTimeout(FETCHERS[k], 8000)())
  )

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
