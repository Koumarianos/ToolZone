import React, { useState } from 'react'
import { imagesToPdf } from '../../lib/pdf/utils'
import FileUploader from '../../components/common/FileUploader'

const JpgToPdf: React.FC = ()=>{
  const [files, setFiles] = useState<File[]>([])
  const [resultBlob, setResultBlob] = useState<Blob | null>(null)
  const [resultUrl, setResultUrl] = useState('')

  function onFiles(flist: FileList | File[] | null){
    if(!flist) return
    const arr = Array.from(flist as any).filter(f=> f.type.startsWith('image/'))
    setFiles(prev=>[...prev, ...arr])
  }

  const handleCreate = async () => {
    if (files.length === 0) return
    try {
      const blob = await imagesToPdf(files)
      const url = URL.createObjectURL(blob)
      setResultBlob(blob)
      setResultUrl(url)
    } catch (e) {
      console.error(e)
      alert('Failed to create PDF')
    }
  }

  return (
    <div>
      <FileUploader accept="image/*" multiple onFiles={onFiles} label="Drop images here" hint="PNG/JPG/SVG — reorder and then create a PDF" />
      <div className="mt-4">
        {files.map((f,i)=> (
          <div key={i} className="flex items-center justify-between p-2 border-b">
            <div>{f.name}</div>
            <button onClick={()=> setFiles(prev=> prev.filter((_,idx)=>idx!==i))} className="text-sm text-red-500">Remove</button>
          </div>
        ))}
      </div>
      <div className="mt-4 flex gap-2">
        <button disabled={files.length===0} onClick={handleCreate} className="px-4 py-2 bg-blue-600 text-white rounded">Create PDF</button>
        <button onClick={()=>{setFiles([]); setResultBlob(null); setResultUrl('')}} className="px-4 py-2 border rounded">Reset</button>
      </div>

      {resultUrl && resultBlob && (
        <div className="mt-4 p-4 border rounded">
          <div className="mb-2 font-medium">Result</div>
          <div className="mb-2">
            <a href={resultUrl} target="_blank" rel="noreferrer" className="text-blue-600 underline">Preview PDF</a>
          </div>
          <div className="flex gap-2">
            <a href={resultUrl} download="images.pdf" className="px-4 py-2 bg-green-600 text-white rounded">Download</a>
            <button onClick={()=>{ setResultBlob(null); setResultUrl('') }} className="px-4 py-2 border rounded">Clear Result</button>
          </div>
        </div>
      )}
    </div>
  )
}

export default JpgToPdf
