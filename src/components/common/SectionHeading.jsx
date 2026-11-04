import { Link } from 'react-router-dom'

export default function SectionHeading({ title, subtitle, actionLabel, actionTo }) {
  return (
    <div className="flex items-end justify-between gap-4 mb-8">
      <div>
        <h2 className="text-2xl md:text-3xl font-bold">{title}</h2>
        {subtitle && <p className="text-sm text-[var(--muted)] mt-1">{subtitle}</p>}
      </div>
      {actionLabel && actionTo && (
        <Link
          to={actionTo}
          className="text-sm font-medium text-[var(--primary)] hover:text-white transition whitespace-nowrap"
        >
          {actionLabel} →
        </Link>
      )}
    </div>
  )
}