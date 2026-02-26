import { useState } from 'react'
import { DEFAULT_FEEDS } from '../../lib/fetchers/podcasts'
import type { UserConfig, Tag, PodcastFeed, SourceType } from '../types'
import { SOURCE_META } from '../../lib/types'

interface Props {
  config: UserConfig
  onConfigChange: (config: UserConfig) => void
  onClose: () => void
}

export function Settings({ config, onConfigChange, onClose }: Props) {
  const [tagLabel, setTagLabel] = useState('')
  const [tagKeywords, setTagKeywords] = useState('')
  const [feedName, setFeedName] = useState('')
  const [feedUrl, setFeedUrl] = useState('')

  const addTag = () => {
    if (!tagLabel.trim() || !tagKeywords.trim()) return
    const newTag: Tag = {
      id: `custom-${Date.now()}`,
      label: tagLabel.trim(),
      keywords: tagKeywords.split(',').map((k) => k.trim()).filter(Boolean),
      color: `hsl(${Math.random() * 360}, 70%, 55%)`,
      custom: true,
    }
    onConfigChange({ ...config, customTags: [...config.customTags, newTag] })
    setTagLabel('')
    setTagKeywords('')
  }

  const removeTag = (id: string) => {
    onConfigChange({ ...config, customTags: config.customTags.filter((t) => t.id !== id) })
  }

  const addFeed = () => {
    if (!feedName.trim() || !feedUrl.trim()) return
    const feed: PodcastFeed = { name: feedName.trim(), feedUrl: feedUrl.trim() }
    onConfigChange({ ...config, customPodcasts: [...config.customPodcasts, feed] })
    setFeedName('')
    setFeedUrl('')
  }

  const removeFeed = (idx: number) => {
    onConfigChange({ ...config, customPodcasts: config.customPodcasts.filter((_, i) => i !== idx) })
  }

  const toggleSource = (src: SourceType) => {
    const hidden = config.hiddenSources.includes(src)
      ? config.hiddenSources.filter((s) => s !== src)
      : [...config.hiddenSources, src]
    onConfigChange({ ...config, hiddenSources: hidden })
  }

  return (
    <div className="settings-overlay" onClick={onClose}>
      <div className="settings-modal" onClick={(e) => e.stopPropagation()}>
        <div className="settings-header">
          <span className="settings-title">Settings</span>
          <button className="settings-close" onClick={onClose}>{'\u2715'}</button>
        </div>

        <div className="settings-section">
          <h3>Custom Tags</h3>
          <div style={{ marginBottom: 12 }}>
            {config.customTags.map((tag) => (
              <span key={tag.id} className="settings-tag">
                <span className="tag-dot" style={{ background: tag.color, width: 8, height: 8, borderRadius: '50%', display: 'inline-block' }} />
                {tag.label}
                <button onClick={() => removeTag(tag.id)}>{'\u2715'}</button>
              </span>
            ))}
            {config.customTags.length === 0 && (
              <span style={{ color: 'var(--text-muted)', fontSize: 13 }}>No custom tags yet</span>
            )}
          </div>
          <div className="settings-row">
            <input
              type="text"
              placeholder="Tag name"
              value={tagLabel}
              onChange={(e) => setTagLabel(e.target.value)}
            />
            <input
              type="text"
              placeholder="Keywords (comma separated)"
              value={tagKeywords}
              onChange={(e) => setTagKeywords(e.target.value)}
              style={{ flex: 2 }}
            />
            <button className="settings-btn-sm" onClick={addTag}>Add</button>
          </div>
        </div>

        <div className="settings-section">
          <h3>Podcast Feeds</h3>
          {DEFAULT_FEEDS.map((f, i) => (
            <div key={i} className="settings-feed">
              <div>
                <div className="feed-name">{f.name}</div>
                <div className="feed-url">{f.feedUrl}</div>
              </div>
              <span style={{ color: 'var(--text-muted)', fontSize: 11 }}>built-in</span>
            </div>
          ))}
          {config.customPodcasts.map((f, i) => (
            <div key={i} className="settings-feed">
              <div>
                <div className="feed-name">{f.name}</div>
                <div className="feed-url">{f.feedUrl}</div>
              </div>
              <button className="settings-close" onClick={() => removeFeed(i)}>{'\u2715'}</button>
            </div>
          ))}
          <div className="settings-row" style={{ marginTop: 8 }}>
            <input
              type="text"
              placeholder="Podcast name"
              value={feedName}
              onChange={(e) => setFeedName(e.target.value)}
            />
            <input
              type="text"
              placeholder="RSS feed URL"
              value={feedUrl}
              onChange={(e) => setFeedUrl(e.target.value)}
              style={{ flex: 2 }}
            />
            <button className="settings-btn-sm" onClick={addFeed}>Add</button>
          </div>
        </div>

        <div className="settings-section">
          <h3>Visible Sources</h3>
          {(Object.entries(SOURCE_META) as [SourceType, { label: string; icon: string; color: string }][]).map(([key, meta]) => (
            <label key={key} className="settings-row" style={{ cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={!config.hiddenSources.includes(key)}
                onChange={() => toggleSource(key)}
              />
              <span
                className="panel-icon"
                style={{ background: meta.color, width: 20, height: 20, fontSize: 10, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', borderRadius: 4 }}
              >
                {meta.icon}
              </span>
              <span style={{ color: 'var(--text)', fontSize: 13 }}>{meta.label}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  )
}
