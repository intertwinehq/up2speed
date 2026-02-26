import type { HNItem } from '../types'

const API = 'https://hacker-news.firebaseio.com/v0'
const LIMIT = 30
const BATCH = 10

async function fetchStory(id: number): Promise<HNItem | null> {
  try {
    const res = await fetch(`${API}/item/${id}.json`, { signal: AbortSignal.timeout(5000) })
    const it = await res.json()
    if (!it?.title) return null
    return {
      title: it.title,
      url: it.url ?? `https://news.ycombinator.com/item?id=${id}`,
      score: it.score ?? 0,
      comments: it.descendants ?? 0,
      by: it.by ?? '',
      time: it.time ?? 0,
      id,
      discuss_url: `https://news.ycombinator.com/item?id=${id}`,
    }
  } catch {
    return null
  }
}

export async function fetchHN(): Promise<HNItem[]> {
  const res = await fetch(`${API}/topstories.json`, { signal: AbortSignal.timeout(10000) })
  const ids: number[] = (await res.json()).slice(0, LIMIT)

  const items: HNItem[] = []
  for (let i = 0; i < ids.length; i += BATCH) {
    const batch = await Promise.all(ids.slice(i, i + BATCH).map(fetchStory))
    items.push(...batch.filter((x): x is HNItem => x !== null))
  }
  return items
}
