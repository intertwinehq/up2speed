import type { DevtoItem } from '../types.js'

export async function fetchDevto(): Promise<DevtoItem[]> {
  const res = await fetch('https://dev.to/api/articles?per_page=25&top=7', {
    signal: AbortSignal.timeout(10000),
  })
  const articles: any[] = await res.json()

  return articles.map((a): DevtoItem => ({
    title: a.title ?? '',
    url: a.url ?? '',
    reactions: a.positive_reactions_count ?? 0,
    comments: a.comments_count ?? 0,
    tags: a.tag_list ?? [],
    author: a.user?.username ?? '',
    reading_time: a.reading_time_minutes ?? 0,
    published: a.published_at ?? '',
  }))
}
