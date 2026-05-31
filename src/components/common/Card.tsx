import React from 'react'

const Card: React.FC<{ className?: string; children?: React.ReactNode }> = ({ className, children }) => {
  return (
    <div className={`surface-panel p-5 ${className || ''}`}>
      {children}
    </div>
  )
}

export default Card
