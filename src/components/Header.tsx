import type { AppData, TimeRange } from '../types'

const TIME_RANGES: TimeRange[] = ['24h', '7d', '14d', '30d']

interface Props {
  data: AppData | null
  search: string
  onSearchChange: (q: string) => void
  onRefresh: () => void
  countdown: number
  timeRange: TimeRange
  onTimeRangeChange: (r: TimeRange) => void
  onSettingsClick: () => void
}

export function Header({
  data,
  search,
  onSearchChange,
  onRefresh,
  countdown,
  timeRange,
  onTimeRangeChange,
  onSettingsClick,
}: Props) {
  const meta = data?.source_meta ?? {}
  const status = data?.status ?? {}

  return (
    <header className="header">
      <div className="logo">
        Up<span className="accent">2</span>Speed
      </div>

      <div className="search-box">
        <span className="search-icon">{'\u2315'}</span>
        <input
          id="search-input"
          type="text"
          placeholder="Search across all feeds…"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          autoComplete="off"
        />
        <kbd className="search-kbd">/</kbd>
      </div>

      <div className="time-range">
        {TIME_RANGES.map((r) => (
          <button
            key={r}
            className={r === timeRange ? 'active' : ''}
            onClick={() => onTimeRangeChange(r)}
          >
            {r}
          </button>
        ))}
      </div>

      <div className="status-bar">
        {Object.entries(meta).map(([key, m]) => {
          const s = status[key]
          const cls = s?.updated ? (s.ok ? 'ok' : 'err') : 'loading'
          return (
            <div
              key={key}
              className="indicator"
              title={`${m.label}: ${s?.count ?? 0} items${s?.error ? ' \u2014 ' + s.error : ''}`}
            >
              <span className={`dot ${cls}`} />
              <span className="indicator-label">{m.icon}</span>
            </div>
          )
        })}
      </div>

      <div className="meta">
        {data?.last_update && (
          <span>{new Date(data.last_update).toLocaleTimeString()}</span>
        )}
        <span>next: {countdown}s</span>
        <button className="refresh-btn" onClick={onRefresh} title="Manual refresh (R)">
          {'\u21BB'}
        </button>
        <button className="settings-btn" onClick={onSettingsClick} title="Settings">
          {'\u2699'}
        </button>
      </div>
    </header>
  )
}
