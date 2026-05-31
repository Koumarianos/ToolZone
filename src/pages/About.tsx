import React from 'react'
import { Link } from 'react-router-dom'
import { ExternalLink, Github, GraduationCap, Sparkles } from 'lucide-react'

const About: React.FC = () => {
  return (
    <div className="space-y-8 lg:space-y-10">
      <section className="surface-panel overflow-hidden p-6 sm:p-8 lg:p-10">
        <div className="ui-badge w-fit">
          <span className="h-2 w-2 rounded-full bg-[var(--success)]" />
          About the project
        </div>

        <div className="mt-6 grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
          <div className="space-y-5">
            <p className="mono text-xs uppercase tracking-[0.28em] text-[var(--muted)]">ToolZone / authored by Konstantinos Koumarianos</p>
            <h1 className="display max-w-2xl text-4xl leading-[0.95] text-[var(--text)] sm:text-5xl lg:text-6xl">
              A practical toolkit built as a personal product, not a demo shell.
            </h1>
            <p className="max-w-3xl text-base leading-7 text-[var(--muted)] sm:text-lg">
              ToolZone is a browser-first utility suite focused on doing a small set of everyday jobs very well: PDF work,
              quick web utilities, text transformations, developer helpers, and lightweight image operations. The goal is
              a clean, shippable interface with a real information hierarchy and no placeholder-flavored design.
            </p>
            <p className="max-w-3xl text-base leading-7 text-[var(--muted)] sm:text-lg">
              The project is created and maintained by me, <strong className="text-[var(--text)]">Konstantinos Koumarianos</strong>.
              I am a student at the <strong className="text-[var(--text)]">University of Athens, Greece</strong>, in the
              <strong className="text-[var(--text)]"> Department of Informatics and Telecommunications</strong>.
            </p>
          </div>

          <div className="space-y-4">
            <div className="surface-card p-5">
              <div className="flex items-center gap-3 text-[var(--text)]">
                <GraduationCap className="h-5 w-5 text-[var(--accent-2)]" />
                <div>
                  <div className="text-sm font-semibold">Student profile</div>
                  <div className="text-sm text-[var(--muted)]">University of Athens, Greece</div>
                </div>
              </div>
              <div className="mt-4 text-sm leading-6 text-[var(--muted)]">
                Department of Informatics and Telecommunications, where the project and its product thinking are being shaped.
              </div>
            </div>

            <div className="surface-card p-5">
              <div className="flex items-center gap-3 text-[var(--text)]">
                <Github className="h-5 w-5 text-[var(--accent)]" />
                <div>
                  <div className="text-sm font-semibold">GitHub</div>
                  <div className="text-sm text-[var(--muted)]">github.com/Koumarianos</div>
                </div>
              </div>
              <a
                href="https://github.com/Koumarianos"
                target="_blank"
                rel="noreferrer"
                className="mt-4 inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[color:color-mix(in_srgb,var(--panel-strong)_86%,transparent)] px-4 py-2 text-sm font-semibold text-[var(--text)] transition hover:-translate-y-0.5 hover:shadow-md"
              >
                Open profile
                <ExternalLink className="h-4 w-4" />
              </a>
            </div>

            <div className="surface-card p-5">
              <div className="flex items-center gap-3 text-[var(--text)]">
                <Sparkles className="h-5 w-5 text-[var(--success)]" />
                <div>
                  <div className="text-sm font-semibold">Design intent</div>
                  <div className="text-sm text-[var(--muted)]">Serious, usable, and polished</div>
                </div>
              </div>
              <p className="mt-4 text-sm leading-6 text-[var(--muted)]">
                The UI intentionally avoids a generic SaaS feel. It is meant to read like a crafted utility product with
                clear motion, strong hierarchy, and practical mobile behavior.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        <div className="surface-card p-5">
          <div className="mono text-xs uppercase tracking-[0.26em] text-[var(--muted)]">What it does</div>
          <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
            Provides fast, clear utilities for common digital workflows without hiding the output behind unnecessary UI.
          </p>
        </div>
        <div className="surface-card p-5">
          <div className="mono text-xs uppercase tracking-[0.26em] text-[var(--muted)]">What it values</div>
          <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
            Maintainability, legible structure, responsive behavior, and a design system that can support future expansion.
          </p>
        </div>
        <div className="surface-card p-5">
          <div className="mono text-xs uppercase tracking-[0.26em] text-[var(--muted)]">Where to find me</div>
          <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
            GitHub: <a className="font-semibold text-[var(--text)] underline decoration-[var(--border)] underline-offset-4" href="https://github.com/Koumarianos" target="_blank" rel="noreferrer">Koumarianos</a>
          </p>
        </div>
      </section>
      <div className="flex justify-start">
        <Link to="/" className="text-sm font-medium text-[var(--muted)] transition hover:text-[var(--text)]">Back to home</Link>
      </div>
    </div>
  )
}

export default About