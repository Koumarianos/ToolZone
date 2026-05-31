const { PDFDocument } = require('pdf-lib')
const fs = require('fs')
const QRCode = require('qrcode')
const crypto = require('crypto')

async function testPdfMergeAndSplit(){
  // create two simple PDFs
  const pdf1 = await PDFDocument.create()
  pdf1.addPage([200,200]).drawText?.('Hello')
  const pdf1Bytes = await pdf1.save()

  const pdf2 = await PDFDocument.create()
  pdf2.addPage([200,200])
  const pdf2Bytes = await pdf2.save()

  // merge
  const merged = await PDFDocument.create()
  const donor1 = await PDFDocument.load(pdf1Bytes)
  const donor2 = await PDFDocument.load(pdf2Bytes)
  const copied1 = await merged.copyPages(donor1, donor1.getPageIndices())
  copied1.forEach(p=> merged.addPage(p))
  const copied2 = await merged.copyPages(donor2, donor2.getPageIndices())
  copied2.forEach(p=> merged.addPage(p))
  const mergedBytes = await merged.save()
  fs.writeFileSync('test-merged.pdf', mergedBytes)
  console.log('Merged PDF written, size:', mergedBytes.length)

  // split merged into single pages
  const loaded = await PDFDocument.load(mergedBytes)
  const pages = loaded.getPageCount()
  console.log('Merged has pages:', pages)
  for(let i=0;i<pages;i++){
    const newDoc = await PDFDocument.create()
    const [p] = await newDoc.copyPages(loaded, [i])
    newDoc.addPage(p)
    const bytes = await newDoc.save()
    fs.writeFileSync(`test-page-${i+1}.pdf`, bytes)
  }
  console.log('Split into individual pages')
}

async function testQr(){
  const dataUrl = await QRCode.toDataURL('https://example.com', { width: 128 })
  // strip header
  const base64 = dataUrl.split(',')[1]
  fs.writeFileSync('test-qr.png', Buffer.from(base64, 'base64'))
  console.log('QR generated')
}

function testPassword(){
  const length = 16
  const letters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  const symbols = '!@#$%^&*()_+-=[]{}|;:,.<>?'
  const chars = letters + symbols
  const bytes = crypto.randomBytes(length)
  let out = ''
  for(let i=0;i<length;i++) out += chars[bytes[i] % chars.length]
  fs.writeFileSync('test-password.txt', out)
  console.log('Password generated')
}

async function run(){
  try{
    await testPdfMergeAndSplit()
    await testQr()
    testPassword()
    console.log('Verification script completed successfully')
  }catch(e){
    console.error('Verification failed', e)
    process.exit(1)
  }
}

run()
