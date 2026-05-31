import { useEffect, useMemo, useRef, useState, type DragEvent } from 'react'
import { Download, FileDown, FileImage, FileText, Image as ImageIcon, UploadCloud } from 'lucide-react'
import { jsPDF } from 'jspdf'
import { GlobalWorkerOptions, getDocument } from 'pdfjs-dist/build/pdf.mjs'

type ConversionMode = 'png-to-jpg' | 'jpg-to-png' | 'image-to-pdf' | 'pdf-to-png'
type PdfPagePreset = 'A4-PORTRAIT' | 'A4-LANDSCAPE' | 'CUSTOM'

type ImageToolsProps = {
  initialMode?: ConversionMode
}

const IMAGE_ACCEPT = 'image/png,image/jpeg'
const PDF_ACCEPT = 'application/pdf'

GlobalWorkerOptions.workerSrc = new URL('pdfjs-dist/build/pdf.worker.min.mjs', import.meta.url).toString()

const getBaseName = (name: string) => name.replace(/\.[^.]+$/, '')

const fileExtFromType = (type: string, fallback: string) => {
  if (type === 'image/png') return 'png'
  if (type === 'image/jpeg') return 'jpg'
  if (type === 'application/pdf') return 'pdf'
  return fallback
}

const sanitizeDimension = (value: string, fallback: number, minimum = 10, maximum = 2000) => {
  const parsed = Number(value)
  if (!Number.isFinite(parsed)) return fallback
  return Math.min(maximum, Math.max(minimum, parsed))
}

const loadImage = (file: File) => {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const objectUrl = URL.createObjectURL(file)
    const image = new globalThis.Image()
    image.decoding = 'async'
    image.onload = () => {
      URL.revokeObjectURL(objectUrl)
      resolve(image)
    }
    image.onerror = () => {
      URL.revokeObjectURL(objectUrl)
      reject(new Error('The selected image could not be loaded.'))
    }
    image.src = objectUrl
  })
}

const canvasToBlob = (canvas: HTMLCanvasElement, type: string, quality?: number) => {
  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      blob => {
        if (!blob) {
          reject(new Error('The browser could not create the converted file.'))
          return
        }
        resolve(blob)
      },
      type,
      quality
    )
  })
}

const downloadBlob = (blob: Blob, fileName: string) => {
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = fileName
  anchor.rel = 'noopener'
  document.body.appendChild(anchor)
  anchor.click()
  anchor.remove()
  URL.revokeObjectURL(url)
}

const downloadDataUrl = (dataUrl: string, fileName: string) => {
  const anchor = document.createElement('a')
  anchor.href = dataUrl
  anchor.download = fileName
  anchor.rel = 'noopener'
  document.body.appendChild(anchor)
  anchor.click()
  anchor.remove()
}

const fitImageToPdfPage = (imageWidth: number, imageHeight: number, pageWidth: number, pageHeight: number) => {
  const imageRatio = imageWidth / imageHeight
  const pageRatio = pageWidth / pageHeight

  let renderWidth = pageWidth
  let renderHeight = pageHeight

  if (imageRatio > pageRatio) {
    renderWidth = pageWidth
    renderHeight = renderWidth / imageRatio
  } else {
    renderHeight = pageHeight
    renderWidth = renderHeight * imageRatio
  }

  const x = (pageWidth - renderWidth) / 2
  const y = (pageHeight - renderHeight) / 2

  return { x, y, renderWidth, renderHeight }
}

