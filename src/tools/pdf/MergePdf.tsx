import React, { useState } from 'react'
import { mergePdfFiles } from '../../lib/pdf/utils'
import FileUploader from '../../components/common/FileUploader'

const MergePdf: React.FC = ()=>{
  const [files, setFiles] = useState<File[]>([])
  
  const [resultBlob, setResultBlob] = useState<Blob | null>(null)
  const [resultUrl, setResultUrl] = useState('')

  function onFiles(flist: FileList | File[] | null){
    if(!flist) return
    const arr = Array.from(flist as any).filter(f=>f.type==='application/pdf')
    setFiles(prev=>[...prev, ...arr])
  }

  const handleMerge = async () => {
    if (!files || files.length === 0) return
    try {
      const blob = await mergePdfFiles(files)
      const url = URL.createObjectURL(blob)
      setResultBlob(blob)
      setResultUrl(url)
    } catch (e) {
      console.error(e)
      alert('Failed to merge PDFs')
    }
  }

  return (
    <div>
      <FileUploader accept="application/pdf" multiple onFiles={onFiles} label="Drop PDFs to merge" hint="Reorder after upload, then click Merge" />

      <div className="mt-4">
        {files.map((f, idx)=> (
          <div key={idx} className="flex items-center justify-between p-2 border-b">
            <div>
              <div className="font-medium">{f.name}</div>
              <div className="text-sm text-gray-500">{(f.size/1024).toFixed(1)} KB</div>
            </div>
            <div className="flex gap-2">
              <button onClick={()=> setFiles(prev=> prev.filter((_,i)=>i!==idx))} className="text-sm text-red-500">Remove</button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 flex gap-2">
        <button disabled={files.length<2} onClick={handleMerge} className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50">Merge PDFs</button>
        <button onClick={()=>{setFiles([]); setResultBlob(null); setResultUrl('')}} className="px-4 py-2 border rounded">Reset</button>
      </div>

      {resultUrl && resultBlob && (
        <div className="mt-4 p-4 border rounded">
          <div className="mb-2 font-medium">Result</div>
          <div className="mb-2">
            <a href={resultUrl} target="_blank" rel="noreferrer" className="text-blue-600 underline">Preview merged PDF</a>
          </div>
          <div className="flex gap-2">
            <a href={resultUrl} download="merged.pdf" className="px-4 py-2 bg-green-600 text-white rounded">Download</a>
            <button onClick={()=>{ setResultBlob(null); setResultUrl('') }} className="px-4 py-2 border rounded">Clear Result</button>
          </div>
        </div>
      )}
    </div>
  )
}

export default MergePdf
