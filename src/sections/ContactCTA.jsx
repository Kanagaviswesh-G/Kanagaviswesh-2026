import Button from '../components/common/Button'

export default function ContactCTA() {
  return (
    <section className="mx-auto max-w-7xl px-5 py-12">
      <div className="card p-8 md:p-12 text-center relative overflow-hidden">
        <div
          className="pointer-events-none absolute inset-0 opacity-40"
          style={{ background: 'radial-gradient(60% 80% at 50% 0%, var(--glow), transparent 70%)' }}
        />
        <div className="relative">
          <h2 className="text-2xl md:text-3xl font-bold">
            Let’s build something <span className="gradient-text">together</span>
          </h2>
          <p className="mt-3 text-[var(--muted)] max-w-xl mx-auto">
            Open to AI/ML, full stack and data roles. Drop a message and I will get back to you.
          </p>
          <div className="mt-6 flex justify-center">
            <Button to="/contact">Get In Touch</Button>
          </div>
        </div>
      </div>
    </section>
  )
}