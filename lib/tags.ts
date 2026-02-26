import type { Tag } from './types.js'

export const DEFAULT_TAGS: Tag[] = [
  {
    id: 'ai-agents',
    label: 'AI Agents',
    keywords: ['agent', 'agents', 'agentic', 'autonomous', 'multi-agent', 'tool use', 'function calling', 'mcp'],
    color: '#8b5cf6',
  },
  {
    id: 'llms',
    label: 'LLMs',
    keywords: ['llm', 'language model', 'gpt', 'claude', 'gemini', 'transformer', 'fine-tun', 'rag', 'retrieval', 'prompt', 'inference', 'ollama'],
    color: '#06b6d4',
  },
  {
    id: 'robotics',
    label: 'Robotics',
    keywords: ['robot', 'robotics', 'actuator', 'humanoid', 'manipulation', 'embodied'],
    color: '#f59e0b',
  },
  {
    id: 'web-dev',
    label: 'Web Dev',
    keywords: ['react', 'vue', 'angular', 'nextjs', 'next.js', 'remix', 'frontend', 'css', 'javascript', 'typescript', 'svelte', 'tailwind'],
    color: '#3b82f6',
  },
  {
    id: 'rust',
    label: 'Rust',
    keywords: ['rust', 'cargo', 'crate', 'rustc', 'tokio', 'wasm'],
    color: '#ef4444',
  },
  {
    id: 'golang',
    label: 'Go',
    keywords: ['golang', 'goroutine', 'go module', 'go time'],
    color: '#22d3ee',
  },
  {
    id: 'devops',
    label: 'DevOps',
    keywords: ['docker', 'kubernetes', 'k8s', 'ci/cd', 'terraform', 'devops', 'infrastructure', 'helm', 'deploy'],
    color: '#a855f7',
  },
  {
    id: 'security',
    label: 'Security',
    keywords: ['security', 'vulnerability', 'exploit', 'cve', 'ransomware', 'breach', 'cryptograph', 'zero-day', 'malware'],
    color: '#f43f5e',
  },
  {
    id: 'open-source',
    label: 'Open Source',
    keywords: ['open source', 'open-source', 'oss', 'license', 'foss', 'maintainer', 'contributor'],
    color: '#10b981',
  },
  {
    id: 'data-ml',
    label: 'Data & ML',
    keywords: ['machine learning', 'deep learning', 'neural', 'dataset', 'training', 'benchmark', 'pytorch', 'tensorflow'],
    color: '#f97316',
  },
  {
    id: 'systems',
    label: 'Systems',
    keywords: ['kernel', 'compiler', 'linker', 'memory', 'performance', 'optimization', 'database', 'distributed'],
    color: '#64748b',
  },
]

/** Returns IDs of tags that match the given text */
export function matchesTags(text: string, tags: Tag[]): string[] {
  const lower = text.toLowerCase()
  return tags
    .filter((tag) => tag.keywords.some((kw) => lower.includes(kw.toLowerCase())))
    .map((tag) => tag.id)
}
