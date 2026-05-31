import React, { useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'

const ShortRedirect: React.FC = ()=>{
  const { id } = useParams()
  const apiBase = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:3001'

  useEffect(()=>{
    if(!id) return
    window.location.replace(`${apiBase}/s/${id}`)
  }, [apiBase, id])

  if(!id){
    return <div className="p-6">Short link not found. <Link to="/">Go home</Link></div>
  }

  return (
    <div className="p-6">
      Redirecting through the short-link service…
      <div className="mt-2 text-sm text-gray-500">
        If nothing happens, open <a href={`${apiBase}/s/${id}`} className="text-blue-600">the redirect URL</a>.
      </div>
    </div>
  )
}

export default ShortRedirect
