import React from 'react'
import { useParams, Link } from 'react-router-dom'
import tools from '../data/tools'

const CategoryPage: React.FC = ()=>{
  const { slug } = useParams()
  const root = tools.find(t=>t.slug===slug)
  if(!root) return <div>Category not found</div>
  const categoryName = root.title
  const items = tools.filter(t=> t.category === categoryName)
  const groups = categoryName === 'PDF Tools'
    ? [
        { title: 'Essentials', items: items.filter(item => ['Merge PDF', 'Split PDF', 'PDF Previewer'].includes(item.title)) },
        { title: 'Edit Pages', items: items.filter(item => ['Rotate PDF', 'Delete PDF Pages'].includes(item.title)) },
        { title: 'Convert', items: items.filter(item => ['JPG/PNG to PDF'].includes(item.title)) },
      ]
    : []

  return (
    <div className="space-y-8">
      <div>
        <div className="text-sm text-[var(--muted)]">Category</div>
        <h1 className="text-2xl font-bold text-[var(--text)]">{categoryName}</h1>
        <p className="text-[var(--muted)]">Tools in the {categoryName} collection.</p>
      </div>

      {groups.length > 0 ? groups.map(group => (
        <section key={group.title}>
          <h2 className="mb-3 text-lg font-semibold text-[var(--text)]">{group.title}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {group.items.map(it => (
              <Link
                to={`/tools/${it.slug}`}
                key={it.id}
                className="surface-card block rounded-2xl border border-[var(--border)] bg-[var(--panel-strong)] p-4 transition hover:-translate-y-0.5 hover:border-[color-mix(in_srgb,var(--accent)_30%,var(--border))]"
              >
                <div className="font-semibold text-[var(--text)]">{it.title}</div>
                <div className="mt-1 text-sm text-[var(--muted)]">{it.shortDescription}</div>
              </Link>
            ))}
          </div>
        </section>
      )) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {items.map(it=> (
            <Link
              to={`/tools/${it.slug}`}
              key={it.id}
              className="surface-card block rounded-2xl border border-[var(--border)] bg-[var(--panel-strong)] p-4 transition hover:-translate-y-0.5 hover:border-[color-mix(in_srgb,var(--accent)_30%,var(--border))]"
            >
              <div className="font-semibold text-[var(--text)]">{it.title}</div>
              <div className="mt-1 text-sm text-[var(--muted)]">{it.shortDescription}</div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

export default CategoryPage
