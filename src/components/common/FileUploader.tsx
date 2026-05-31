import React, { useRef, useState } from 'react'
import { UploadCloud, File as FileIcon, Image as ImageIcon } from 'lucide-react'

type Props = {
  accept?: string
  multiple?: boolean
  onFiles: (files: FileList | File[]) => void
  label?: string
  hint?: string
}

const FileUploader: React.FC<Props> = ({ accept, multiple, onFiles, label = 'Drag & drop files here', hint }) => {
  const [drag, setDrag] = useState(false)
  const inputRef = useRef<HTMLInputElement | null>(null)

  const handleFiles = (files: FileList | null) => {
    if (!files) return
    onFiles(files)
  }

  return (
    <div>
      <div
        onDragOver={(e) => { e.preventDefault(); setDrag(true) }}
        onDragLeave={() => setDrag(false)}
        onDrop={(e) => { e.preventDefault(); setDrag(false); handleFiles(e.dataTransfer.files) }}
        className={`border-2 ${drag ? 'border-dashed border-[var(--accent-strong-1)] bg-[color:color-mix(in_srgb,var(--accent-strong-1)_6%,transparent)]' : 'border-dashed border-[var(--border)]'} rounded-lg p-6 text-center transition`}
      >
        <div className="flex items-center justify-center gap-3">
          <div className="icon-pill" style={{ width: 56, height: 56 }}>
            <UploadCloud className="h-6 w-6" />
          </div>
          <div className="text-left">
            <div className="font-semibold text-[var(--text)]">{label}</div>
            {hint && <div className="text-sm text-[var(--muted)] mt-1">{hint}</div>}
          </div>
        </div>

        <div className="mt-4 flex items-center justify-center gap-3">
          <button type="button" onClick={() => inputRef.current?.click()} className="px-4 py-2 bg-[var(--accent-strong-1)] text-white rounded">Choose files</button>
          <div className="text-sm text-[var(--muted)]">or drop files onto this area</div>
        </div>

        <input ref={inputRef} type="file" accept={accept} multiple={multiple} onChange={(e) => handleFiles(e.target.files)} className="hidden" />
      </div>
    </div>
  )
}

export default FileUploader
