import { Link, useNavigate } from 'react-router-dom'
import { ArrowRight, Menu, Search, Sparkles, SunMoon, X, Sun, Moon } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import tools from '../../data/tools'
import Fuse from 'fuse.js'
import Input from '../common/Input'
import Button from '../common/Button'

const Navbar: React.FC = () => {
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false)
  const fuse = useMemo(() => new Fuse(tools, { keys: ['title', 'shortDescription', 'keywords'], threshold: 0.32, includeScore: true }), [])
  const results = query ? fuse.search(query).slice(0, 5).map(r => r.item) : []

  const getInitialTheme = () => {
    if (typeof window === 'undefined') return 'light'
    try {
      const saved = window.localStorage.getItem('theme')
      if (saved === 'light' || saved === 'dark') return saved
    } catch (e) {
      // ignore
    }
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) return 'dark'
    return 'light'
  }

  const [theme, setTheme] = useState<'light' | 'dark'>(getInitialTheme)

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    try {
      window.localStorage.setItem('theme', theme)
    } catch (e) {
      // ignore
    }
  }, [theme])

  return (
    <header className="sticky top-0 z-40 border-b border-[var(--border)] bg-[color:color-mix(in_srgb,var(--section-bg)_92%,transparent)] backdrop-blur-sm shadow-sm">
      <div className="mx-auto flex w-full max-w-7xl items-center gap-4 px-4 py-1 sm:px-6 lg:px-8 lg:py-2">
        <Link to="/" className="flex items-center gap-3" aria-label="ToolZone home">
          <img src="/logo.png" alt="ToolZone logo" className="h-8 sm:h-10 md:h-12 lg:h-14 w-auto object-contain" />
          <span className="sr-only">ToolZone</span>
        </Link>

        <div className="relative hidden md:block flex-1">
          <div className="surface-panel flex items-center gap-2 px-3 py-1.5 max-w-[640px] w-full">
            <Search className="h-4 w-4 text-[var(--muted)]" />
            <Input
              aria-label="Search tools"
              value={query}
              onChange={event => setQuery(event.target.value)}
              placeholder="Search tools, e.g. merge pdf, qr..."
              className="border-0 bg-transparent px-0 py-0 h-9 text-sm shadow-none focus:ring-0"
            />
            {query && (
              <Button type="button" onClick={() => setQuery('')} variant="ghost" className="h-9 w-9 rounded-full px-0 py-0">
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>

          {results.length > 0 && (
            <div className="surface-panel absolute left-0 right-0 top-[calc(100%+0.6rem)] overflow-hidden p-2">
              {results.map(result => (
                  <button
                  key={result.id}
                  type="button"
                  onClick={() => navigate(`/tools/${result.slug}`)}
                    className="flex w-full items-center justify-between gap-4 rounded-lg px-4 py-3 text-left transition hover:bg-[color:color-mix(in_srgb,var(--panel-strong)_90%,transparent)]"
                >
                  <div>
                    <div className="font-semibold text-[var(--text)]">{result.title}</div>
                    <div className="mt-1 text-sm text-[var(--muted)]">{result.shortDescription}</div>
                  </div>
                  <ArrowRight className="h-4 w-4 text-[var(--muted)]" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="ml-auto flex items-center gap-2 sm:gap-3">
          <Link to="/about" className="hidden rounded-full px-4 py-2 text-sm font-medium text-[var(--muted)] transition hover:bg-black/5 hover:text-[var(--text)] md:inline-flex">
            About
          </Link>
          {/* Mobile About (visible on small screens) - plain text link (outside box) */}
          <Link to="/about" className="md:hidden inline-flex items-center gap-2 px-2 py-1 rounded-md text-sm text-[var(--muted)] hover:bg-[color:color-mix(in_srgb,var(--bg)_92%,transparent)]">
            About
          </Link>
          <button
            type="button"
            aria-label="Open search"
            onClick={() => setMobileSearchOpen(current => !current)}
            className="surface-card inline-flex h-9 w-9 items-center justify-center text-[var(--text)] transition hover:-translate-y-0.5 md:hidden"
          >
            {mobileSearchOpen ? <X className="h-4 w-4" /> : <Search className="h-4 w-4" />}
          </button>
          <button
            aria-label={theme === 'light' ? 'Switch to dark theme' : 'Switch to light theme'}
            aria-pressed={theme === 'dark'}
            onClick={() => setTheme(current => (current === 'light' ? 'dark' : 'light'))}
            className="surface-card inline-flex h-9 w-9 md:h-11 md:w-11 items-center justify-center text-[var(--text)] transition hover:-translate-y-0.5"
            title={theme === 'light' ? 'Dark' : 'Light'}
          >
            {theme === 'light' ? <Moon className="h-4 w-4 md:h-5 md:w-5" /> : <Sun className="h-4 w-4 md:h-5 md:w-5" />}
          </button>
        </div>
      </div>

      {mobileSearchOpen && (
        <div className="border-t border-[var(--border)] bg-[color:color-mix(in_srgb,var(--bg)_88%,transparent)] px-3 py-1 backdrop-blur-xl md:hidden sm:px-4">
          <div className="surface-panel overflow-hidden p-2">
            <div className="flex items-center gap-2 px-2 py-1">
              <Search className="h-4 w-4 text-[var(--muted)]" />
              <Input
                aria-label="Search tools on mobile"
                value={query}
                onChange={event => setQuery(event.target.value)}
                placeholder="Search tools..."
                className="border-0 bg-transparent px-0 py-0 h-9 text-sm shadow-none focus:ring-0"
              />
            </div>

            {results.length > 0 && (
              <div className="mt-2 space-y-2 max-h-[260px] overflow-auto">
                {results.map(result => (
                  <button
                    key={result.id}
                    type="button"
                    onClick={() => {
                      navigate(`/tools/${result.slug}`)
                      setMobileSearchOpen(false)
                    }}
                    className="flex w-full items-center justify-between gap-3 rounded-lg border border-[var(--border)] bg-[color:color-mix(in_srgb,var(--panel-strong)_88%,transparent)] px-3 py-2 text-left"
                  >
                    <div>
                      <div className="font-semibold text-[var(--text)]">{result.title}</div>
                      <div className="mt-1 text-sm text-[var(--muted)]">{result.shortDescription}</div>
                    </div>
                    <ArrowRight className="h-4 w-4 text-[var(--muted)]" />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  )
}

export default Navbar
