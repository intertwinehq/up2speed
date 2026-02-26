import type { AppData, SearchData } from './types'

const BASE = '/api'

export async function fetchAll(): Promise<AppData> {
  const res = await fetch(`${BASE}/all`)
  if (!res.ok) throw new Error(`API error: ${res.status}`)
  return res.json()
}

export async function searchAll(query: string): Promise<SearchData> {
  const res = await fetch(`${BASE}/search?q=${encodeURIComponent(query)}`)
  if (!res.ok) throw new Error(`Search error: ${res.status}`)
  return res.json()
}

export async function triggerRefresh(): Promise<void> {
  await fetch(`${BASE}/refresh`, { method: 'POST' })
}
