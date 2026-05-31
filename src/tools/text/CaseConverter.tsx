import React, { useState } from 'react'
import Button from '../../components/common/Button'

const CaseConverter: React.FC = ()=>{
  const [text, setText] = useState('')
  return (
    <div>
      <textarea value={text} onChange={e=>setText(e.target.value)} rows={8} className="w-full border rounded p-3" />
      <div className="mt-3 flex gap-2">
        <Button onClick={()=>setText(t=>t.toUpperCase())}>UPPERCASE</Button>
        <Button onClick={()=>setText(t=>t.toLowerCase())}>lowercase</Button>
        <Button onClick={()=>setText(t=>t.replace(/\w\S*/g, w=> w.charAt(0).toUpperCase()+w.slice(1).toLowerCase()))}>Title Case</Button>
        <Button onClick={()=>setText(t=>t.replace(/\n/g,' '))} variant="ghost">One Line</Button>
      </div>
    </div>
  )
}

export default CaseConverter
