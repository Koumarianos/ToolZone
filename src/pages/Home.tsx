import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import Fuse from 'fuse.js'
import { ArrowRight, BookOpen, Files, Globe, Sparkles, Wand2, Key, Link as LucideLink } from 'lucide-react'
import tools from '../data/tools'
import Card from '../components/common/Card'
import Button from '../components/common/Button'
import Input from '../components/common/Input'

const categoryCards = [
  {
    slug: 'pdf-tools',
    title: 'PDF Tools',
    description: 'Tight control for documents. Merge, split, rotate, extract and ship clean PDFs without leaving the browser.',
    icon: Files,
    accent: '#d9edf3',
    accentColor: '#1f4856',
    tags: ['Merge', 'Split', 'Preview'],
    zone: 'Z01'
  },
  {
    slug: 'web-tools',
    title: 'Web Tools',
    description: 'Shareable infrastructure. Short links, QR codes and URL utilities with a fast, production-ready flow.',
    icon: Globe,
    accent: '#e6f6f5',
    accentColor: 'var(--accent-strong-1)',
    tags: ['QR', 'Shorten', 'Validate'],
    zone: 'Z02'
  },
  {
    slug: 'text-tools',
    title: 'Text Tools',
    description: 'Precision for copy. Count, convert, normalize and ship clean text outputs for production teams.',
    icon: BookOpen,
    accent: '#fff4ea',
    accentColor: '#b46f33',
    tags: ['Count', 'Case', 'Normalize'],
    zone: 'Z03'
  },
  {
    slug: 'developer-tools',
    title: 'Developer Tools',
    description: 'Operational utilities for secure values: UUIDs, passwords, JWT checks and JSON formatting.',
    icon: Wand2,
    accent: '#eef7ef',
    accentColor: 'var(--accent-strong-1)',
    tags: ['UUID', 'JWT', 'Passwords'],
    zone: 'Z04'
  },
  {
    slug: 'image-tools',
    title: 'Image Tools',
    description: 'Lightweight image handling. Convert, encode and prepare assets for embedding or download.',
    icon: Sparkles,
    accent: '#fbf0fa',
    accentColor: 'var(--accent-strong-2)',
    tags: ['Convert', 'Encode', 'Export'],
    zone: 'Z05'
  },
]

