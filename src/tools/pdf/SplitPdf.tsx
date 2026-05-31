import React, { useState } from 'react'
import { splitPdf } from '../../lib/pdf/utils'
import JSZip from 'jszip'
import { saveAs } from 'file-saver'

const SplitPdf: React.FC = ()=>{
  const [file, setFile] = useState<File | null>(null)
  const [parts, setParts] = useState<{name:string;blob:Blob}[]>([])
  const [loading, setLoading] = useState(false)

  async function handleSplit(){
    if(!file) return
    setLoading(true)
    const p = await splitPdf(file)
    setParts(p)
    setLoading(false)
  }

  async function downloadZip(){
    const zip = new JSZip()
    parts.forEach(p=> zip.file(p.name, p.blob))
    const content = await zip.generateAsync({ type: 'blob' })
    saveAs(content, 'split-parts.zip')
  }

  return (
    <div>
      <div className="p-4 border rounded">
        <input type="file" accept="application/pdf" onChange={e=>setFile(e.target.files?.[0]||null)} />
      </div>
      <div className="mt-4 flex gap-2">
        <button disabled={!file || loading} onClick={handleSplit} className="px-4 py-2 bg-blue-600 text-white rounded">Split PDF</button>
        <button onClick={()=>{setFile(null); setParts([])}} className="px-4 py-2 border rounded">Reset</button>
      </div>

      <div className="mt-4">
        {loading && <div>Processing...</div>}
        {parts.length>0 && (
          <div>
            <div className="mb-2 font-medium">Parts</div>
            <ul>
              {parts.map(p=> (
                <li key={p.name} className="flex items-center justify-between p-2 border-b">
                  <div>{p.name}</div>
                  <a href={URL.createObjectURL(p.blob)} download={p.name} className="text-blue-600">Download</a>
                </li>
              ))}
            </ul>
            <div className="mt-3">
              <button onClick={downloadZip} className="px-4 py-2 bg-green-600 text-white rounded">Download All (Zip)</button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default SplitPdf
