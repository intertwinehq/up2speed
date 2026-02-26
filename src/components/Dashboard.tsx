import { useMemo } from 'react'
import { Panel } from './Panel'
import { timeAgo, fmtNum, truncate, filterByTimeRange, getItemText } from '../utils'
import { matchesTags } from '../../lib/tags'
import type {
  AppData,
  Sources,
  SourceType,
  HNItem,
  GitHubItem,
  TechNewsItem,
  DevtoItem,
  ArxivItem,
  LobstersItem,
  PodcastEpisode,
  TimeRange,
  Tag,
} from '../types'

// ─── Item Renderers ─────────────────────────────────────────────

function HNRow({ item }: { item: HNItem }) {
  return (
    <div className="item" onClick={() => window.open(item.url, '_blank')}>
      <a className="item-title" href={item.url} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}>
        {item.title}
      </a>
      <div className="item-meta">
        <span className="c-score">{'\u25B2'} {fmtNum(item.score)}</span>
        <span className="c-comments">{'\uD83D\uDCAC'} {item.comments}</span>
        <span>{item.by}</span>
        <span>{timeAgo(item.time)}</span>
        <a href={item.discuss_url} target="_blank" rel="noopener noreferrer" className="discuss-link" onClick={(e) => e.stopPropagation()}>discuss</a>
      </div>
    </div>
  )
}

function GitHubRow({ item }: { item: GitHubItem }) {
  return (
    <div className="item" onClick={() => window.open(item.url, '_blank')}>
      <a className="item-title" href={item.url} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}>
        {item.title}
      </a>
      {item.description && <div className="item-desc">{truncate(item.description, 120)}</div>}
      <div className="item-meta">
        <span className="c-stars">{'\u2605'} {fmtNum(item.stars)}</span>
        <span className="c-lang">{item.language}</span>
        <span>{'\uD83C\uDF74'} {item.forks}</span>
        {item.topics?.slice(0, 3).map((t) => <span key={t} className="tag">{t}</span>)}
      </div>
    </div>
  )
}

function TechNewsRow({ item }: { item: TechNewsItem }) {
  return (
    <div className="item" onClick={() => window.open(item.url, '_blank')}>
      <a className="item-title" href={item.url} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}>
        {item.title}
      </a>
      {item.description && <div className="item-desc">{truncate(item.description, 120)}</div>}
      <div className="item-meta">
        <span className="c-sub">{item.source}</span>
        <span>{timeAgo(item.published)}</span>
      </div>
    </div>
  )
}

function DevtoRow({ item }: { item: DevtoItem }) {
  return (
    <div className="item" onClick={() => window.open(item.url, '_blank')}>
      <a className="item-title" href={item.url} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}>
        {item.title}
      </a>
      <div className="item-meta">
        <span className="c-react">{'\u2764'} {item.reactions}</span>
        <span className="c-comments">{'\uD83D\uDCAC'} {item.comments}</span>
        <span>{item.author}</span>
        <span>{item.reading_time}m read</span>
        {item.tags?.slice(0, 3).map((t) => <span key={t} className="tag">{t}</span>)}
      </div>
    </div>
  )
}

function ArxivRow({ item }: { item: ArxivItem }) {
  return (
    <div className="item" onClick={() => window.open(item.url, '_blank')}>
      <a className="item-title" href={item.url} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}>
        {item.title}
      </a>
      <div className="item-desc">{truncate(item.summary, 140)}</div>
      <div className="item-meta">
        <span>{item.authors?.join(', ')}</span>
        {item.categories?.slice(0, 3).map((c) => <span key={c} className="tag">{c}</span>)}
        <span>{timeAgo(item.published)}</span>
      </div>
    </div>
  )
}

function LobstersRow({ item }: { item: LobstersItem }) {
  return (
    <div className="item" onClick={() => window.open(item.url, '_blank')}>
      <a className="item-title" href={item.url} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}>
        {item.title}
      </a>
      <div className="item-meta">
        <span className="c-score">{'\u25B2'} {item.score}</span>
        <span className="c-comments">{'\uD83D\uDCAC'} {item.comments}</span>
        <span>{item.submitter}</span>
        {item.tags?.slice(0, 3).map((t) => <span key={t} className="tag">{t}</span>)}
        <span>{timeAgo(item.time)}</span>
      </div>
    </div>
  )
}

