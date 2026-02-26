import { fmtNum } from '../utils'
import type { SearchData } from '../types'

export function SearchResults({ data }: { data: SearchData }) {
  if (!data.results.length) {
    return (
      <div className="search-overlay">
        <div className="search-header">
          No results for &ldquo;<strong>{data.query}</strong>&rdquo;
        </div>
      </div>
    )
  }

  return (
    <div className="search-overlay">
      <div className="search-header">
        <strong>{data.count}</strong> results for &ldquo;<strong>{data.query}</strong>&rdquo;
      </div>
      {data.results.map((it, i) => (
        <div key={i} className="item search-item" onClick={() => window.open(it.url, '_blank')}>
          <span className="search-badge" style={{ background: it._source_color || '#666' }}>
            {it._source_label}
          </span>
          <a className="item-title" href={it.url} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}>
            {it.title}
          </a>
          {(it.description || it.summary) && (
            <div className="item-desc">{(it.description || it.summary || '').slice(0, 150)}</div>
          )}
          <div className="item-meta">
            {it.score != null && <span className="c-score">{'\u25B2'} {fmtNum(it.score)}</span>}
            {it.stars != null && <span className="c-stars">{'\u2605'} {fmtNum(it.stars)}</span>}
            {it.reactions != null && <span className="c-react">{'\u2764'} {it.reactions}</span>}
            {it.comments != null && <span className="c-comments">{'\uD83D\uDCAC'} {it.comments}</span>}
          </div>
        </div>
      ))}
    </div>
  )
}
