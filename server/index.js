const express = require('express')
const cors = require('cors')
const fs = require('fs')
const path = require('path')

const app = express()
const PORT = process.env.PORT || 3001
const DB_FILE = path.join(__dirname, 'db.json')
const TTL_MS = {
  never: null,
  '1d': 24 * 60 * 60 * 1000,
  '7d': 7 * 24 * 60 * 60 * 1000,
  '30d': 30 * 24 * 60 * 60 * 1000,
}

app.use(cors())
app.use(express.json())

function loadDb() {
  try {
    const raw = fs.readFileSync(DB_FILE, 'utf8')
    const parsed = JSON.parse(raw)
    if (!parsed || typeof parsed !== 'object') return { links: {} }
    if (!parsed.links || typeof parsed.links !== 'object') return { links: {} }
    return parsed
  } catch {
    return { links: {} }
  }
}

function saveDb(db) {
  fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2))
}

function normalizeAlias(alias) {
  return String(alias || '').trim().toLowerCase()
}

function isValidUrl(value) {
  try {
    new URL(value)
    return true
  } catch {
    return false
  }
}

function createAlias(length = 7) {
  return Math.random().toString(36).slice(2, 2 + length)
}

function getBaseUrl(req) {
  const host = req.headers['x-forwarded-host'] || req.headers.host
  const proto = req.headers['x-forwarded-proto'] || req.protocol || 'http'
  return `${proto}://${host}`
}

function isExpired(link) {
  if (!link || !link.expiry || link.expiry === 'never') return false
  const ttl = TTL_MS[link.expiry]
  if (!ttl) return false
  return Date.now() - link.createdAt > ttl
}

app.get('/api/check/:alias', (req, res) => {
  const alias = normalizeAlias(req.params.alias)
  const db = loadDb()
  const link = db.links[alias]
  res.json({
    alias,
    available: !link,
    exists: Boolean(link),
    expired: Boolean(link && isExpired(link)),
  })
})

app.get('/api/stats/:alias', (req, res) => {
  const alias = normalizeAlias(req.params.alias)
  const db = loadDb()
  const link = db.links[alias]

  if (!link) {
    return res.status(404).json({ message: 'Alias not found' })
  }

  return res.json({
    alias,
    clicks: link.clicks || 0,
    lastUsed: link.lastUsed || null,
    createdAt: link.createdAt,
    expiry: link.expiry,
    used: Boolean(link.used),
    expired: isExpired(link),
  })
})

app.post('/api/shorten', (req, res) => {
  const longUrl = String(req.body?.longUrl || '').trim()
  const requestedAlias = normalizeAlias(req.body?.alias)
  const expiry = TTL_MS.hasOwnProperty(req.body?.expiry) ? req.body.expiry : 'never'

  if (!isValidUrl(longUrl)) {
    return res.status(400).json({ code: 'INVALID_URL', message: 'Enter a valid URL' })
  }

  const db = loadDb()
  let alias = requestedAlias || createAlias()

  if (requestedAlias && db.links[requestedAlias] && !isExpired(db.links[requestedAlias])) {
    return res.status(409).json({ code: 'ALIAS_TAKEN', message: 'Alias is already used' })
  }

  while (db.links[alias] && !isExpired(db.links[alias])) {
    alias = createAlias()
  }

  db.links[alias] = {
    alias,
    longUrl,
    createdAt: Date.now(),
    expiry,
    clicks: 0,
    lastUsed: null,
    used: false,
  }

  saveDb(db)

  return res.status(201).json({
    alias,
    shortUrl: `${getBaseUrl(req)}/s/${alias}`,
    createdAt: db.links[alias].createdAt,
    expiry,
  })
})

app.get('/s/:alias', (req, res) => {
  const alias = normalizeAlias(req.params.alias)
  const db = loadDb()
  const link = db.links[alias]

  if (!link) {
    return res.status(404).send('Short link not found')
  }

  if (isExpired(link)) {
    return res.status(410).send('Short link expired')
  }

  link.clicks = (link.clicks || 0) + 1
  link.lastUsed = Date.now()
  link.used = true
  db.links[alias] = link
  saveDb(db)

  return res.redirect(302, link.longUrl)
})

app.get('/api/health', (_req, res) => {
  res.json({ ok: true })
})

app.listen(PORT, () => {
  console.log(`ToolZone backend running on http://localhost:${PORT}`)
})
