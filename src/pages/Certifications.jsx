import { motion } from 'framer-motion'
import { FaCertificate } from 'react-icons/fa'
import SectionHeading from '../components/common/SectionHeading'
import ResearchSection from '../sections/ResearchSection'
import { certifications } from '../data/certifications'

export default function Certifications() {
  const certs = certifications.filter((c) => c.type === 'certificate')

  return (
    <>
      <section className="mx-auto max-w-7xl px-5 py-12">
        <SectionHeading title="Certifications" subtitle="Credentials I have earned." />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {certs.map((c, i) => (
            <motion.div
              key={c.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -4 }}
              className="card p-6 hover:border-[var(--primary)] transition-colors"
            >
              <span className="h-12 w-12 grid place-items-center rounded-xl bg-[var(--bg-tint)] text-[var(--primary)] text-xl">
                <FaCertificate />
              </span>
              <h3 className="mt-4 font-bold text-lg leading-snug">{c.title}</h3>
              <p className="text-sm text-[var(--muted)] mt-1">{c.issuer}</p>
              <a
                href={c.link}
                target="_blank"
                rel="noreferrer"
                className="inline-block mt-5 rounded-lg border border-[var(--primary)] px-4 py-2 text-sm font-semibold text-[var(--primary)] hover:bg-[var(--primary)] hover:text-[var(--on-primary)] transition"
              >
                {c.cta}
              </a>
            </motion.div>
          ))}
        </div>
      </section>

      <ResearchSection />
    </>
  )
}