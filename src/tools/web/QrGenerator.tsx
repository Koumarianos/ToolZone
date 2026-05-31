import React, { useState } from 'react'
import QRCode from 'qrcode'

const QrGenerator: React.FC = ()=>{
  const [text, setText] = useState('https://example.com')
  const [size, setSize] = useState(256)
  const [dataUrl, setDataUrl] = useState<string | null>(null)

  async function generate(){
    try{
      const url = await QRCode.toDataURL(text, { width: size })
      setDataUrl(url)
    }catch(e){
      console.error(e)
    }
  }

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium">Text or URL</label>
          <input value={text} onChange={e=>setText(e.target.value)} className="w-full border rounded p-2" />
        </div>
        <div>
          <label className="block text-sm font-medium">Size (px)</label>
          <input type="number" value={size} onChange={e=>setSize(Number(e.target.value))} className="w-full border rounded p-2" />
        </div>
      </div>
      <div className="mt-4 flex gap-2">
        <button onClick={generate} className="px-4 py-2 bg-blue-600 text-white rounded">Generate</button>
        <button onClick={()=>{setDataUrl(null); setText('');}} className="px-4 py-2 border rounded">Reset</button>
      </div>

      {dataUrl && (
        <div className="mt-4">
          <img src={dataUrl} alt="qr" />
          <div className="mt-2">
            <a href={dataUrl} download="qr.png" className="px-3 py-2 bg-green-600 text-white rounded">Download PNG</a>
          </div>
        </div>
      )}
    </div>
  )
}

export default QrGenerator
