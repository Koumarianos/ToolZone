import React, { useState } from 'react'
import Button from '../../components/common/Button'
import { v4 as uuidv4 } from 'uuid'

const UuidGenerator: React.FC = ()=>{
  const [value, setValue] = useState('')
  function gen(){ setValue(uuidv4()) }
  return (
    <div>
      <div className="flex gap-2 mb-3">
        <Button onClick={gen}>Generate UUID</Button>
        <Button onClick={()=>{ setValue('') }} variant="ghost">Clear</Button>
      </div>
      <input value={value} readOnly className="w-full border rounded p-2 font-mono" />
    </div>
  )
}

export default UuidGenerator
