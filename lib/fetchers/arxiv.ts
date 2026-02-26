import { XMLParser } from 'fast-xml-parser'
import type { ArxivItem } from '../types'

const LIMIT = 20

export async function fetchArxiv(): Promise<ArxivItem[]> {
  const url =
    'http://export.arxiv.org/api/query?' +
    'search_query=cat:cs.AI+OR+cat:cs.LG+OR+cat:cs.CL' +
    '&sortBy=submittedDate&sortOrder=descending' +
    `&max_results=${LIMIT}`

  const res = await fetch(url, { signal: AbortSignal.timeout(15000) })
  const xml = await res.text()

  const parser = new XMLParser({
    ignoreAttributes: false,
    isArray: (name) => name === 'entry' || name === 'author' || name === 'category' || name === 'link',
  })
  const parsed = parser.parse(xml)
  const entries: any[] = parsed?.feed?.entry ?? []

  return entries.map((e): ArxivItem => {
    const title = (e.title ?? '').replace(/\s+/g, ' ').trim()
    const summary = (e.summary ?? '').replace(/\s+/g, ' ').trim().slice(0, 200)

    let link = ''
    for (const l of e.link ?? []) {
      if (l['@_type'] === 'text/html') {
        link = l['@_href'] ?? ''
        break
      }
    }
    if (!link) link = e.id ?? ''

    const authors = (e.author ?? []).slice(0, 3).map((a: any) => a.name ?? '')
    const categories = (e.category ?? []).slice(0, 4).map((c: any) => c['@_term'] ?? '')

    return { title, url: link, summary, authors, categories, published: e.published ?? '' }
  })
}
