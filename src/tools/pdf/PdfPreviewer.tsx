import React, { useState } from 'react'

const PdfPreviewer: React.FC = ()=>{
  const [file, setFile] = useState<File | null>(null)
  const [url, setUrl] = useState('')

  const onChange = (f: File | null) => {
    setFile(f)
    if(!f){ setUrl(''); return }
    setUrl(URL.createObjectURL(f))
  }

  return (
    <div>
      <div className="p-4 border rounded">
        <input type="file" accept="application/pdf" onChange={e=>onChange(e.target.files?.[0]||null)} />
      </div>
      {file && url && (
        <div className="mt-4">
          <div className="mb-2 font-medium">Preview</div>
          <div className="border rounded overflow-hidden">
            <object data={url} type="application/pdf" width="100%" height={600}>
              <p>Your browser does not support inline PDF preview. <a href={url} target="_blank" rel="noreferrer">Open PDF</a></p>
            </object>
          </div>
          <div className="mt-3 flex gap-2">
            <a href={url} download={file.name} className="px-4 py-2 bg-green-600 text-white rounded">Download</a>
            <button onClick={()=>{ setFile(null); setUrl('') }} className="px-4 py-2 border rounded">Clear</button>
          </div>
        </div>
      )}
    </div>
  )
}

export default PdfPreviewer
