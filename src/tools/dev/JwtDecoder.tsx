import React, { useState } from 'react'

function decodePart(part:string){
  try{ return JSON.parse(atob(part)) }catch{ return { raw: part } }
}

const JwtDecoder: React.FC = ()=>{
  const [token, setToken] = useState('')
  const [header, setHeader] = useState<any>(null)
  const [payload, setPayload] = useState<any>(null)

  function decode(){
    const parts = token.split('.')
    if(parts.length<2) return alert('Invalid token')
    setHeader(decodePart(parts[0]))
    setPayload(decodePart(parts[1]))
  }

  return (
    <div>
      <textarea value={token} onChange={e=>setToken(e.target.value)} rows={4} className="w-full border rounded p-2" placeholder="Paste JWT here" />
      <div className="mt-2 flex gap-2">
        <button onClick={decode} className="px-3 py-2 bg-blue-600 text-white rounded">Decode</button>
      </div>
      {header && <div className="mt-4">
        <div className="font-medium">Header</div>
        <pre className="bg-gray-100 p-3 rounded mt-2">{JSON.stringify(header, null, 2)}</pre>
      </div>}
      {payload && <div className="mt-4">
        <div className="font-medium">Payload</div>
        <pre className="bg-gray-100 p-3 rounded mt-2">{JSON.stringify(payload, null, 2)}</pre>
      </div>}
    </div>
  )
}

export default JwtDecoder
