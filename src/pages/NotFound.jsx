import Button from '../components/common/Button'

export default function NotFound() {
  return (
    <section className="mx-auto max-w-xl px-5 py-24 text-center">
      <p className="gradient-text text-7xl font-extrabold">404</p>
      <h1 className="mt-4 text-2xl font-bold">Page not found</h1>
      <p className="mt-2 text-[var(--muted)]">The page you are looking for does not exist.</p>
      <div className="mt-8 flex justify-center">
        <Button to="/">Back to Home</Button>
      </div>
    </section>
  )
}