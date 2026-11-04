export default function Loader({ label = 'Loading...' }) {
  return (
    <div className="grid place-items-center py-16 gap-3">
      <div
        className="h-10 w-10 rounded-full border-4 border-[var(--border)] border-t-[var(--primary)] animate-spin"
        role="status"
      />
      <p className="text-sm text-[var(--muted)]">{label}</p>
    </div>
  )
}