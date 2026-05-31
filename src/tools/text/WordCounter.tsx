import React, { useMemo, useState } from 'react'

const WordCounter: React.FC = ()=>{
  const [text, setText] = useState('')
  const words = useMemo(()=> text.trim().split(/\s+/).filter(Boolean).length, [text])
  const chars = useMemo(()=> text.length, [text])
  return (
    <div>
      <textarea value={text} onChange={e=>setText(e.target.value)} rows={8} className="w-full border rounded p-3" />
      <div className="mt-2 text-sm text-gray-600">Words: {words} • Characters: {chars}</div>
    </div>
  )
}

export default WordCounter
