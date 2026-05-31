import { Tool } from '../types'
import { v4 as uuidv4 } from 'uuid'

const tools: Tool[] = [
  // Categories
  { id: uuidv4(), slug: 'pdf-tools', title: 'PDF Tools', shortDescription: 'Browser-first PDF hub: merge, split, preview, rotate and optimize PDFs for download.', category: 'Categories', keywords: ['pdf','tools'], status: 'working', inputTypes: [], outputTypes: [], component: 'CategoryPage', featured: true, popular: true },
  { id: uuidv4(), slug: 'web-tools', title: 'Web Tools', shortDescription: 'Link and web utilities: QR codes, short links, and quick URL helpers.', category: 'Categories', keywords: ['web','tools'], status: 'working', inputTypes: [], outputTypes: [], component: 'CategoryPage' },
  { id: uuidv4(), slug: 'text-tools', title: 'Text Tools', shortDescription: 'Fast text utilities: counting, case conversion, trimming and normalization.', category: 'Categories', keywords: ['text','tools'], status: 'working', inputTypes: [], outputTypes: [], component: 'CategoryPage' },
  { id: uuidv4(), slug: 'developer-tools', title: 'Developer Tools', shortDescription: 'Small dev utilities: UUIDs, password generation, JSON formatting and token inspection.', category: 'Categories', keywords: ['dev','tools'], status: 'working', inputTypes: [], outputTypes: [], component: 'CategoryPage' },
  { id: uuidv4(), slug: 'image-tools', title: 'Image Tools', shortDescription: 'Client-side image and PDF conversions: PNG/JPG swaps, image-to-PDF, and PDF-to-PNG export.', category: 'Categories', keywords: ['image','tools'], status: 'working', inputTypes: [], outputTypes: [], component: 'CategoryPage' },

  // PDF Tools
  { id: uuidv4(), slug: 'merge-pdf', title: 'Merge PDF', shortDescription: 'Upload multiple PDFs, reorder pages, and combine into a single optimized PDF for download.', category: 'PDF Tools', keywords: ['pdf','merge','combine'], status: 'working', inputTypes: ['application/pdf'], outputTypes: ['application/pdf'], component: 'MergePdf' },
  { id: uuidv4(), slug: 'split-pdf', title: 'Split PDF', shortDescription: 'Split a PDF by page ranges or extract individual pages to separate PDFs or a ZIP.', category: 'PDF Tools', keywords: ['pdf','split','pages'], status: 'working', inputTypes: ['application/pdf'], outputTypes: ['application/pdf','application/zip'], component: 'SplitPdf' },
  { id: uuidv4(), slug: 'rotate-pdf', title: 'Rotate PDF', shortDescription: 'Rotate selected pages clockwise or counterclockwise and save the updated PDF.', category: 'PDF Tools', keywords: ['pdf','rotate','pages'], status: 'working', inputTypes: ['application/pdf'], outputTypes: ['application/pdf'], component: 'RotatePdf' },
  { id: uuidv4(), slug: 'delete-pdf-pages', title: 'Delete PDF Pages', shortDescription: 'Remove specific pages from a PDF and download the cleaned document.', category: 'PDF Tools', keywords: ['pdf','delete','pages'], status: 'working', inputTypes: ['application/pdf'], outputTypes: ['application/pdf'], component: 'DeletePdfPages' },
  { id: uuidv4(), slug: 'jpg-to-pdf', title: 'JPG/PNG to PDF', shortDescription: 'Convert JPG/PNG images into a single paginated PDF with sizing options.', category: 'PDF Tools', keywords: ['image','jpg','png','pdf'], status: 'working', inputTypes: ['image/jpeg','image/png'], outputTypes: ['application/pdf'], component: 'JpgToPdf' },
  { id: uuidv4(), slug: 'pdf-previewer', title: 'PDF Previewer', shortDescription: 'Preview pages, thumbnails and metadata; extract or download selected pages.', category: 'PDF Tools', keywords: ['preview','pdf','thumbnails'], status: 'working', inputTypes: ['application/pdf'], outputTypes: ['application/pdf'], component: 'PdfPreviewer' },

  // Web Tools
  { id: uuidv4(), slug: 'qr-generator', title: 'QR Code Generator', shortDescription: 'Create high-resolution QR codes from URLs or text and download as PNG or SVG.', category: 'Web Tools', keywords: ['qr','qrcode','barcode'], status: 'working', inputTypes: ['text/plain'], outputTypes: ['image/png','image/svg+xml'], component: 'QrGenerator' },
  { id: uuidv4(), slug: 'url-shortener', title: 'URL Shortener', shortDescription: 'Create short URLs with optional custom alias and basic click tracking; copy or open the short link.', category: 'Web Tools', keywords: ['url','shorten','alias','link'], status: 'working', inputTypes: ['text/plain'], outputTypes: ['text/plain'], component: 'UrlShortener', popular: true },

  // Text Tools
  { id: uuidv4(), slug: 'word-counter', title: 'Word Counter', shortDescription: 'Count words, characters and lines; includes reading-time estimate and duplicate word highlights.', category: 'Text Tools', keywords: ['word','count'], status: 'working', inputTypes: ['text/plain'], outputTypes: ['text/plain'], component: 'WordCounter' },
  { id: uuidv4(), slug: 'character-counter', title: 'Character Counter', shortDescription: 'Count characters (with options to include/exclude spaces) and show byte size.', category: 'Text Tools', keywords: ['character','count'], status: 'working', inputTypes: ['text/plain'], outputTypes: ['text/plain'], component: 'CharCounter' },
  { id: uuidv4(), slug: 'case-converter', title: 'Case Converter', shortDescription: 'Convert text to upper, lower, title or sentence case and normalize whitespace.', category: 'Text Tools', keywords: ['case','convert'], status: 'working', inputTypes: ['text/plain'], outputTypes: ['text/plain'], component: 'CaseConverter' },

  // Developer Tools
  { id: uuidv4(), slug: 'password-generator', title: 'Password Generator', shortDescription: 'Generate cryptographically-strong passwords with adjustable length and character sets; copy quickly.', category: 'Developer Tools', keywords: ['password','generator','security'], status: 'working', inputTypes: [], outputTypes: ['text/plain'], component: 'PasswordGenerator', popular: true },
  { id: uuidv4(), slug: 'json-formatter', title: 'JSON Formatter', shortDescription: 'Pretty-print, validate and minify JSON with error locations and copy/export options.', category: 'Developer Tools', keywords: ['json','format','validate'], status: 'working', inputTypes: ['application/json'], outputTypes: ['application/json'], component: 'JsonFormatter' },
  { id: uuidv4(), slug: 'uuid-generator', title: 'UUID Generator', shortDescription: 'Generate RFC-compliant UUIDs (v4) and copy them to clipboard.', category: 'Developer Tools', keywords: ['uuid','id'], status: 'working', inputTypes: [], outputTypes: ['text/plain'], component: 'UuidGenerator' },
  { id: uuidv4(), slug: 'jwt-decoder', title: 'JWT Decoder', shortDescription: 'Decode JWT header and payload for quick inspection (no signature verification).', category: 'Developer Tools', keywords: ['jwt','token'], status: 'working', inputTypes: ['text/plain'], outputTypes: ['application/json'], component: 'JwtDecoder' },

  // Image Tools
  { id: uuidv4(), slug: 'image-to-base64', title: 'Image Converter', shortDescription: 'PNG/JPG to JPG or PNG, image-to-PDF, and PDF-to-PNG conversions run fully in the browser.', category: 'Image Tools', keywords: ['image','base64','pdf','convert'], status: 'working', inputTypes: ['image/*','application/pdf'], outputTypes: ['image/png','image/jpeg','application/pdf'], component: 'ImageToBase64' },
  { id: uuidv4(), slug: 'png-to-jpg', title: 'PNG to JPG', shortDescription: 'Convert PNG images to JPG with client-side canvas rendering and automatic download.', category: 'Image Tools', keywords: ['png','jpg','convert','image'], status: 'working', inputTypes: ['image/png'], outputTypes: ['image/jpeg'], component: 'ImageToBase64' },
  { id: uuidv4(), slug: 'jpg-to-png', title: 'JPG to PNG', shortDescription: 'Convert JPG images to PNG with client-side canvas rendering and automatic download.', category: 'Image Tools', keywords: ['jpg','png','convert','image'], status: 'working', inputTypes: ['image/jpeg'], outputTypes: ['image/png'], component: 'ImageToBase64' },
  { id: uuidv4(), slug: 'image-to-pdf', title: 'Image to PDF', shortDescription: 'Convert PNG and JPG images to PDF pages with maintained aspect ratio.', category: 'Image Tools', keywords: ['image','pdf','convert'], status: 'working', inputTypes: ['image/png','image/jpeg'], outputTypes: ['application/pdf'], component: 'ImageToBase64' },
  { id: uuidv4(), slug: 'pdf-to-png', title: 'PDF to PNG', shortDescription: 'Render the first PDF page to PNG entirely in the browser using PDF.js.', category: 'Image Tools', keywords: ['pdf','png','convert'], status: 'working', inputTypes: ['application/pdf'], outputTypes: ['image/png'], component: 'ImageToBase64' },
]

export default tools
