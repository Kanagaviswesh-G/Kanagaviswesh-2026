import { motion } from 'framer-motion'
import { FaBriefcase } from 'react-icons/fa'
import SectionHeading from '../components/common/SectionHeading'
import { experience } from '../data/experience'

export default function ExperienceSection() {
  return (
    <section className="mx-auto max-w-4xl px-5 py-12">
      <SectionHeading title="Experience" subtitle="Where I have applied my skills." />

      <ul className="relative space-y-8 border-l border-[var(--border)] ml-4">
        {experience.map((e, i) => (
          <motion.li
            key={e.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            className="relative pl-8"
          >
            <span
              className="absolute -left-4 top-1 h-8 w-8 grid place-items-center rounded-full text-[var(--on-primary)] text-xs"
              style={{ background: 'var(--gradient)' }}
            >
              <FaBriefcase />
            </span>
            <div className="card p-5">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h3 className="font-bold text-lg">{e.role}</h3>
                <span className="text-xs text-[var(--muted)]">{e.period}</span>
              </div>
              <p className="text-sm text-[var(--primary)] mt-0.5">{e.company}</p>
              <ul className="mt-3 space-y-2 text-sm text-[var(--muted)] list-disc pl-5">
                {e.points.map((p, idx) => (
                  <li key={idx}>{p}</li>
                ))}
              </ul>
            </div>
          </motion.li>
        ))}
      </ul>
    </section>
  )
}