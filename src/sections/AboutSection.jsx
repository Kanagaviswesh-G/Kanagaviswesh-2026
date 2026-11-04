import { useState } from 'react'
import { motion } from 'framer-motion'
import Button from '../components/common/Button'
import SectionHeading from '../components/common/SectionHeading'
import { profile } from '../data/profile'
import { education } from '../data/education'

export default function AboutSection() {
  const [imgError, setImgError] = useState(false)

  const facts = [
    { label: 'Degree', value: education[0].degree },
    { label: 'College', value: education[0].title },
    { label: 'Email', value: profile.email },
    { label: 'Phone', value: profile.phone },
  ]

  return (
    <section className="mx-auto max-w-7xl px-5 py-12">
      <SectionHeading title="About Me" subtitle="A little about who I am and what I build." />

      <div className="grid gap-10 lg:grid-cols-[320px_1fr] items-start">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative mx-auto w-full max-w-xs aspect-[4/5]"
        >
          <div
            className="absolute inset-4 rounded-3xl blur-2xl opacity-50"
            style={{ background: 'var(--gradient)' }}
          />
          {imgError ? (
            <div className="relative h-full w-full grid place-items-center card text-6xl font-extrabold gradient-text">
              {profile.initials}
            </div>
          ) : (
            <img
              src={profile.photo}
              alt={profile.name}
              onError={() => setImgError(true)}
              className="relative h-full w-full object-cover object-top rounded-3xl"
            />
          )}
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <h3 className="text-2xl font-bold">
            I’m <span className="gradient-text">{profile.name}</span>
          </h3>
          <p className="mt-1 text-[var(--muted)]">{profile.roles}</p>

          <div className="mt-5 space-y-4 text-[var(--muted)] leading-relaxed">
            {profile.about.map((para, i) => (
              <p key={i}>{para}</p>
            ))}
          </div>

          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            {facts.map((f) => (
              <div key={f.label} className="card p-4">
                <p className="text-xs text-[var(--muted)]">{f.label}</p>
                <p className="font-medium text-sm mt-0.5 break-words">{f.value}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-3">
            {profile.stats.map((s) => (
              <div key={s.label} className="card p-4 text-center">
                <p className="font-bold gradient-text">{s.value}</p>
                <p className="text-xs text-[var(--muted)] mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 flex flex-wrap gap-4">
            <Button href={profile.resume} download>Download Resume</Button>
            <Button to="/contact" variant="outline">Contact Me</Button>
          </div>
        </motion.div>
      </div>
    </section>
  )
}