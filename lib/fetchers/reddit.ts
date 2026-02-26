import type { RedditItem } from '../types'

const SUBS = ['programming', 'machinelearning', 'webdev', 'devops', 'rust', 'golang']
const LIMIT = 25

export async function fetchReddit(): Promise<RedditItem[]> {
  const items: RedditItem[] = []

  const results = await Promise.allSettled(
    SUBS.map(async (sub) => {
      const res = await fetch(`https://www.reddit.com/r/${sub}/hot.json?limit=10`, {
        headers: { 'User-Agent': 'Up2Speed/1.0' },
        signal: AbortSignal.timeout(10000),
      })
      const data = await res.json()
      return (data?.data?.children ?? [])
        .map((c: any) => c.data)
        .filter((p: any) => !p.stickied)
        .map((p: any): RedditItem => ({
          title: p.title,
          url: `https://reddit.com${p.permalink}`,
          score: p.ups ?? 0,
          comments: p.num_comments ?? 0,
          subreddit: p.subreddit ?? sub,
          time: p.created_utc ?? 0,
        }))
    }),
  )

  for (const r of results) {
    if (r.status === 'fulfilled') items.push(...r.value)
  }

  items.sort((a, b) => b.score - a.score)
  return items.slice(0, LIMIT)
}
