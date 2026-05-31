import React, { useMemo, useState } from 'react'
import { deletePdfPages } from '../../lib/pdf/utils'

const parsePages = (value: string) => {
  return value
    .split(',')
    .map(chunk => Number(chunk.trim()))
    .filter(pageNumber => Number.isInteger(pageNumber) && pageNumber > 0)
}

const DeletePdfPages: React.FC = () => {
  const [file, setFile] = useState<File | null>(null)
  const [pages, setPages] = useState('')
  const [resultUrl, setResultUrl] = useState('')
  const parsedPages = useMemo(() => parsePages(pages), [pages])

  const handleDelete = async () => {
    if (!file || parsedPages.length === 0) return
    const blob = await deletePdfPages(file, parsedPages)
    setResultUrl(URL.createObjectURL(blob))
  }

  return (
    <div className="space-y-4">
      <div className="surface-card rounded-2xl border border-[var(--border)] bg-[var(--panel-strong)] p-4">
        <input type="file" accept="application/pdf" onChange={event => setFile(event.target.files?.[0] || null)} />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-[var(--text)]">Pages to delete</label>
        <input
          value={pages}
          onChange={event => setPages(event.target.value)}
          placeholder="Example: 2,4,7"
          className="w-full rounded-2xl border border-[var(--border)] bg-[var(--panel)] px-4 py-3 text-[var(--text)] outline-none placeholder:text-[var(--muted)]"
        />
        <div className="text-xs text-[var(--muted)]">Use 1-based page numbers separated by commas.</div>
      </div>

      <div className="flex flex-wrap gap-2">
        <button disabled={!file || parsedPages.length === 0} onClick={handleDelete} className="rounded-xl bg-[var(--text)] px-4 py-2 text-sm font-medium text-[var(--panel-strong)] disabled:opacity-50">
          Delete pages
        </button>
        <button onClick={() => { setFile(null); setPages(''); setResultUrl('') }} className="rounded-xl border border-[var(--border)] bg-[var(--panel)] px-4 py-2 text-sm font-medium text-[var(--text)]">
          Reset
        </button>
      </div>

      {resultUrl && (
        <div className="space-y-3 rounded-2xl border border-[var(--border)] bg-[var(--panel-strong)] p-4">
          <a href={resultUrl} target="_blank" rel="noreferrer" className="text-sm font-medium text-[var(--text)] underline">
            Preview cleaned PDF
          </a>
          <div>
            <a href={resultUrl} download="pages-removed.pdf" className="rounded-xl bg-[var(--accent)] px-4 py-2 text-sm font-medium text-white">
              Download
            </a>
          </div>
        </div>
      )}
    </div>
  )
}

export default DeletePdfPages
