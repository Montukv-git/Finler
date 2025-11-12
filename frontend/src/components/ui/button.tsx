import React from 'react'
type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'outline' | 'solid' }
export const Button: React.FC<Props> = ({ className='', variant='solid', children, ...rest }) => {
  const base = 'px-4 py-2 rounded-lg transition';
  const theme = variant === 'outline' ? 'border border-white/20 text-white hover:bg-white/10' : 'bg-blue-600 text-white hover:bg-blue-700';
  return <button className={`${base} ${theme} ${className}`} {...rest}>{children}</button>
}
