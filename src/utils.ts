import type { TimeRange } from './types'

export function timeAgo(ts: number | string): string {
  if (!ts) return ''
  const d =
    typeof ts === 'number'
      ? ts > 1e12
        ? new Date(ts)
        : new Date(ts * 1000)
      : new Date(ts)
  const sec = Math.floor((Date.now() - d.getTime()) / 1000)
  if (sec < 0) return 'just now'
  if (sec < 60) return `${sec}s`
  if (sec < 3600) return `${Math.floor(sec / 60)}m`
  if (sec < 86400) return `${Math.floor(sec / 3600)}h`
  return `${Math.floor(sec / 86400)}d`
}

export function fmtNum(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}k`
  return String(n)
}

export function truncate(s: string | undefined, len: number): string {
  if (!s) return ''
  return s.length > len ? s.slice(0, len) + '\u2026' : s
}

/** Extract a unix-ms timestamp from any source item */
export function getItemTimestamp(item: any, source: string): number {
  switch (source) {
    case 'hn':
    case 'reddit':
      return item.time > 1e12 ? item.time : item.time * 1000
    case 'github':
      return new Date(item.created).getTime()
    case 'devto':
    case 'arxiv':
    case 'podcasts':
      return new Date(item.published).getTime()
    case 'lobsters':
      return new Date(item.time).getTime()
    default:
      return 0
  }
}

const RANGE_MS: Record<TimeRange, number> = {
  '24h': 24 * 60 * 60 * 1000,
  '7d': 7 * 24 * 60 * 60 * 1000,
  '14d': 14 * 24 * 60 * 60 * 1000,
  '30d': 30 * 24 * 60 * 60 * 1000,
}

/** Filter items by time range */
export function filterByTimeRange<T>(items: T[], source: string, range: TimeRange): T[] {
  const cutoff = Date.now() - RANGE_MS[range]
  return items.filter((item) => getItemTimestamp(item, source) >= cutoff)
}

/** Get searchable text from any item for tag matching */
export function getItemText(item: any): string {
  return [
    item.title ?? '',
    item.description ?? '',
    item.summary ?? '',
    item.podcast ?? '',
    ...(item.tags ?? []),
    ...(item.topics ?? []),
    ...(item.categories ?? []),
    item.subreddit ?? '',
    item.language ?? '',
  ].join(' ')
}
