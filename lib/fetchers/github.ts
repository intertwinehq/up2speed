import type { GitHubItem } from '../types'

const LIMIT = 25

export async function fetchGitHub(): Promise<GitHubItem[]> {
  const weekAgo = new Date(Date.now() - 7 * 86400_000).toISOString().split('T')[0]
  const url = `https://api.github.com/search/repositories?q=created:>${weekAgo}&sort=stars&order=desc&per_page=${LIMIT}`

  const res = await fetch(url, {
    headers: { Accept: 'application/vnd.github.v3+json' },
    signal: AbortSignal.timeout(5000),
  })
  const data = await res.json()

  return (data.items ?? []).map((r: any): GitHubItem => ({
    title: r.full_name,
    url: r.html_url,
    description: (r.description ?? '').slice(0, 200),
    stars: r.stargazers_count,
    language: r.language ?? 'Unknown',
    forks: r.forks_count ?? 0,
    created: r.created_at ?? '',
    topics: (r.topics ?? []).slice(0, 5),
  }))
}
