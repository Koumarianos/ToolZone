import React from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, ShieldCheck, Sparkles } from 'lucide-react'
import tools from '../data/tools'
import MergePdf from '../tools/pdf/MergePdf'
import SplitPdf from '../tools/pdf/SplitPdf'
import RotatePdf from '../tools/pdf/RotatePdf'
import DeletePdfPages from '../tools/pdf/DeletePdfPages'
import JpgToPdf from '../tools/pdf/JpgToPdf'
import QrGenerator from '../tools/web/QrGenerator'
import PasswordGenerator from '../tools/dev/PasswordGenerator'
import UrlShortener from '../tools/web/UrlShortener'
import JsonFormatter from '../tools/text/JsonFormatter'
import UuidGenerator from '../tools/dev/UuidGenerator'
import WordCounter from '../tools/text/WordCounter'
import CharCounter from '../tools/text/CharCounter'
import CaseConverter from '../tools/text/CaseConverter'
import ApiRemoved from '../tools/ApiRemoved'
import CategoryPage from '../tools/CategoryPage'
import PdfPreviewer from '../tools/pdf/PdfPreviewer'
import JwtDecoder from '../tools/dev/JwtDecoder'
import ImageToBase64 from '../tools/image/ImageToBase64'

const imageModeBySlug: Record<string, 'png-to-jpg' | 'jpg-to-png' | 'image-to-pdf' | 'pdf-to-png'> = {
  'image-to-base64': 'png-to-jpg',
  'png-to-jpg': 'png-to-jpg',
  'jpg-to-png': 'jpg-to-png',
  'image-to-pdf': 'image-to-pdf',
  'pdf-to-png': 'pdf-to-png',
}

const componentMap: Record<string, React.ComponentType<any>> = {
  MergePdf,
  SplitPdf,
  RotatePdf,
  DeletePdfPages,
  JpgToPdf,
  QrGenerator,
  PasswordGenerator
  ,UrlShortener
  ,JsonFormatter
  ,UuidGenerator
  ,WordCounter
  ,CharCounter
  ,CaseConverter
  ,ApiRemoved
  ,CategoryPage
  ,PdfPreviewer
  ,JwtDecoder
  ,ImageToBase64
}

const ToolPage: React.FC = () => {
  const { slug } = useParams()
  const tool = tools.find(t=>t.slug===slug)
  if(!tool) return <div>Tool not found</div>
  const Component = componentMap[tool.component || ''] || (()=> <div>Tool UI not implemented yet</div>)
  const componentProps = tool.component === 'ImageToBase64' ? { initialMode: imageModeBySlug[tool.slug] || 'png-to-jpg' } : {}

  const friendlyType = (type: string) => {
    if (!type) return ''
    if (type.includes('pdf')) return 'PDF files'
    if (type.startsWith('image')) return 'images (PNG/JPG/SVG)'
    if (type === 'text/plain') return 'plain text'
    if (type === 'application/json') return 'JSON'
    return type
  }

  const buildOverview = (t: any) => {
    if (t.longDescription) return t.longDescription
    const parts: string[] = []
    if (t.shortDescription) parts.push(t.shortDescription.replace(/\.$/, '') + '.')

    if (t.inputTypes && t.inputTypes.length > 0) {
      const inputs = t.inputTypes.map(friendlyType).join(', ')
      parts.push(`Accepts ${inputs}. Provide input via upload or paste depending on the type.`)
    } else {
      // tools that generate values
      parts.push('No file input required — this tool generates or transforms text/values in-browser.')
    }

    if (t.outputTypes && t.outputTypes.length > 0) {
      const outputs = t.outputTypes.map(friendlyType).join(', ')
      parts.push(`Produces ${outputs}. You can download or copy the result.`)
    }

    parts.push('Quick start: open the tool, provide the input, then use the action button to generate and download or copy the result.')
    return parts.join(' ')
  }

  const overviewText = buildOverview(tool)

  return (
    <div className="space-y-6 lg:space-y-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-4">
          <Link to="/" className="surface-card inline-flex h-11 w-11 shrink-0 items-center justify-center text-[var(--text)] transition hover:-translate-x-0.5">
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div className="space-y-2">
            <div className="mono text-xs uppercase tracking-[0.26em] text-[var(--muted)]">{tool.category}</div>
            <h1 className="display mt-1 text-3xl font-bold text-[var(--text)] sm:text-4xl">{tool.title}</h1>
            <p className="max-w-2xl text-sm leading-6 text-[var(--muted)] sm:text-base">{tool.shortDescription}</p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="ui-badge">
            <ShieldCheck className="h-3.5 w-3.5" />
            Browser-safe
          </div>
          <div className="ui-badge">
            <Sparkles className="h-3.5 w-3.5" />
            Ready to download
          </div>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[0.88fr_1.12fr] lg:gap-6">
        <div className="surface-panel p-5 sm:p-6">
          <div className="text-sm uppercase tracking-[0.22em] text-[var(--muted)]">Tool overview</div>
          <p className="mt-4 max-w-prose text-sm leading-7 text-[var(--muted)]">{overviewText}</p>

          <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="surface-card p-4">
              <div className="text-[11px] uppercase tracking-[0.18em] text-[var(--muted)]">Input</div>
              <div className="mt-1 text-sm font-semibold text-[var(--text)]">{tool.inputTypes.join(', ')}</div>
            </div>
            <div className="surface-card p-4">
              <div className="text-[11px] uppercase tracking-[0.18em] text-[var(--muted)]">Output</div>
              <div className="mt-1 text-sm font-semibold text-[var(--text)]">{tool.outputTypes.join(', ')}</div>
            </div>
          </div>
        </div>

        <div className="surface-strong p-3 sm:p-4 lg:p-6">
          <Component {...componentProps} />
        </div>
      </div>
    </div>
  )
}

export default ToolPage
