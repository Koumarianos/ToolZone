import React, { useState } from 'react'

function randomFrom(chars:string, length:number){
  const arr = new Uint32Array(length)
  crypto.getRandomValues(arr)
  return Array.from(arr).map(n=> chars[n % chars.length]).join('')
}

const PasswordGenerator: React.FC = ()=>{
  const [length, setLength] = useState(16)
  const [includeSymbols, setIncludeSymbols] = useState(true)
  const [value, setValue] = useState('')

  function generate(){
    const letters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
    const symbols = '!@#$%^&*()_+-=[]{}|;:,.<>?'
    const chars = letters + (includeSymbols? symbols: '')
    setValue(randomFrom(chars, length))
  }

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div>
          <label className="block text-sm">Length</label>
          <input type="number" value={length} onChange={e=>setLength(Number(e.target.value))} className="w-full border rounded p-2" />
        </div>
        <div className="flex items-end">
          <label className="flex items-center gap-2"><input type="checkbox" checked={includeSymbols} onChange={e=>setIncludeSymbols(e.target.checked)} /> Include symbols</label>
        </div>
        <div className="flex items-end">
          <button onClick={generate} className="px-4 py-2 bg-blue-600 text-white rounded">Generate</button>
        </div>
      </div>

      <div className="mt-4">
        <input value={value} readOnly className="w-full border rounded p-2" />
      </div>
    </div>
  )
}

export default PasswordGenerator
