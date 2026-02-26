import type { RedditItem } from '../types'

// Reddit combined subreddit feed: single request, combine subs with +
const SUBS = 'programming+machinelearning+webdev+devops+rust+golang'
const LIMIT = 25

export async function fetchReddit(): Promise<RedditItem[]> {
  const res = await fetch(
    `https://www.reddit.com/r/${SUBS}/hot.json?limit=${LIMIT}`,
    {
      headers: { 'User-Agent': 'Up2Speed/1.0' },
      signal: AbortSignal.timeout(5000),
    }
  )
  const data = await res.json()

  return (data?.data?.children ?? [])
    .map((c: any) => c.data)
    .filter((p: any) => !p.stickied)
    .map((p: any): RedditItem => ({
      title: p.title,
      url: `https://reddit.com${p.permalink}`,
      score: p.ups ?? 0,
      comments: p.num_comments ?? 0,
      subreddit: p.subreddit ?? '',
      time: p.created_utc ?? 0,
    }))
    .slice(0, LIMIT)
}
