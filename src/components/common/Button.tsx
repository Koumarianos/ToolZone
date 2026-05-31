import React from 'react'
import clsx from 'clsx'

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'ghost' }

const Button: React.FC<Props> = ({ variant = 'primary', className, children, ...rest }) => {
  return (
    <button
      {...rest}
      className={clsx(
        'inline-flex items-center justify-center gap-2 rounded-md px-6 py-3 text-sm font-semibold transition duration-200 transform-gpu focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60',
        variant === 'primary'
          ? 'brand-btn hover:-translate-y-1 focus:ring-[color:var(--accent)] shadow-sm hover:shadow-lg'
          : 'surface-card text-[var(--text)] hover:-translate-y-0.5 hover:shadow-lg focus:ring-[color:var(--accent-2)]',
        className
      )}
    >
      {children}
    </button>
  )
}

export default Button
