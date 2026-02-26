import { useMemo } from 'react'
import { getItemText } from '../utils'
import { matchesTags } from '../../lib/tags'
import type { AppData, Tag } from '../types'

interface Props {
  tags: Tag[]
  activeTags: string[]
  onToggle: (tagId: string) => void
  data: AppData | null
}

export function TagBar({ tags, activeTags, onToggle, data }: Props) {
  const tagCounts = useMemo(() => {
    if (!data) return {}
    const counts: Record<string, number> = {}
    for (const tag of tags) counts[tag.id] = 0

    for (const [, items] of Object.entries(data.sources)) {
      for (const item of items as any[]) {
        const text = getItemText(item)
        const matched = matchesTags(text, tags)
        for (const id of matched) {
          counts[id] = (counts[id] ?? 0) + 1
        }
      }
    }
    return counts
  }, [data, tags])

  return (
    <div className="tagbar">
      {tags.map((tag) => {
        const isActive = activeTags.includes(tag.id)
        const count = tagCounts[tag.id] ?? 0
        return (
          <button
            key={tag.id}
            className={`tag-pill ${isActive ? 'active' : ''}`}
            style={isActive ? { background: tag.color, borderColor: tag.color } : undefined}
            onClick={() => onToggle(tag.id)}
          >
            <span className="tag-dot" style={{ background: tag.color }} />
            {tag.label}
            {count > 0 && <span className="tag-count">{count}</span>}
          </button>
        )
      })}
    </div>
  )
}
