import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FaBriefcase, FaMapMarkerAlt } from 'react-icons/fa'
import { experience } from '../data/experience'
import { education } from '../data/education'

/* ---------- time diff (months, days, hours, min, sec) ---------- */
function diff(start, now) {
  let months =
    (now.getFullYear() - start.getFullYear()) * 12 + (now.getMonth() - start.getMonth())
  let anchor = new Date(start)
  anchor.setMonth(anchor.getMonth() + months)
  if (anchor > now) {
    months -= 1
    anchor = new Date(start)
    anchor.setMonth(anchor.getMonth() + months)
  }
  let ms = Math.max(now - anchor, 0)
  const days = Math.floor(ms / 86400000)
  ms -= days * 86400000
  const hours = Math.floor(ms / 3600000)
  ms -= hours * 3600000
  const minutes = Math.floor(ms / 60000)
  ms -= minutes * 60000
  const seconds = Math.floor(ms / 1000)
  return { months: Math.max(months, 0), days, hours, minutes, seconds }
}

function Unit({ value, label }) {
  return (
    <div className="card px-3 py-2 text-center min-w-[66px]">
      <div className="relative h-8 overflow-hidden">
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.span
            key={value}
            initial={{ y: '100%', opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: '-100%', opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 grid place-items-center text-xl font-extrabold gradient-text"
          >
            {String(value).padStart(2, '0')}
          </motion.span>
        </AnimatePresence>
      </div>
      <p className="text-[10px] uppercase tracking-wider text-[var(--muted)]">{label}</p>
    </div>
  )
}

function Uptime({ start, end }) {
  const [now, setNow] = useState(() => new Date())

  useEffect(() => {
    if (end) return
    const t = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(t)
  }, [end])

  const d = diff(new Date(start), end ? new Date(end) : now)

  return (
    <div>
      <p className="mb-3 text-[11px] uppercase tracking-[0.2em] text-[var(--muted)]">
        {end ? 'Time at company' : 'Time at company, live'}
      </p>
      <div className="flex flex-wrap gap-3">
        <Unit value={d.months} label="Months" />
        <Unit value={d.days} label="Days" />
        <Unit value={d.hours} label="Hours" />
        <Unit value={d.minutes} label="Min" />
        <Unit value={d.seconds} label="Sec" />
      </div>
    </div>
  )
}

/* ---------- terminal ---------- */
function Terminal({ e }) {
  const since = e.period.split('–')[0].trim()
  const active = !e.end
  const lines = [
    { t: '$ whoami', c: 'var(--accent-t)' },
    { t: 'kanagaviswesh-g', c: 'var(--text)' },
    { t: '$ status --current', c: 'var(--accent-t)' },
    { t: `role     : ${e.role}`, c: 'var(--text)' },
    { t: `company  : ${e.company}`, c: 'var(--text)' },
    { t: `since    : ${since}`, c: 'var(--text)' },
  ]

  return (
    <div
      className="card overflow-hidden font-mono text-xs"
      style={{ '--accent-t': 'var(--primary)' }}
    >
      <div className="flex items-center gap-2 border-b border-[var(--border)] px-4 py-2.5">
        <span className="h-2.5 w-2.5 rounded-full bg-red-400/80" />
        <span className="h-2.5 w-2.5 rounded-full bg-yellow-400/80" />
        <span className="h-2.5 w-2.5 rounded-full bg-green-400/80" />
        <span className="ml-3 text-[var(--muted)]">~/career/current</span>
      </div>

      <div
        className="space-y-1.5 p-5 leading-relaxed"
        style={{ background: 'var(--bg-deep, #050810)' }}
      >
        {lines.map((l, i) => (
          <motion.p
            key={l.t}
            initial={{ opacity: 0, x: -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.18 }}
            className="whitespace-pre-wrap break-words"
            style={{ color: l.c }}
          >
            {l.t}
          </motion.p>
        ))}

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: lines.length * 0.18 }}
          className="flex items-center gap-2"
        >
          <span style={{ color: 'var(--text)' }}>state    :</span>
          <span className="relative grid place-items-center">
            {active && (
              <motion.span
                animate={{ scale: [1, 2.4, 1], opacity: [0.6, 0, 0.6] }}
                transition={{ duration: 1.8, repeat: Infinity }}
                className="absolute h-2.5 w-2.5 rounded-full bg-emerald-400"
              />
            )}
            <span
              className={`relative h-2.5 w-2.5 rounded-full ${
                active ? 'bg-emerald-400' : 'bg-[var(--muted)]'
              }`}
            />
          </span>
          <span className={active ? 'text-emerald-400' : 'text-[var(--muted)]'}>
            {active ? 'active' : 'completed'}
          </span>
          <motion.span
            animate={{ opacity: [1, 0, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
            className="inline-block h-3.5 w-1.5"
            style={{ background: 'var(--primary)' }}
          />
        </motion.p>
      </div>
    </div>
  )
}

/* ---------- career path ---------- */
function CareerPath({ current }) {
  const bt = education.find((e) => /b\.?tech/i.test(e.degree)) || education[0]
  const [btStart, btEnd] = bt.period.split('–').map((s) => s.trim())

  const steps = [
    { when: btStart, title: 'Started B.Tech', sub: 'AI & Data Science' },
    { when: btEnd, title: 'Completed B.Tech', sub: bt.title },
    {
      when: current.period.split('–')[0].trim(),
      title: `Joined ${current.company.split(' ')[0]}`,
      sub: current.role,
      now: !current.end,
    },
  ]

  return (
    <div className="relative mt-14">
      <p className="mb-8 text-center text-[11px] uppercase tracking-[0.2em] text-[var(--muted)]">
        Career path
      </p>

      <div className="relative grid gap-8 sm:grid-cols-3">
        {/* connecting line (desktop) */}
        <div className="absolute left-[16.6%] right-[16.6%] top-5 hidden h-0.5 bg-[var(--border)] sm:block" />
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 1.4, ease: 'easeInOut' }}
          className="absolute left-[16.6%] right-[16.6%] top-5 hidden h-0.5 origin-left sm:block"
          style={{ background: 'var(--gradient)' }}
        />

        {steps.map((s, i) => (
          <motion.div
            key={s.title}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ delay: i * 0.25, duration: 0.5 }}
            className="relative flex flex-col items-center text-center"
          >
            <span className="relative grid place-items-center">
              {s.now && (
                <motion.span
                  animate={{ scale: [1, 2.2, 1], opacity: [0.5, 0, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute h-10 w-10 rounded-full"
                  style={{ background: 'var(--primary)' }}
                />
              )}
              <span
                className="relative h-10 w-10 rounded-full border-4 grid place-items-center text-[10px] font-bold text-[var(--on-primary,#fff)]"
                style={{ background: 'var(--gradient)', borderColor: 'var(--bg)' }}
              >
                {i + 1}
              </span>
            </span>
            <p className="mt-3 text-xs font-semibold text-[var(--primary)]">{s.when}</p>
            <p className="mt-1 font-bold">{s.title}</p>
            <p className="text-xs text-[var(--muted)]">{s.sub}</p>
            {s.now && (
              <span
                className="mt-2 rounded-full px-3 py-0.5 text-[10px] font-semibold text-[var(--on-primary,#fff)]"
                style={{ background: 'var(--gradient)' }}
              >
                NOW
              </span>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  )
}

/* ---------- section ---------- */
export default function ExperienceSection() {
  const list = [...experience].sort((a, b) => new Date(b.start) - new Date(a.start))
  const current = list[0]

  return (
    <section className="relative mx-auto max-w-6xl px-5 py-16">
      <div
        className="pointer-events-none absolute left-1/2 top-20 h-72 w-72 -translate-x-1/2 rounded-full blur-3xl opacity-20"
        style={{ background: 'var(--gradient)' }}
      />

      <div className="relative text-center max-w-2xl mx-auto">
        <p className="text-xs uppercase tracking-[0.25em] text-[var(--primary)]">Experience</p>
        <h2 className="mt-2 text-3xl md:text-4xl font-extrabold">
          Professional <span className="gradient-text">Experience</span>
        </h2>
        <p className="mt-3 text-[var(--muted)]">Where I am putting my skills to work.</p>
      </div>

      <div className="relative mt-10 space-y-8">
        {list.map((e, idx) => {
          const active = !e.end
          return (
            <div key={e.id} className="grid gap-6 lg:grid-cols-[1.25fr_1fr]">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.6 }}
                className="card relative overflow-hidden p-6 md:p-8"
              >
                <motion.span
                  initial={{ scaleY: 0 }}
                  whileInView={{ scaleY: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.9 }}
                  className="absolute left-0 top-0 h-full w-1 origin-top"
                  style={{ background: 'var(--gradient)' }}
                />

                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <span
                      className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl text-xl text-[var(--on-primary,#fff)]"
                      style={{ background: 'var(--gradient)' }}
                    >
                      <FaBriefcase />
                    </span>
                    <div>
                      <h3 className="text-xl font-extrabold leading-tight">{e.role}</h3>
                      <p className="text-[var(--primary)] font-medium">{e.company}</p>
                    </div>
                  </div>

                  {active && (
                    <span className="flex items-center gap-2 rounded-full border border-emerald-400/40 bg-emerald-400/10 px-3 py-1 text-xs font-medium text-emerald-400">
                      <span className="relative grid place-items-center">
                        <motion.span
                          animate={{ scale: [1, 2.4, 1], opacity: [0.6, 0, 0.6] }}
                          transition={{ duration: 1.8, repeat: Infinity }}
                          className="absolute h-2 w-2 rounded-full bg-emerald-400"
                        />
                        <span className="relative h-2 w-2 rounded-full bg-emerald-400" />
                      </span>
                      Currently working
                    </span>
                  )}
                </div>

                <div className="mt-4 flex flex-wrap gap-2 text-xs">
                  <span className="rounded-full bg-[var(--bg-tint)] px-3 py-1 text-[var(--muted)]">
                    {e.period}
                  </span>
                  {e.location && (
                    <span className="flex items-center gap-1.5 rounded-full bg-[var(--bg-tint)] px-3 py-1 text-[var(--muted)]">
                      <FaMapMarkerAlt className="text-[var(--primary)]" /> {e.location}
                    </span>
                  )}
                </div>

                <ul className="mt-5 space-y-2.5">
                  {e.points.map((p, i) => (
                    <motion.li
                      key={p}
                      initial={{ opacity: 0, x: -12 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.2 + i * 0.12 }}
                      className="flex gap-3 text-sm text-[var(--muted)]"
                    >
                      <span
                        className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full"
                        style={{ background: 'var(--primary)' }}
                      />
                      <span>{p}</span>
                    </motion.li>
                  ))}
                </ul>

                <div className="mt-7">
                  <Uptime start={e.start} end={e.end} />
                </div>
              </motion.div>

              {idx === 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.6, delay: 0.15 }}
                >
                  <Terminal e={e} />
                </motion.div>
              )}
            </div>
          )
        })}
      </div>

      <CareerPath current={current} />
    </section>
  )
}