import React, { useState } from 'react'
import { rotatePdfPages } from '../../lib/pdf/utils'

const RotatePdf: React.FC = () => {
  const [file, setFile] = useState<File | null>(null)
  const [rotation, setRotation] = useState<0 | 90 | 180 | 270>(90)
  const [resultUrl, setResultUrl] = useState('')

  const handleRotate = async () => {
    if (!file) return
    const blob = await rotatePdfPages(file, rotation)
    setResultUrl(URL.createObjectURL(blob))
  }

  return (
    <div className="space-y-4">
      <div className="surface-card rounded-2xl border border-[var(--border)] bg-[var(--panel-strong)] p-4">
        <input type="file" accept="application/pdf" onChange={event => setFile(event.target.files?.[0] || null)} />
      </div>

      <div className="flex flex-wrap gap-3">
        {[90, 180, 270].map(angle => (
          <button
            key={angle}
            onClick={() => setRotation(angle as 90 | 180 | 270)}
            className={`rounded-xl px-4 py-2 text-sm font-medium transition ${rotation === angle ? 'bg-[var(--text)] text-[var(--panel-strong)]' : 'border border-[var(--border)] bg-[var(--panel)] text-[var(--text)]'}`}
          >
            Rotate {angle}°
          </button>
        ))}
      </div>

      <div className="flex flex-wrap gap-2">
        <button disabled={!file} onClick={handleRotate} className="rounded-xl bg-[var(--text)] px-4 py-2 text-sm font-medium text-[var(--panel-strong)] disabled:opacity-50">
          Rotate PDF
        </button>
        <button onClick={() => { setFile(null); setResultUrl('') }} className="rounded-xl border border-[var(--border)] bg-[var(--panel)] px-4 py-2 text-sm font-medium text-[var(--text)]">
          Reset
        </button>
      </div>

      {resultUrl && (
        <div className="space-y-3 rounded-2xl border border-[var(--border)] bg-[var(--panel-strong)] p-4">
          <a href={resultUrl} target="_blank" rel="noreferrer" className="text-sm font-medium text-[var(--text)] underline">
            Preview rotated PDF
          </a>
          <div>
            <a href={resultUrl} download="rotated.pdf" className="rounded-xl bg-[var(--accent)] px-4 py-2 text-sm font-medium text-white">
              Download
            </a>
          </div>
        </div>
      )}
    </div>
  )
}

export default RotatePdf
