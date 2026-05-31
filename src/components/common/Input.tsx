import React from 'react'
import clsx from 'clsx'

const Input: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = ({ className, ...rest }) => {
  return (
    <input
      {...rest}
      className={clsx('ui-input w-full px-4 py-3 text-sm transition duration-200', className)}
    />
  )
}

export default Input
