import { XMLParser } from 'fast-xml-parser'
import type { TechNewsItem } from '../types.js'

const LIMIT = 15

const parser = new XMLParser({ ignoreAttributes: false })

function stripHtml(s: string): string {
  return s?.replace(/<[^>]*>/g, '').replace(/&[^;]+;/g, ' ').trim() ?? ''
}

function parseFeed(xml: string, sourceName: string): TechNewsItem[] {
  const parsed = parser.parse(xml)

  // Handle both RSS 2.0 (<rss><channel><item>) and Atom (<feed><entry>)
  const items =
    parsed?.rss?.channel?.item ??
    parsed?.feed?.entry ??
    []

  const arr = Array.isArray(items) ? items : [items]

  return arr.slice(0, LIMIT).map((item: any): TechNewsItem => {
    // RSS 2.0 uses <link>, Atom uses <link href="..."> or <id>
    const url =
      item.link?.['@_href'] ?? item.link ?? item.id ?? ''

    return {
      title: stripHtml(typeof item.title === 'object' ? item.title['#text'] ?? '' : item.title ?? ''),
      url: typeof url === 'object' ? '' : url,
      source: sourceName,
      published: item.pubDate ?? item.published ?? item.updated ?? '',
      description: stripHtml(
        item.description ?? item.summary ?? item.content ?? ''
      ).slice(0, 200),
    }
  })
}

async function fetchRSS(feedUrl: string, sourceName: string): Promise<TechNewsItem[]> {
  const res = await fetch(feedUrl, { signal: AbortSignal.timeout(5000) })
  const xml = await res.text()
  return parseFeed(xml, sourceName)
}

export async function fetchWired(): Promise<TechNewsItem[]> {
  return fetchRSS('https://www.wired.com/feed/rss', 'Wired')
}

export async function fetchArsTechnica(): Promise<TechNewsItem[]> {
  return fetchRSS('https://feeds.arstechnica.com/arstechnica/index', 'Ars Technica')
}

export async function fetchTechCrunch(): Promise<TechNewsItem[]> {
  return fetchRSS('https://techcrunch.com/feed/', 'TechCrunch')
}
