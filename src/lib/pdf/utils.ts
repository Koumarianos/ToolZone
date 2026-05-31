import { PDFDocument } from 'pdf-lib'

export async function mergePdfFiles(files: File[]) {
  const merged = await PDFDocument.create()
  for (const file of files) {
    const data = await file.arrayBuffer()
    const donor = await PDFDocument.load(data)
    const copied = await merged.copyPages(donor, donor.getPageIndices())
    copied.forEach(p=> merged.addPage(p))
  }
  const out = await merged.save()
  const blob = new Blob([out], { type: 'application/pdf' })
  return blob
}

export async function splitPdf(file: File) {
  const data = await file.arrayBuffer()
  const doc = await PDFDocument.load(data)
  const pages = doc.getPageCount()
  const parts: { name: string; blob: Blob }[] = []
  for (let i=0;i<pages;i++){
    const newDoc = await PDFDocument.create()
    const [p] = await newDoc.copyPages(doc, [i])
    newDoc.addPage(p)
    const bytes = await newDoc.save()
    parts.push({ name: `page-${i+1}.pdf`, blob: new Blob([bytes], { type: 'application/pdf' }) })
  }
  return parts
}

export async function imagesToPdf(files: File[]) {
  const pdf = await PDFDocument.create()
  for (const file of files){
    const data = await file.arrayBuffer()
    const type = file.type
    let img
    if(type==='image/png') img = await pdf.embedPng(data)
    else img = await pdf.embedJpg(data)
    const page = pdf.addPage([img.width, img.height])
    page.drawImage(img, { x:0,y:0,width:img.width,height:img.height })
  }
  const out = await pdf.save()
  const blob = new Blob([out], { type: 'application/pdf' })
  return blob
}

export async function rotatePdfPages(file: File, rotation: 0 | 90 | 180 | 270) {
  const data = await file.arrayBuffer()
  const doc = await PDFDocument.load(data)
  doc.getPages().forEach(page => {
    page.setRotation({ angle: rotation })
  })
  const out = await doc.save()
  return new Blob([out], { type: 'application/pdf' })
}

export async function deletePdfPages(file: File, pagesToDelete: number[]) {
  const data = await file.arrayBuffer()
  const doc = await PDFDocument.load(data)
  const pages = doc.getPages()
  const keepIndexes = pages.map((_, index) => index).filter(index => !pagesToDelete.includes(index + 1))
  const newDoc = await PDFDocument.create()
  const copied = await newDoc.copyPages(doc, keepIndexes)
  copied.forEach(page => newDoc.addPage(page))
  const out = await newDoc.save()
  return new Blob([out], { type: 'application/pdf' })
}
