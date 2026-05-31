import React, { useMemo, useState } from 'react'
import Input from '../../components/common/Input'
import Button from '../../components/common/Button'
import QRCode from 'qrcode'

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:3001'

const UrlShortener: React.FC = ()=>{
  const [longUrl, setLongUrl] = useState('')
  const [alias, setAlias] = useState('')
  const [expiry, setExpiry] = useState('never')
  const [shortUrl, setShortUrl] = useState<string | null>(null)
  const [qr, setQr] = useState<string | null>(null)
  const [analytics, setAnalytics] = useState<{ clicks: number; lastUsed: string | null; createdAt: string | null } | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  function validateUrl(u:string){
    try{ new URL(u); return true }catch{ return false }
  }

  const shortLabel = useMemo(() => shortUrl?.replace(API_BASE, '') ?? '', [shortUrl])

  async function generate(){
    if(!validateUrl(longUrl)) return alert('Enter a valid URL')
    setLoading(true)

    try{
      setError(null)
      const response = await fetch(`${API_BASE}/api/shorten`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ longUrl, alias: alias.trim() || undefined, expiry }),
      })

      const payload = await response.json()
      if (!response.ok) {
        throw new Error(payload?.message || 'Failed to shorten URL')
      }

      const url = payload.shortUrl as string
      setShortUrl(url)
      const q = await QRCode.toDataURL(url, { width: 200 })
      setQr(q)

      const statsResponse = await fetch(`${API_BASE}/api/stats/${payload.alias}`)
      if (statsResponse.ok) {
        const stats = await statsResponse.json()
        setAnalytics({
          clicks: stats.clicks ?? 0,
          lastUsed: stats.lastUsed ? new Date(stats.lastUsed).toLocaleString() : null,
          createdAt: stats.createdAt ? new Date(stats.createdAt).toLocaleString() : null,
        })
      } else {
        setAnalytics(null)
      }
    }catch(e:any){
      setError(e?.message || 'Failed to shorten URL')
    }
    
    setLoading(false)
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <label className="block text-sm font-medium">Long URL</label>
        <Input value={longUrl} onChange={e=>setLongUrl(e.target.value)} placeholder="https://example.com/path" />

        <label className="block text-sm font-medium mt-3">Custom alias (optional)</label>
        <Input value={alias} onChange={e=>setAlias(e.target.value)} placeholder="my-link" />
        <div className="mt-1 text-xs text-gray-500">Custom alias must be unique.</div>

        <label className="block text-sm font-medium mt-3">Expiration</label>
        <select value={expiry} onChange={e=>setExpiry(e.target.value)} className="w-full border rounded p-2">
          <option value="never">Never</option>
          <option value="1d">1 day</option>
          <option value="7d">7 days</option>
          <option value="30d">30 days</option>
        </select>

        <div className="mt-4 flex gap-2">
          <Button onClick={generate} disabled={loading} className="brand-btn">{loading? 'Generating...':'Shorten URL'}</Button>
          <Button onClick={()=>{ setLongUrl(''); setAlias(''); setShortUrl(null); setQr(null); setAnalytics(null) }} variant="ghost">Reset</Button>
        </div>
        {error && <div className="mt-3 rounded border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div>}
      </div>

      <div>
        <div className="surface-card p-4">
          <div className="text-sm text-[var(--muted)]">Result</div>
          {shortUrl ? (
            <div className="mt-3">
              <div className="break-all font-medium text-[var(--text)]">{shortUrl}</div>
              <div className="mt-1 text-xs text-[var(--muted)]">Path: {shortLabel}</div>
              <div className="mt-2 flex items-center gap-2">
                <a href={shortUrl} target="_blank" rel="noreferrer" className="text-sm font-medium text-[var(--accent)]">Open</a>
                <button onClick={()=>navigator.clipboard.writeText(shortUrl)} className="text-sm text-[var(--muted)]">Copy</button>
              </div>
              {qr && <img src={qr} alt="qr" className="mt-3 w-36" />}
              <div className="mt-3 text-sm font-medium text-[var(--text)]">Usage</div>
              <div className="mt-1 text-sm text-[var(--muted)]">Clicks: {analytics?.clicks ?? 0}</div>
              <div className="mt-1 text-sm text-[var(--muted)]">Created: {analytics?.createdAt ?? '—'}</div>
              <div className="mt-1 text-sm text-[var(--muted)]">Last used: {analytics?.lastUsed ?? 'Never'}</div>
            </div>
          ) : (
            <div className="mt-3 text-sm text-[var(--muted)]">No short URL yet. Enter a URL and click shorten.</div>
          )}
        </div>
      </div>
    </div>
  )
}

export default UrlShortener