function PodcastCard({ item }: { item: PodcastEpisode }) {
  const formattedDate = item.published
    ? new Date(item.published).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    : ''

  return (
    <div className="podcast-card" onClick={() => window.open(item.url, '_blank')}>
      <div className="podcast-card-inner">
        <div className="podcast-play">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <path d="M8 5v14l11-7z"/>
          </svg>
        </div>
        <div className="podcast-info">
          <div className="podcast-show">{item.podcast}</div>
          <div className="podcast-title">{item.title}</div>
          <div className="podcast-meta">
            {item.duration && <span>{item.duration}</span>}
            <span>{formattedDate}</span>
            <span>{timeAgo(item.published)}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Source Config ────────────────────────────────────────────

interface SourceConfig<T> {
  key: keyof Sources
  icon: string
  color: string
  title: string
  Row: React.ComponentType<{ item: T }>
  getKey: (item: T, index: number) => string | number
}

const PANELS: SourceConfig<any>[] = [
  { key: 'hn', icon: 'Y', color: '#ff6600', title: 'Hacker News', Row: HNRow, getKey: (it: HNItem) => it.id },
  { key: 'github', icon: 'G', color: '#58a6ff', title: 'GitHub Trending', Row: GitHubRow, getKey: (_: GitHubItem, i: number) => i },
  { key: 'wired', icon: 'W', color: '#000000', title: 'Wired', Row: TechNewsRow, getKey: (_: TechNewsItem, i: number) => i },
  { key: 'arstechnica', icon: 'A', color: '#ff4e00', title: 'Ars Technica', Row: TechNewsRow, getKey: (_: TechNewsItem, i: number) => i },
  { key: 'techcrunch', icon: 'T', color: '#0a9e01', title: 'TechCrunch', Row: TechNewsRow, getKey: (_: TechNewsItem, i: number) => i },
  { key: 'devto', icon: 'D', color: '#3b49df', title: 'Dev.to', Row: DevtoRow, getKey: (_: DevtoItem, i: number) => i },
  { key: 'arxiv', icon: 'X', color: '#b31b1b', title: 'ArXiv AI/ML', Row: ArxivRow, getKey: (_: ArxivItem, i: number) => i },
  { key: 'lobsters', icon: 'L', color: '#ac130d', title: 'Lobsters', Row: LobstersRow, getKey: (_: LobstersItem, i: number) => i },
]

// ─── Dashboard ──────────────────────────────────────────────────

interface Props {
  data: AppData | null
  loading: boolean
  timeRange: TimeRange
  activeTags: string[]
  allTags: Tag[]
  hiddenSources: SourceType[]
}

export function Dashboard({ data, loading, timeRange, activeTags, allTags, hiddenSources }: Props) {
  const filteredPanels = useMemo(() => {
    if (!data) return []
    return PANELS.filter((p) => !hiddenSources.includes(p.key as SourceType)).map(({ key, icon, color, title, Row, getKey }) => {
      let items: any[] = data.sources[key] ?? []
      items = filterByTimeRange(items, key, timeRange)
      if (activeTags.length > 0) {
        items = items.filter((item) => {
          const text = getItemText(item)
          const itemTags = matchesTags(text, allTags)
          return activeTags.some((t) => itemTags.includes(t))
        })
      }
      return { key, icon, color, title, Row, getKey, items }
    })
  }, [data, timeRange, activeTags, allTags, hiddenSources])

  const podcasts = useMemo(() => {
    if (!data || hiddenSources.includes('podcasts')) return []
    let eps = data.sources.podcasts ?? []
    eps = filterByTimeRange(eps, 'podcasts', timeRange)
    if (activeTags.length > 0) {
      eps = eps.filter((ep) => {
        const text = getItemText(ep)
        const epTags = matchesTags(text, allTags)
        return activeTags.some((t) => epTags.includes(t))
      })
    }
    return eps
  }, [data, timeRange, activeTags, allTags, hiddenSources])

  if (loading || !data) {
    return (
      <div className="dash-loading">
        <div className="spinner" />
        <span>Fetching from 7 sources{'\u2026'}</span>
      </div>
    )
  }

  return (
    <div className="dashboard-wrap">
      {/* Podcast hero section at top */}
      {podcasts.length > 0 && (
        <div className="podcast-hero">
          <div className="podcast-hero-header">
            <div className="panel-icon" style={{ background: '#8b5cf6' }}>P</div>
            <span className="panel-title">Latest Podcast Episodes</span>
            <span className="panel-count">{podcasts.length}</span>
          </div>
          <div className="podcast-scroll">
            {podcasts.map((ep, i) => <PodcastCard key={i} item={ep} />)}
          </div>
        </div>
      )}

      {/* News grid */}
      <div className="dashboard">
        {filteredPanels.map(({ key, icon, color, title, Row, getKey, items }) => (
          <Panel key={key} icon={icon} color={color} title={title} count={items.length}>
            {items.length === 0 ? (
              <div className="empty">No items match filters</div>
            ) : (
              items.map((item: any, i: number) => <Row key={getKey(item, i)} item={item} />)
            )}
          </Panel>
        ))}
      </div>
    </div>
  )
}