const ImageToBase64 = ({ initialMode = 'png-to-jpg' }: ImageToolsProps) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [conversionMode, setConversionMode] = useState<ConversionMode>(initialMode)
  const [pdfPreset, setPdfPreset] = useState<PdfPagePreset>('A4-PORTRAIT')
  const [customPageWidth, setCustomPageWidth] = useState('210')
  const [customPageHeight, setCustomPageHeight] = useState('297')
  const [jpegQuality, setJpegQuality] = useState('0.9')
  const [busy, setBusy] = useState(false)
  const [dragging, setDragging] = useState(false)
  const [error, setError] = useState('')
  const [status, setStatus] = useState('')

  const modeOptions = useMemo(() => ([
    { value: 'png-to-jpg' as const, label: 'PNG to JPG', hint: 'Convert transparent PNGs to compressed JPGs' },
    { value: 'jpg-to-png' as const, label: 'JPG to PNG', hint: 'Re-export JPGs as lossless PNGs' },
    { value: 'image-to-pdf' as const, label: 'Image to PDF', hint: 'Export PNG/JPG to a PDF page' },
    { value: 'pdf-to-png' as const, label: 'PDF to PNG', hint: 'Render the first page as a PNG download' },
  ]), [])

  const activeMode = modeOptions.find(option => option.value === conversionMode)

  useEffect(() => {
    setConversionMode(initialMode)
  }, [initialMode])

  const isImageFile = !!selectedFile && selectedFile.type.startsWith('image/')
  const isPdfFile = !!selectedFile && selectedFile.type === 'application/pdf'

  const canUseMode =
    (conversionMode === 'pdf-to-png' && isPdfFile) ||
    (conversionMode !== 'pdf-to-png' && isImageFile)

  const resetFeedback = () => {
    setError('')
    setStatus('')
  }

  const acceptFile = (file: File | null) => {
    resetFeedback()
    if (!file) return

    const supportedType = file.type.startsWith('image/') || file.type === PDF_ACCEPT
    if (!supportedType) {
      setSelectedFile(null)
      setError('Please choose a PNG, JPG, or PDF file.')
      return
    }

    setSelectedFile(file)
    if (file.type === PDF_ACCEPT) {
      setConversionMode('pdf-to-png')
    } else if (conversionMode === 'pdf-to-png') {
      setConversionMode('png-to-jpg')
    }
  }

  const onBrowse = () => fileInputRef.current?.click()

  const convertImageToJpeg = async (file: File) => {
    const image = await loadImage(file)
    const canvas = document.createElement('canvas')
    canvas.width = image.naturalWidth || image.width
    canvas.height = image.naturalHeight || image.height

    const context = canvas.getContext('2d')
    if (!context) throw new Error('Canvas rendering is not supported in this browser.')

    context.fillStyle = '#ffffff'
    context.fillRect(0, 0, canvas.width, canvas.height)
    context.drawImage(image, 0, 0)

    const quality = Number(jpegQuality)
    const dataUrl = canvas.toDataURL('image/jpeg', Number.isFinite(quality) ? Math.min(1, Math.max(0.5, quality)) : 0.9)
    downloadDataUrl(dataUrl, `${getBaseName(file.name)}.jpg`)
  }

  const convertImageToPng = async (file: File) => {
    const image = await loadImage(file)
    const canvas = document.createElement('canvas')
    canvas.width = image.naturalWidth || image.width
    canvas.height = image.naturalHeight || image.height

    const context = canvas.getContext('2d')
    if (!context) throw new Error('Canvas rendering is not supported in this browser.')

    context.drawImage(image, 0, 0)
    const dataUrl = canvas.toDataURL('image/png')
    downloadDataUrl(dataUrl, `${getBaseName(file.name)}.png`)
  }

  const convertImageToPdf = async (file: File) => {
    const image = await loadImage(file)
    const sourceWidth = image.naturalWidth || image.width
    const sourceHeight = image.naturalHeight || image.height
    if (!sourceWidth || !sourceHeight) {
      throw new Error('The selected image has invalid dimensions.')
    }

    let pageWidth = 210
    let pageHeight = 297
    if (pdfPreset === 'A4-LANDSCAPE') {
      pageWidth = 297
      pageHeight = 210
    } else if (pdfPreset === 'CUSTOM') {
      pageWidth = sanitizeDimension(customPageWidth, 210, 50, 1000)
      pageHeight = sanitizeDimension(customPageHeight, 297, 50, 1000)
    }

    const pdf = new jsPDF({
      orientation: pageWidth >= pageHeight ? 'landscape' : 'portrait',
      unit: 'mm',
      format: [pageWidth, pageHeight],
      compress: true,
    })

    const canvas = document.createElement('canvas')
    canvas.width = sourceWidth
    canvas.height = sourceHeight
    const context = canvas.getContext('2d')
    if (!context) throw new Error('Canvas rendering is not supported in this browser.')

    context.fillStyle = '#ffffff'
    context.fillRect(0, 0, canvas.width, canvas.height)
    context.drawImage(image, 0, 0)

    const mimeType = file.type === 'image/png' ? 'image/png' : 'image/jpeg'
    const imgData = canvas.toDataURL(mimeType, 0.9)
    const { x, y, renderWidth, renderHeight } = fitImageToPdfPage(sourceWidth, sourceHeight, pageWidth, pageHeight)
    pdf.addImage(imgData, mimeType === 'image/png' ? 'PNG' : 'JPEG', x, y, renderWidth, renderHeight)
    pdf.save(`${getBaseName(file.name)}.pdf`)
  }

  const convertPdfToPng = async (file: File) => {
    const pdfBytes = await file.arrayBuffer()
    const loadingTask = getDocument({ data: pdfBytes })
    const pdfDocument = await loadingTask.promise
    const page = await pdfDocument.getPage(1)
    const viewport = page.getViewport({ scale: 2 })

    const canvas = document.createElement('canvas')
    const context = canvas.getContext('2d')
    if (!context) throw new Error('Canvas rendering is not supported in this browser.')

    canvas.width = Math.ceil(viewport.width)
    canvas.height = Math.ceil(viewport.height)

    await page.render({ canvasContext: context, viewport }).promise

    const pngDataUrl = canvas.toDataURL('image/png')
    downloadDataUrl(pngDataUrl, `${getBaseName(file.name)}.png`)
    await pdfDocument.destroy()
  }

  const handleConvert = async () => {
    if (!selectedFile) {
      setError('Choose a file first.')
      return
    }

    setBusy(true)
    resetFeedback()

    try {
      if (conversionMode === 'pdf-to-png') {
        if (!isPdfFile) throw new Error('PDF to PNG requires a PDF file.')
        setStatus('Rendering PDF page to PNG...')
        await convertPdfToPng(selectedFile)
      } else {
        if (!isImageFile) throw new Error('Image conversions require a PNG or JPG file.')

        if (conversionMode === 'png-to-jpg') {
          setStatus('Converting image to JPG...')
          await convertImageToJpeg(selectedFile)
        } else if (conversionMode === 'jpg-to-png') {
          setStatus('Converting image to PNG...')
          await convertImageToPng(selectedFile)
        } else if (conversionMode === 'image-to-pdf') {
          setStatus('Building a PDF download...')
          await convertImageToPdf(selectedFile)
        }
      }

      setStatus('Download started in your browser.')
    } catch (conversionError) {
      setError(conversionError instanceof Error ? conversionError.message : 'The conversion failed.')
    } finally {
      setBusy(false)
    }
  }

  const handleDrop = (event: DragEvent<HTMLLabelElement>) => {
    event.preventDefault()
    setDragging(false)
    acceptFile(event.dataTransfer.files?.[0] || null)
  }

  return (
    <div className="space-y-5">
      <div className="space-y-2 rounded-2xl border border-[var(--border)] bg-[var(--panel-strong)] p-4 sm:p-5">
        <div className="text-xs uppercase tracking-[0.24em] text-[var(--muted)]">Conversion options</div>
        <h2 className="text-xl font-semibold text-[var(--text)]">Choose the action you want to run</h2>
        <p className="max-w-2xl text-sm leading-6 text-[var(--muted)]">
          Every option below runs entirely in the browser. Select one, drop the correct file type, and download the result instantly.
        </p>
      </div>

      <div className="space-y-3">
        <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
          {modeOptions.map(option => (
            <button
              key={option.value}
              type="button"
              onClick={() => setConversionMode(option.value)}
              className={`rounded-2xl border p-4 text-left transition ${conversionMode === option.value ? 'border-[var(--accent)] bg-[var(--accent-soft)]' : 'border-[var(--border)] bg-[var(--panel)]'} hover:-translate-y-0.5`}
            >
              <div className="flex items-center gap-2 text-sm font-semibold text-[var(--text)]">
                {option.value === 'png-to-jpg' || option.value === 'jpg-to-png' ? <ImageIcon className="h-4 w-4" /> : option.value === 'image-to-pdf' ? <FileText className="h-4 w-4" /> : <FileDown className="h-4 w-4" />}
                {option.label}
              </div>
              <div className="mt-2 text-xs leading-5 text-[var(--muted)]">{option.hint}</div>
            </button>
          ))}
        </div>

        <label
          onDragEnter={() => setDragging(true)}
          onDragOver={event => {
            event.preventDefault()
            setDragging(true)
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          className={`block cursor-pointer rounded-2xl border border-dashed p-5 transition ${dragging ? 'border-[var(--accent)] bg-[var(--accent-soft)]' : 'border-[var(--border)] bg-[var(--panel-strong)]'}`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept={`${IMAGE_ACCEPT},${PDF_ACCEPT}`}
            className="hidden"
            onChange={event => acceptFile(event.target.files?.[0] || null)}
          />
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-semibold text-[var(--text)]">
                <UploadCloud className="h-4 w-4" />
                Drop a PNG, JPG, or PDF file here
              </div>
              <p className="text-sm leading-6 text-[var(--muted)]">
                Conversions run entirely in your browser. No uploads, no server roundtrip.
              </p>
            </div>
            <button
              type="button"
              onClick={onBrowse}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--panel)] px-4 py-2.5 text-sm font-medium text-[var(--text)] transition hover:-translate-y-0.5"
            >
              <FileImage className="h-4 w-4" />
              Browse files
            </button>
          </div>
        </label>

        {selectedFile && (
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--panel-strong)] p-4 text-sm text-[var(--muted)]">
            <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
              <div className="font-medium text-[var(--text)]">{selectedFile.name}</div>
              <div>{selectedFile.type || 'Unknown type'} · {(selectedFile.size / 1024).toFixed(1)} KB</div>
            </div>
          </div>
        )}
      </div>

      <div className="grid gap-4 lg:grid-cols-[0.96fr_1.04fr]">
        <div className="space-y-4 rounded-2xl border border-[var(--border)] bg-[var(--panel-strong)] p-4 sm:p-5">
          <div>
            <div className="text-xs uppercase tracking-[0.22em] text-[var(--muted)]">Conversion mode</div>
            <div className="mt-2 text-sm text-[var(--muted)]">Active option: <span className="font-semibold text-[var(--text)]">{activeMode?.label}</span></div>
          </div>

          {conversionMode === 'image-to-pdf' && (
            <div className="space-y-3 rounded-xl border border-[var(--border)] bg-[var(--panel)] p-4">
              <div className="text-xs uppercase tracking-[0.22em] text-[var(--muted)]">PDF page size</div>
              <div className="grid gap-2 sm:grid-cols-3">
                <button type="button" onClick={() => setPdfPreset('A4-PORTRAIT')} className={`rounded-lg border px-3 py-2 text-sm ${pdfPreset === 'A4-PORTRAIT' ? 'border-[var(--accent)] bg-[var(--accent-soft)] text-[var(--text)]' : 'border-[var(--border)] text-[var(--text)]'}`}>A4 Portrait</button>
                <button type="button" onClick={() => setPdfPreset('A4-LANDSCAPE')} className={`rounded-lg border px-3 py-2 text-sm ${pdfPreset === 'A4-LANDSCAPE' ? 'border-[var(--accent)] bg-[var(--accent-soft)] text-[var(--text)]' : 'border-[var(--border)] text-[var(--text)]'}`}>A4 Landscape</button>
                <button type="button" onClick={() => setPdfPreset('CUSTOM')} className={`rounded-lg border px-3 py-2 text-sm ${pdfPreset === 'CUSTOM' ? 'border-[var(--accent)] bg-[var(--accent-soft)] text-[var(--text)]' : 'border-[var(--border)] text-[var(--text)]'}`}>Custom</button>
              </div>

              {pdfPreset === 'CUSTOM' && (
                <div className="grid gap-3 sm:grid-cols-2">
                  <label className="space-y-1 text-sm">
                    <span className="text-xs uppercase tracking-[0.18em] text-[var(--muted)]">Width (mm)</span>
                    <input value={customPageWidth} onChange={event => setCustomPageWidth(event.target.value)} inputMode="decimal" className="ui-input w-full px-3 py-2" />
                  </label>
                  <label className="space-y-1 text-sm">
                    <span className="text-xs uppercase tracking-[0.18em] text-[var(--muted)]">Height (mm)</span>
                    <input value={customPageHeight} onChange={event => setCustomPageHeight(event.target.value)} inputMode="decimal" className="ui-input w-full px-3 py-2" />
                  </label>
                </div>
              )}
            </div>
          )}

          {conversionMode === 'png-to-jpg' && (
            <label className="space-y-2 block rounded-xl border border-[var(--border)] bg-[var(--panel)] p-4 text-sm">
              <div className="flex items-center justify-between gap-3">
                <span className="text-xs uppercase tracking-[0.22em] text-[var(--muted)]">JPEG quality</span>
                <span className="font-medium text-[var(--text)]">{Math.round(Number(jpegQuality) * 100)}%</span>
              </div>
              <input
                type="range"
                min="0.5"
                max="1"
                step="0.05"
                value={jpegQuality}
                onChange={event => setJpegQuality(event.target.value)}
                className="w-full"
              />
            </label>
          )}

          <button
            type="button"
            onClick={handleConvert}
            disabled={busy || !selectedFile || !canUseMode}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--text)] px-4 py-3 text-sm font-semibold text-[var(--panel-strong)] transition disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Download className="h-4 w-4" />
            {busy ? 'Processing...' : 'Convert and download'}
          </button>

          {error && <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}
          {status && !error && <div className="rounded-xl border border-[var(--border)] bg-[var(--panel)] px-4 py-3 text-sm text-[var(--muted)]">{status}</div>}
        </div>

        <div className="rounded-2xl border border-[var(--border)] bg-[var(--panel-strong)] p-4 sm:p-5">
          <div className="text-xs uppercase tracking-[0.22em] text-[var(--muted)]">How it works</div>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <div className="rounded-xl border border-[var(--border)] bg-[var(--panel)] p-4">
              <div className="text-sm font-semibold text-[var(--text)]">PNG to JPG</div>
              <p className="mt-2 text-sm leading-6 text-[var(--muted)]">Loads the image into a canvas, fills transparency with white, and downloads a compressed JPG.</p>
            </div>
            <div className="rounded-xl border border-[var(--border)] bg-[var(--panel)] p-4">
              <div className="text-sm font-semibold text-[var(--text)]">JPG to PNG</div>
              <p className="mt-2 text-sm leading-6 text-[var(--muted)]">Re-renders the JPG onto canvas and exports a lossless PNG.</p>
            </div>
            <div className="rounded-xl border border-[var(--border)] bg-[var(--panel)] p-4">
              <div className="text-sm font-semibold text-[var(--text)]">Image to PDF</div>
              <p className="mt-2 text-sm leading-6 text-[var(--muted)]">Uses jsPDF, centers the image on the chosen page size, and saves a PDF.</p>
            </div>
            <div className="rounded-xl border border-[var(--border)] bg-[var(--panel)] p-4">
              <div className="text-sm font-semibold text-[var(--text)]">PDF to PNG</div>
              <p className="mt-2 text-sm leading-6 text-[var(--muted)]">Uses PDF.js to render the first page onto canvas and downloads a PNG export.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ImageToBase64