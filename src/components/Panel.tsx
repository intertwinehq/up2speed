import type { ReactNode } from 'react'

interface Props {
  icon: string
  color: string
  title: string
  count: number
  children: ReactNode
}

export function Panel({ icon, color, title, count, children }: Props) {
  return (
    <div className="panel">
      <div className="panel-head">
        <div className="panel-icon" style={{ background: color }}>
          {icon}
        </div>
        <span className="panel-title">{title}</span>
        <span className="panel-count">{count}</span>
      </div>
      <div className="panel-body">{children}</div>
    </div>
  )
}
