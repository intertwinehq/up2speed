// ─── Source Types ───────────────────────────────────────────────

export type SourceType = 'hn' | 'github' | 'reddit' | 'devto' | 'arxiv' | 'lobsters' | 'podcasts'

export type TimeRange = '24h' | '7d' | '14d' | '30d'

export interface HNItem {
  title: string
  url: string
  score: number
  comments: number
  by: string
  time: number
  id: number
  discuss_url: string
}

export interface GitHubItem {
  title: string
  url: string
  description: string
  stars: number
  language: string
  forks: number
  created: string
  topics: string[]
}

export interface RedditItem {
  title: string
  url: string
  score: number
  comments: number
  subreddit: string
  time: number
}

export interface DevtoItem {
  title: string
  url: string
  reactions: number
  comments: number
  tags: string[]
  author: string
  reading_time: number
  published: string
}

export interface ArxivItem {
  title: string
  url: string
  summary: string
  authors: string[]
  categories: string[]
  published: string
}

export interface LobstersItem {
  title: string
  url: string
  score: number
  comments: number
  tags: string[]
  submitter: string
  discuss_url: string
  time: string
}

export interface PodcastEpisode {
  title: string
  url: string
  podcast: string
  description: string
  published: string
  duration: string
  image?: string
}

// ─── Tags ─────────────────────────────────────────────────────

export interface Tag {
  id: string
  label: string
  keywords: string[]
  color: string
  custom?: boolean
}

// ─── User Config ──────────────────────────────────────────────

export interface PodcastFeed {
  name: string
  feedUrl: string
}

export interface UserConfig {
  customTags: Tag[]
  customPodcasts: PodcastFeed[]
  hiddenSources: SourceType[]
}

// ─── Aggregated Types ───────────────────────────────────────────

export interface TrendItem {
  keyword: string
  sources: string[]
  count: number
  source_count: number
  score: number
  items: { title: string; source: string }[]
}

export interface SourceStatus {
  ok: boolean
  error: string
  count: number
  updated: string
}

export interface SourceMeta {
  label: string
  icon: string
  color: string
}

export interface Sources {
  hn: HNItem[]
  github: GitHubItem[]
  reddit: RedditItem[]
  devto: DevtoItem[]
  arxiv: ArxivItem[]
  lobsters: LobstersItem[]
  podcasts: PodcastEpisode[]
}

export interface AppData {
  sources: Sources
  trends: TrendItem[]
  status: Record<string, SourceStatus>
  source_meta: Record<string, SourceMeta>
  last_update: string | null
}

export interface SearchResult {
  title: string
  url: string
  description?: string
  summary?: string
  score?: number
  stars?: number
  reactions?: number
  comments?: number
  _source: string
  _source_label: string
  _source_color: string
}

export interface SearchData {
  results: SearchResult[]
  count: number
  query: string
}

// ─── Source Registry ────────────────────────────────────────────

export const SOURCE_META: Record<SourceType, SourceMeta> = {
  hn:       { label: 'Hacker News',     icon: 'Y', color: '#ff6600' },
  github:   { label: 'GitHub Trending', icon: 'G', color: '#58a6ff' },
  reddit:   { label: 'Reddit',          icon: 'R', color: '#ff4500' },
  devto:    { label: 'Dev.to',          icon: 'D', color: '#3b49df' },
  arxiv:    { label: 'ArXiv AI/ML',     icon: 'A', color: '#b31b1b' },
  lobsters: { label: 'Lobsters',        icon: 'L', color: '#ac130d' },
  podcasts: { label: 'Podcasts',        icon: 'P', color: '#8b5cf6' },
}
