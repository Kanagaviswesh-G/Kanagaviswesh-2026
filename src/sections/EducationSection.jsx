import { FaGraduationCap, FaTrophy, FaCertificate, FaFileAlt } from 'react-icons/fa'
import { education } from '../data/education'
import { certifications } from '../data/certifications'

export default function EducationSection() {
  return (
    <section className="mx-auto max-w-7xl px-5 py-12 grid gap-6 lg:grid-cols-2">
      {/* Education */}
      <div className="card p-6 md:p-8">
        <h2 className="flex items-center gap-3 text-xl font-bold mb-6">
          <FaGraduationCap className="text-[var(--primary)]" /> Education
        </h2>
        <ul className="relative space-y-6 border-l border-[var(--border)] ml-3">
          {education.map((e) => (
            <li key={e.id} className="pl-6 relative">
              <span
                className="absolute -left-[7px] top-1.5 h-3 w-3 rounded-full"
                style={{ background: 'var(--gradient)' }}
              />
              <div className="flex flex-wrap justify-between gap-x-4">
                <h3 className="font-semibold">{e.title}</h3>
                <span className="text-xs text-[var(--muted)]">{e.period}</span>
              </div>
              <p className="text-sm text-[var(--muted)]">{e.degree}</p>
              <p className="text-xs text-[var(--primary)] mt-1">{e.score}</p>
            </li>
          ))}
        </ul>
      </div>

      {/* Certifications */}
      <div className="card p-6 md:p-8">
        <h2 className="flex items-center gap-3 text-xl font-bold mb-6">
          <FaTrophy className="text-[var(--primary)]" /> Certifications &amp; Achievements
        </h2>
        <ul className="space-y-4">
          {certifications.map((c) => {
            const Icon = c.type === 'research' ? FaFileAlt : FaCertificate
            return (
              <li
                key={c.id}
                className="flex items-center gap-4 rounded-xl border border-[var(--border)] bg-[#0f0820] p-4"
              >
                <span className="h-11 w-11 shrink-0 grid place-items-center rounded-lg bg-[#1d1238] text-[var(--primary)]">
                  <Icon />
                </span>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold leading-tight">{c.title}</h3>
                  <p className="text-xs text-[var(--muted)] mt-0.5">{c.issuer}</p>
                  {c.description && (
                    <p className="text-xs text-[var(--muted)] mt-1">{c.description}</p>
                  )}
                </div>
                <a
                  href={c.link}
                  target="_blank"
                  rel="noreferrer"
                  className="shrink-0 rounded-lg border border-[var(--primary)] px-3 py-1.5 text-xs font-semibold text-[var(--primary)] hover:bg-[var(--primary)] hover:text-white transition"
                >
                  {c.cta}
                </a>
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}