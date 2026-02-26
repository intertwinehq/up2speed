import { useState, useEffect, useCallback, useRef } from 'react'
import { Header } from './components/Header'
import { TagBar } from './components/TagBar'
import { Dashboard } from './components/Dashboard'
import { SearchResults } from './components/SearchResults'
import { Settings } from './components/Settings'
import { Footer } from './components/Footer'
import { fetchAll, searchAll, triggerRefresh } from './api'
import { DEFAULT_TAGS } from '../lib/tags'
import type { AppData, SearchData, TimeRange, Tag, UserConfig } from './types'

const POLL_INTERVAL = 60_000
const CONFIG_KEY = 'techpulse-config'

function loadConfig(): UserConfig {
  try {
    const raw = localStorage.getItem(CONFIG_KEY)
    if (raw) return JSON.parse(raw)
  } catch {}
  return { customTags: [], customPodcasts: [], hiddenSources: [] }
}

function saveConfig(config: UserConfig) {
  localStorage.setItem(CONFIG_KEY, JSON.stringify(config))
}

export default function App() {
  const [data, setData] = useState<AppData | null>(null)
  const [search, setSearch] = useState('')
  const [searchData, setSearchData] = useState<SearchData | null>(null)
  const [loading, setLoading] = useState(true)
  const [countdown, setCountdown] = useState(60)
  const [timeRange, setTimeRange] = useState<TimeRange>('7d')
  const [activeTags, setActiveTags] = useState<string[]>([])
  const [showSettings, setShowSettings] = useState(false)
  const [config, setConfig] = useState<UserConfig>(loadConfig)
  const countdownRef = useRef(60)

  const allTags: Tag[] = [...DEFAULT_TAGS, ...config.customTags]

  const toggleTag = useCallback((tagId: string) => {
    setActiveTags((prev) =>
      prev.includes(tagId) ? prev.filter((t) => t !== tagId) : [...prev, tagId]
    )
  }, [])

  const updateConfig = useCallback((newConfig: UserConfig) => {
    setConfig(newConfig)
    saveConfig(newConfig)
  }, [])

  const refresh = useCallback(async () => {
    try {
      const d = await fetchAll()
      setData(d)
      setLoading(false)
      countdownRef.current = 60
      setCountdown(60)
    } catch (err) {
      console.error('Fetch failed:', err)
    }
  }, [])

  const handleManualRefresh = useCallback(async () => {
    await triggerRefresh()
    setTimeout(refresh, 3000)
  }, [refresh])

  // Initial fetch + polling
  useEffect(() => {
    refresh()
    const poll = setInterval(refresh, POLL_INTERVAL)
    return () => clearInterval(poll)
  }, [refresh])

  // Countdown
  useEffect(() => {
    const tick = setInterval(() => {
      countdownRef.current -= 1
      if (countdownRef.current < 0) countdownRef.current = 60
      setCountdown(countdownRef.current)
    }, 1000)
    return () => clearInterval(tick)
  }, [])

  // Debounced search
  useEffect(() => {
    if (!search.trim()) {
      setSearchData(null)
      return
    }
    const timer = setTimeout(async () => {
      try {
        const results = await searchAll(search)
        setSearchData(results)
      } catch (err) {
        console.error('Search error:', err)
      }
    }, 300)
    return () => clearTimeout(timer)
  }, [search])

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const isInput = (e.target as HTMLElement).tagName === 'INPUT'

      if (e.key === '/' && !isInput) {
        e.preventDefault()
        document.getElementById('search-input')?.focus()
        return
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault()
        document.getElementById('search-input')?.focus()
        return
      }
      if (e.key === 'Escape') {
        if (showSettings) {
          setShowSettings(false)
          return
        }
        setSearch('')
        ;(document.getElementById('search-input') as HTMLInputElement | null)?.blur()
        return
      }
      if (e.key === 'r' && !isInput) {
        handleManualRefresh()
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [handleManualRefresh, showSettings])

  return (
    <div className="app">
      <Header
        data={data}
        search={search}
        onSearchChange={setSearch}
        onRefresh={handleManualRefresh}
        countdown={countdown}
        timeRange={timeRange}
        onTimeRangeChange={setTimeRange}
        onSettingsClick={() => setShowSettings(true)}
      />

      {!searchData || !search.trim() ? (
        <>
          <TagBar
            tags={allTags}
            activeTags={activeTags}
            onToggle={toggleTag}
            data={data}
          />
          <Dashboard
            data={data}
            loading={loading}
            timeRange={timeRange}
            activeTags={activeTags}
            allTags={allTags}
            hiddenSources={config.hiddenSources}
          />
        </>
      ) : (
        <SearchResults data={searchData} />
      )}

      <Footer />

      {showSettings && (
        <Settings
          config={config}
          onConfigChange={updateConfig}
          onClose={() => setShowSettings(false)}
        />
      )}
    </div>
  )
}
