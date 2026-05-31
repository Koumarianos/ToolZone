import React from 'react'

const ApiRemoved: React.FC<{ toolName?: string }> = ({ toolName }) => {
  return (
    <div className="p-6">
      <h3 className="text-lg font-semibold">{toolName || 'Unavailable Tool'}</h3>
      <p className="text-sm text-gray-600 mt-2">This tool was removed because it depends on a workflow outside the current product scope. ToolZone keeps the surface focused on reliable utilities with clear, shippable behavior.</p>
    </div>
  )
}

export default ApiRemoved
