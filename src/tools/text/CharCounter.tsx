import React, { useMemo, useState } from 'react'

const CharCounter: React.FC = ()=>{
  const [text, setText] = useState('')
  const chars = useMemo(()=> text.length, [text])
  const bytes = useMemo(()=> new Blob([text]).size, [text])
  return (
    <div>
      <textarea value={text} onChange={e=>setText(e.target.value)} rows={8} className="w-full border rounded p-3" />
      <div className="mt-2 text-sm text-gray-600">Characters: {chars} • Bytes: {bytes}</div>
    </div>
  )
}

export default CharCounter
