import { Link } from 'react-router-dom'

const base =
  'inline-flex items-center justify-center gap-2 rounded-lg px-6 py-3 text-sm font-semibold transition hover:opacity-90 hover:-translate-y-0.5'

const variants = {
  primary: 'text-white shadow-lg shadow-purple-900/40',
  outline: 'text-white border border-[var(--border)] bg-[var(--bg-card)] hover:border-[var(--primary)]',
}

export default function Button({
  children,
  to,
  href,
  variant = 'primary',
  className = '',
  ...rest
}) {
  const cls = `${base} ${variants[variant]} ${className}`
  const style = variant === 'primary' ? { background: 'var(--gradient)' } : undefined

  if (to) return <Link to={to} className={cls} style={style} {...rest}>{children}</Link>
  if (href)
    return (
      <a href={href} className={cls} style={style} {...rest}>
        {children}
      </a>
    )
  return <button className={cls} style={style} {...rest}>{children}</button>
}