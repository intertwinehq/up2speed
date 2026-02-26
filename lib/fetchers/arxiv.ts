import { XMLParser } from 'fast-xml-parser'
import type { ArxivItem } from '../types'

// ArXiv RSS feed: single request, combines categories with +
const FEED_URL = 'https://rss.arxiv.org/rss/cs.AI+cs.LG+cs.CL'

const parser = new XMLParser({
  ignoreAttributes: false,
  isArray: (name) => name === 'item',
})

export async function fetchArxiv(): Promise<ArxivItem[]> {
  const res = await fetch(FEED_URL, { signal: AbortSignal.timeout(5000) })
  const xml = await res.text()
  const parsed = parser.parse(xml)
  const items: any[] = parsed?.rdf?.item ?? parsed?.rss?.channel?.item ?? []

  return items.slice(0, 20).map((item): ArxivItem => {
    const title = (item.title ?? '').replace(/\s+/g, ' ').trim()
    const summary = (item.description ?? '').replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim().slice(0, 200)
    const link = item.link ?? ''

    // ArXiv RSS uses dc:creator for authors
    const rawCreator = item['dc:creator'] ?? ''
    const authors = rawCreator
      ? rawCreator.split(/,\s*/).slice(0, 3)
      : []

    // ArXiv RSS uses dc:subject for categories
    const rawSubject = item['dc:subject'] ?? ''
    const categories = rawSubject
      ? rawSubject.split(/,\s*/).slice(0, 4)
      : []

    return {
      title,
      url: link,
      summary,
      authors,
      categories,
      published: item['dc:date'] ?? item.pubDate ?? '',
    }
  })
}
