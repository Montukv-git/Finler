import React from 'react'
export const Card: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className='', children, ...rest }) => (
  <div className={`rounded-xl bg-white/5 border border-white/10 ${className}`} {...rest}>{children}</div>
);
export const CardContent: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className='', children, ...rest }) => (
  <div className={`p-4 ${className}`} {...rest}>{children}</div>
);
