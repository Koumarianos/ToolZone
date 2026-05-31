export type ToolStatus = 'working'|'beta'

export type Tool = {
  id: string
  slug: string
  title: string
  shortDescription: string
  longDescription?: string
  category: string
  subcategory?: string
  icon?: string
  keywords: string[]
  status: ToolStatus
  inputTypes: string[]
  outputTypes: string[]
  featured?: boolean
  popular?: boolean
  component?: string
  seo?: { title?: string; description?: string }
}