const Home = () => {
  const [query, setQuery] = useState('')
  const [isSearchFocused, setIsSearchFocused] = useState(false)
  const fuse = useMemo(() => new Fuse(tools, { keys: ['title', 'shortDescription', 'keywords'], threshold: 0.32, includeScore: true }), [])
  const results = query
    ? fuse.search(query).map((result: { item: any; score?: number }) => ({ ...result.item, score: result.score ?? 0 }))
    : []
  const featured = tools.filter(tool => tool.featured || tool.popular)

  const previewTools = query ? results.slice(0, 5) : featured.slice(0, 4)
  const heroStats = [
    { label: 'Live tools', value: tools.length.toString() },
    { label: 'Categories', value: categoryCards.length.toString() },
  ]
  const topCategoryCards = categoryCards.slice(0, 2)
  const bottomCategoryCards = categoryCards.slice(2)

  const getWorkflowMeta = (tool: any) => {
    const category = (tool.category || '').toLowerCase()
    if (category.includes('pdf')) {
      return { purpose: 'Shape documents for delivery', flow: ['Upload', 'Adjust', 'Download'] }
    }
    if (category.includes('web')) {
      return { purpose: 'Share and track fast links', flow: ['Paste', 'Generate', 'Copy'] }
    }
    if (category.includes('text')) {
      return { purpose: 'Normalize copy for production', flow: ['Paste', 'Transform', 'Export'] }
    }
    if (category.includes('developer')) {
      return { purpose: 'Generate safe values fast', flow: ['Configure', 'Generate', 'Copy'] }
    }
    if (category.includes('image')) {
      return { purpose: 'Prepare assets for embedding', flow: ['Upload', 'Convert', 'Export'] }
    }
    return { purpose: 'Finish a workflow in one pass', flow: ['Input', 'Process', 'Export'] }
  }

  useEffect(() => {
    if (typeof window === 'undefined') return
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const elements = Array.from(document.querySelectorAll<HTMLElement>('[data-reveal]'))
    if (elements.length === 0) return

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) return
          const el = entry.target as HTMLElement
          el.classList.add('is-revealed')
          observer.unobserve(el)
        })
      },
      { root: null, threshold: 0.18, rootMargin: '0px 0px -10% 0px' }
    )

    elements.forEach(el => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  return (
    <div className="home-shell space-y-10 lg:space-y-16">
      <section
        className={`hero-scene ${isSearchFocused ? 'hero-scene--focused' : ''}`}
      >
        <div className="hero-scene__grid home-section-wrap">
          <div className="hero-row">
            <div data-reveal className="hero-frame">
              <div className="surface-panel hero-panel hero-panel--primary overflow-hidden p-6 sm:p-8 lg:p-10">
                <div className="hero-panel__content">
                  <div className="ui-badge w-fit">
                    <span className="h-2 w-2 rounded-full bg-[var(--success)]" />
                    Production utility workbench
                  </div>
                  <div className="hero-copy max-w-3xl space-y-5">
                    <p className="hero-meta mono">ToolZone / production tooling</p>
                    <h1 className="hero-title max-w-2xl">
                      <span className="hero-title__line">Focused tools,</span>
                      <span className="hero-title__line">built like a serious</span>
                      <span className="hero-title__line">production console.</span>
                    </h1>
                    <p className="max-w-2xl text-base leading-7 text-[var(--muted)] sm:text-lg">
                      Work across PDFs, links, text, images, and developer utilities with a visual system that feels deliberate,
                      fast, and credible. Search by intent, open a tool, and stay in flow with clear input, output, and download states.
                    </p>
                  </div>

                  <div className="hero-search-slot">
                    <Input
                      aria-label="Search tools"
                      value={query}
                      onChange={(event: { target: { value: string } }) => setQuery(event.target.value)}
                      onFocus={() => setIsSearchFocused(true)}
                      onBlur={() => setIsSearchFocused(false)}
                      placeholder="Search: merge pdf, url shortener, qr, password..."
                      className="home-search-input h-12 rounded-lg text-base"
                    />
                  </div>

                  <div className="hero-stats grid gap-3 sm:grid-cols-2">
                    {heroStats.map(stat => (
                      <div key={stat.label} className="surface-card min-w-[150px] px-4 py-3">
                        <div className="stat-label">{stat.label}</div>
                        <div className="stat-value mt-1 text-lg font-semibold text-[var(--text)]">{stat.value}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div aria-hidden="true" className="hero-rail">
                <div className="hero-rail__label mono">ToolZone</div>
                <div className="hero-rail__tick" />
                <div className="hero-rail__tick" />
                <div className="hero-rail__tick" />
              </div>
            </div>

            <div data-reveal className="search-float">
              <Card className="home-search-panel home-search-panel--scene overflow-hidden p-0">
                <div className="border-b border-[var(--border)] px-6 py-5">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <div className="section-kicker mono">Nearby results</div>
                      <div className="mt-1 text-xl font-semibold text-[var(--text)]">Search preview</div>
                    </div>
                    <div className="preview-badge rounded-full bg-[var(--accent-soft)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-[var(--text)]">
                      Ranked by relevance
                    </div>
                  </div>
                </div>
                <div className="results-scroll space-y-3 p-4 sm:p-5">
                  {previewTools.map((tool: any, index: number) => {
                    const getToolIcon = (t: any) => {
                      if (!t) return Files
                      const cat = (t.category || '').toLowerCase()
                      if (cat.includes('pdf')) return Files
                      if (cat.includes('web')) return Globe
                      if (cat.includes('text')) return BookOpen
                      if (cat.includes('developer')) return Key
                      if (cat.includes('image')) return Sparkles
                      return LucideLink
                    }
                    const Icon = getToolIcon(tool)

                    return (
                      <Link
                        key={tool.id}
                        to={`/tools/${tool.slug}`}
                        className="result-card group"
                        style={{ ['--reveal-delay' as any]: `${Math.min(index, 7) * 45}ms` }}
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <div className="flex items-center gap-3">
                              <div
                                className="icon-pill"
                                style={{
                                  background: 'color-mix(in srgb, ' + (tool.accent || 'var(--panel-strong)') + ' 76%, transparent)',
                                  color: tool.accentColor
                                }}
                              >
                                <Icon className="h-5 w-5 p-1" />
                              </div>
                              <div className="result-title">{tool.title}</div>
                            </div>
                            <div className="result-desc">{tool.shortDescription}</div>
                          </div>
                          <ArrowRight className="mt-1 h-4 w-4 text-[var(--muted)] transition group-hover:translate-x-0.5" />
                        </div>
                      </Link>
                    )
                  })}
                  {query && results.length === 0 && (
                    <div className="surface-card p-5 text-sm text-[var(--muted)]">
                      No nearby results matched that query. Try a broader term.
                    </div>
                  )}
                </div>
              </Card>
            </div>
          </div>

          <div aria-hidden="true" className="scene-link" />
        </div>
      </section>

      <div className="section-divider" aria-hidden="true" />

      <section data-reveal className="zone-section home-section-wrap space-y-5">
        <div className="zone-header">
          <div>
            <div className="section-kicker mono">Zone index</div>
            <h2 className="mt-3 text-2xl font-semibold text-[var(--text)] sm:text-3xl">Category lanes</h2>
            <p className="mt-2 max-w-xl text-sm leading-6 text-[var(--muted)]">
              Each lane is a distinct production zone. Enter with a goal, complete the flow, and export the result.
            </p>
          </div>
        </div>
        <div className="zone-grid zone-grid--top">
          {topCategoryCards.map((card, index) => {
            const Icon = card.icon
            return (
              <Link
                key={card.slug}
                to={`/tools/${card.slug}`}
                data-reveal
                className="zone-card group"
                style={{
                  background: card.accent,
                  ['--reveal-delay' as any]: `${Math.min(index, 2) * 90}ms`
                }}
              >
                <div className="zone-card__inner">
                  <div className="zone-card__top">
                    <div className="zone-icon" style={{ color: card.accentColor }}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <span className="zone-id mono">{card.zone}</span>
                  </div>
                  <div className="zone-title">{card.title}</div>
                  <div className="zone-desc">{card.description}</div>
                  <div className="zone-tags">
                    {card.tags.map(tag => (
                      <span key={tag} className="zone-tag">{tag}</span>
                    ))}
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
        <div className="zone-grid zone-grid--bottom">
          {bottomCategoryCards.map((card, index) => {
            const Icon = card.icon
            return (
              <Link
                key={card.slug}
                to={`/tools/${card.slug}`}
                data-reveal
                className="zone-card group"
                style={{
                  background: card.accent,
                  ['--reveal-delay' as any]: `${Math.min(index + 2, 4) * 90}ms`
                }}
              >
                <div className="zone-card__inner">
                  <div className="zone-card__top">
                    <div className="zone-icon" style={{ color: card.accentColor }}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <span className="zone-id mono">{card.zone}</span>
                  </div>
                  <div className="zone-title">{card.title}</div>
                  <div className="zone-desc">{card.description}</div>
                  <div className="zone-tags">
                    {card.tags.map(tag => (
                      <span key={tag} className="zone-tag">{tag}</span>
                    ))}
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      </section>

      <div className="section-divider" aria-hidden="true" />

      <section data-reveal id="featured-tools" className="workflow-section space-y-5">
        <div className="workflow-header">
          <div className="section-kicker mono">Featured workflows</div>
          <h2 className="mt-3 text-2xl font-semibold text-[var(--text)] sm:text-3xl">Curated pathways into the ToolZone stack</h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--muted)]">
            Each pathway is designed as a short production loop: input, refine, output. Pick the flow that matches the job.
          </p>
        </div>
        <div className="workflow-grid">
          {featured.slice(0, 6).map((tool, index) => {
            const meta = getWorkflowMeta(tool)
            const isHero = index === 0
            const workflowClass = isHero
              ? 'workflow-card workflow-card--hero'
              : index === 1
                ? 'workflow-card workflow-card--stacked'
                  : 'workflow-card'
            return (
              <Link
                key={tool.id}
                to={`/tools/${tool.slug}`}
                data-reveal
                className={workflowClass}
                style={{ ['--reveal-delay' as any]: `${Math.min(index, 5) * 85}ms` }}
              >
                <div className="workflow-card__body">
                  <div className="workflow-top">
                    <div className="workflow-index mono">Pathway 0{index + 1}</div>
                    <div className="mono text-xs uppercase tracking-[0.24em] text-[var(--muted)]">{tool.category}</div>
                    <div className="workflow-title">{tool.title}</div>
                    <div className="workflow-desc">{tool.shortDescription}</div>
                  </div>
                  <div className="workflow-meta">
                    <div className="workflow-purpose">
                      <div className="workflow-label">Purpose</div>
                      <div className="workflow-value">{meta.purpose}</div>
                    </div>
                    <div className="workflow-steps">
                      {meta.flow.map((step: string, stepIndex: number) => (
                        <span key={step} className="workflow-step">
                          <span className="workflow-step__index">0{stepIndex + 1}</span>
                          {step}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="workflow-footer">
                  <div className="workflow-counts">
                    {tool.inputTypes.length > 0 ? <span>{tool.inputTypes.length} input type{tool.inputTypes.length === 1 ? '' : 's'}</span> : <span />}
                    {tool.outputTypes.length > 0 ? <span>{tool.outputTypes.length} output type{tool.outputTypes.length === 1 ? '' : 's'}</span> : <span />}
                  </div>
                  <span className="workflow-cta">Open workflow</span>
                </div>
              </Link>
            )
          })}
        </div>
      </section>
    </div>
  )
}

export default Home
