import type { Sources, TrendItem } from './types'

const STOP_WORDS = new Set(
  'the a an and or but in on at to for of is it this that with from by as are was ' +
  'were be been being have has had do does did will would could should may might shall ' +
  'can not no its your our their his her my we you they them us me he she all any ' +
  'more most other some such than too very just about also back been before between ' +
  'both each few get got here how into made make many much must new now only over own ' +
  'said same still take tell these thing through under use using via way well what when ' +
  'where which while who why work works year years'.split(/\s+/),
)

function extractKeywords(text: string): string[] {
  const words = text.toLowerCase().match(/[a-zA-Z][a-zA-Z0-9+#.]*[a-zA-Z0-9+#]|[a-zA-Z]/g) ?? []
  return words.filter((w) => !STOP_WORDS.has(w) && w.length > 2)
}

export function analyzeTrends(sources: Sources): TrendItem[] {
  const kwSources: Record<string, Set<string>> = {}
  const kwCounts: Record<string, number> = {}
  const kwItems: Record<string, { title: string; source: string }[]> = {}

  for (const [srcName, items] of Object.entries(sources)) {
    for (const item of items as any[]) {
      const text = `${item.title ?? ''} ${item.description ?? ''} ${item.summary ?? ''}`
      const keywords = new Set(extractKeywords(text))

      for (const kw of keywords) {
        if (!kwSources[kw]) {
          kwSources[kw] = new Set()
          kwCounts[kw] = 0
          kwItems[kw] = []
        }
        kwSources[kw].add(srcName)
        kwCounts[kw]++
        if (kwItems[kw].length < 4) {
          kwItems[kw].push({ title: (item.title ?? '').slice(0, 80), source: srcName })
        }
      }
    }
  }

  const trends: TrendItem[] = []
  for (const [kw, srcSet] of Object.entries(kwSources)) {
    if (srcSet.size >= 2) {
      trends.push({
        keyword: kw,
        sources: [...srcSet].sort(),
        count: kwCounts[kw],
        source_count: srcSet.size,
        score: srcSet.size * 10 + kwCounts[kw],
        items: (kwItems[kw] ?? []).slice(0, 3),
      })
    }
  }

  trends.sort((a, b) => b.score - a.score)
  return trends.slice(0, 30)
}
