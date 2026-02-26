import type { LobstersItem } from '../types'

const LIMIT = 25

export async function fetchLobsters(): Promise<LobstersItem[]> {
  const res = await fetch('https://lobste.rs/hottest.json', {
    signal: AbortSignal.timeout(5000),
  })
  const stories: any[] = await res.json()

  return stories.slice(0, LIMIT).map((s): LobstersItem => ({
    title: s.title ?? '',
    url: s.url || s.comments_url || '',
    score: s.score ?? 0,
    comments: s.comment_count ?? 0,
    tags: s.tags ?? [],
    submitter: typeof s.submitter_user === 'object'
      ? s.submitter_user?.username ?? ''
      : '',
    discuss_url: s.comments_url ?? '',
    time: s.created_at ?? '',
  }))
}
