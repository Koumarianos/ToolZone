import React from 'react'

const Footer: React.FC = () => {
  return (
    <footer className="border-t border-[var(--border)] bg-[color:color-mix(in_srgb,var(--bg)_88%,transparent)] backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-7xl flex-col items-start justify-between gap-5 px-4 py-8 sm:px-6 lg:flex-row lg:items-center lg:px-8">
        <div>
          <div className="display text-lg font-bold">ToolZone</div>
          <div className="mt-1 max-w-xl text-sm text-[var(--muted)]">
            A focused workbench for PDF, web, text, developer, and image tasks.
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-3 text-xs uppercase tracking-[0.24em] text-[var(--muted)]">
          <span className="h-2 w-2 rounded-full bg-[var(--success)]" />
          <span className="text-[10px] font-medium tracking-[0.18em] normal-case sm:text-xs">developed by Konstantinos Koumarianos</span>
        </div>
      </div>
    </footer>
  )
}

export default Footer
