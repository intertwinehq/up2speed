import type { HNItem } from '../types'

// Algolia HN API: single request, returns full story objects, has CORS headers.
// No need to fetch 30 individual stories from Firebase.
const API = 'https://hn.algolia.com/api/v1/search'
const LIMIT = 25

export async function fetchHN(): Promise<HNItem[]> {
  const res = await fetch(
    `${API}?tags=front_page&hitsPerPage=${LIMIT}`,
    { signal: AbortSignal.timeout(5000) }
  )
  const data = await res.json()

  return (data.hits ?? []).map((hit: any): HNItem => ({
    title: hit.title ?? '',
    url: hit.url ?? `https://news.ycombinator.com/item?id=${hit.objectID}`,
    score: hit.points ?? 0,
    comments: hit.num_comments ?? 0,
    by: hit.author ?? '',
    time: Math.floor(new Date(hit.created_at).getTime() / 1000),
    id: Number(hit.objectID) || 0,
    discuss_url: `https://news.ycombinator.com/item?id=${hit.objectID}`,
  }))
}
