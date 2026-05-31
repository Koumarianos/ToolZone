import React, { useState } from 'react'
import Button from '../../components/common/Button'
import Input from '../../components/common/Input'

const JsonFormatter: React.FC = ()=>{
  const [text, setText] = useState('')
  const [error, setError] = useState<string | null>(null)

  function format(){
    try{
      const parsed = JSON.parse(text)
      setText(JSON.stringify(parsed, null, 2))
      setError(null)
    }catch(e:any){ setError(e.message) }
  }

  function minify(){
    try{ const parsed = JSON.parse(text); setText(JSON.stringify(parsed)); setError(null) }catch(e:any){ setError(e.message) }
  }

  return (
    <div>
      <div className="mb-2 flex gap-2">
        <Button onClick={format}>Format</Button>
        <Button onClick={minify} variant="ghost">Minify</Button>
        <Button onClick={()=>{ navigator.clipboard.writeText(text) }} variant="ghost">Copy</Button>
      </div>
      <textarea value={text} onChange={e=>setText(e.target.value)} rows={12} className="w-full border rounded p-3 text-sm font-mono" />
      {error && <div className="mt-2 text-sm text-red-600">Error: {error}</div>}
    </div>
  )
}

export default JsonFormatter
