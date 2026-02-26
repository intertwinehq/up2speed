import { XMLParser } from 'fast-xml-parser'
import type { PodcastEpisode, PodcastFeed } from '../types.js'

export const DEFAULT_FEEDS: PodcastFeed[] = [
  { name: 'The Changelog', feedUrl: 'https://changelog.com/podcast/feed' },
  { name: 'Syntax', feedUrl: 'https://feed.syntax.fm/rss' },
  { name: 'Go Time', feedUrl: 'https://changelog.com/gotime/feed' },
  { name: 'Ship It!', feedUrl: 'https://changelog.com/shipit/feed' },
  { name: 'JS Party', feedUrl: 'https://changelog.com/jsparty/feed' },
  { name: 'Practical AI', feedUrl: 'https://changelog.com/practicalai/feed' },
  { name: 'Software Engineering Daily', feedUrl: 'https://feeds.feedburner.com/se-radio' },
  { name: 'CoRecursive', feedUrl: 'https://corecursive.com/feed' },
]

const parser = new XMLParser({
  ignoreAttributes: false,
  isArray: (name) => name === 'item',
})

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, '').replace(/&[^;]+;/g, ' ').trim()
}

async function fetchFeed(feed: PodcastFeed): Promise<PodcastEpisode[]> {
  try {
    const res = await fetch(feed.feedUrl, {
      headers: { 'User-Agent': 'Up2Speed/1.0' },
    })
    if (!res.ok) return []
    const xml = await res.text()
    const parsed = parser.parse(xml)
    const channel = parsed?.rss?.channel
    const items = channel?.item ?? []

    return items.slice(0, 10).map((item: any) => ({
      title: item.title ?? '',
      url: item.link ?? item.enclosure?.['@_url'] ?? '',
      podcast: feed.name,
      description: stripHtml(item.description ?? item['itunes:summary'] ?? '').slice(0, 300),
      published: item.pubDate ?? '',
      duration: item['itunes:duration'] ?? '',
      image:
        item['itunes:image']?.['@_href'] ??
        channel?.['itunes:image']?.['@_href'] ??
        channel?.image?.url ??
        undefined,
    }))
  } catch {
    return []
  }
}

export async function fetchPodcasts(extra: PodcastFeed[] = []): Promise<PodcastEpisode[]> {
  const feeds = [...DEFAULT_FEEDS, ...extra]
  const results = await Promise.allSettled(feeds.map(fetchFeed))
  const episodes: PodcastEpisode[] = []

  for (const r of results) {
    if (r.status === 'fulfilled') episodes.push(...r.value)
  }

  episodes.sort((a, b) => new Date(b.published).getTime() - new Date(a.published).getTime())
  return episodes
}
