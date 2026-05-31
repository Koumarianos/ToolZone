import React from 'react'

const Badge: React.FC<{ children?: React.ReactNode; className?: string }> = ({ children, className }) => (
  <span className={`inline-flex items-center px-2 py-0.5 text-xs font-medium rounded ${className || 'bg-gray-100 text-gray-800'}`}>{children}</span>
)

export default Badge
