export default function ProjectFilter({ categories, active, onChange }) {
  return (
    <div className="flex flex-wrap gap-2 mb-8">
      {categories.map((c) => (
        <button
          key={c}
          onClick={() => onChange(c)}
          className={`rounded-lg px-4 py-1.5 text-xs font-medium border transition ${
            active === c
              ? 'text-[var(--on-primary)] border-transparent'
              : 'text-[var(--muted)] border-[var(--border)] hover:text-white'
          }`}
          style={active === c ? { background: 'var(--gradient)' } : undefined}
        >
          {c}
        </button>
      ))}
    </div>
  )
}