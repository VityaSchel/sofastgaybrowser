import cx from 'classnames'
import React from 'react'

export function IconButton({ children, className, ...props }: {
  className?: string
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={cx('hover:bg-neutral-200 hover:bg-opacity-50 rounded-full p-2 transition-all',
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
}