import React from 'react'
import { Toaster } from 'sonner'

const AppProviders: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <>
      {children}
      <Toaster position="bottom-right" />
    </>
  )
}

export default AppProviders
