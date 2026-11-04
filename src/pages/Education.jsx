import { useEffect, useRef, useState } from 'react'
import { motion, useScroll, useSpring, useInView, animate } from 'framer-motion'
import { FaGraduationCap, FaSchool, FaBookOpen } from 'react-icons/fa'
import { education } from '../data/education'

const years = (s = '') => (s.match(/\d{4}/g) || []).map(Number)

const parseScore = (s = '') => {
  const value = parseFloat((s.match(/[\d.]+(?=\s*\/)/) || [])[0])
  const max = parseFloat((s.match(/\/\s*([\d.]+)/) || [])[1]) || 10
  return { value: Number.isNaN(value) ? 0 : value, max }
}

const levelOf = (degree = '') => {
  if (/b\.?tech|bachelor/i.test(degree)) return { label: 'Undergraduate', Icon: FaGraduationCap }
  if (/higher secondary|hsc/i.test(degree)) return { label: 'Higher Secondary', Icon: FaBookOpen }
  return { label: 'Secondary', Icon: FaSchool }
}

/* ---------- count up ---------- */
function CountUp({ to, decimals = 0 }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true })
  const [v, setV] = useState(0)

  useEffect(() => {
    if (!inView) return
    const c = animate(0, to, { duration: 1.3, onUpdate: (x) => setV(x) })
    return () => c.stop()
  }, [inView, to])

  return <span ref={ref}>{v.toFixed(decimals)}</span>
}

/* ---------- GPA ring ---------- */
function Ring({ value, max }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, amount: 0.6 })
  const [n, setN] = useState(0)
  const R = 36
  const C = 2 * Math.PI * R

  useEffect(() => {
    if (!inView) return
    const c = animate(0, value, { duration: 1.4, ease: 'easeOut', onUpdate: (x) => setN(x) })
    return () => c.stop()
  }, [inView, value])

  return (
    <div ref={ref} className="relative h-24 w-24 shrink-0">
      <svg viewBox="0 0 88 88" className="h-full w-full -rotate-90">
        <defs>
          <linearGradient id="edGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" style={{ stopColor: 'var(--primary)' }} />
            <stop offset="100%" style={{ stopColor: 'var(--primary-2)' }} />
          </linearGradient>
        </defs>
        <circle cx="44" cy="44" r={R} fill="none" stroke="var(--border)" strokeWidth="7" />
        <motion.circle
          cx="44"
          cy="44"
          r={R}
          fill="none"
          stroke="url(#edGrad)"
          strokeWidth="7"
          strokeLinecap="round"
          strokeDasharray={C}
          initial={{ strokeDashoffset: C }}
          animate={inView ? { strokeDashoffset: C * (1 - value / max) } : {}}
          transition={{ duration: 1.4, ease: 'easeOut' }}
        />
      </svg>
      <div className="absolute inset-0 grid place-items-center text-center">
        <div>
          <p className="text-lg font-extrabold leading-none">{n.toFixed(2)}</p>
          <p className="text-[10px] text-[var(--muted)] mt-0.5">/ {max}</p>
        </div>
      </div>
    </div>
  )
}

/* ---------- timeline card ---------- */
function Milestone({ e, i, isLatest }) {
  const { label, Icon } = levelOf(e.degree)
  const { value, max } = parseScore(e.score)
  const left = i % 2 === 0

  return (
    <li className="relative pl-14 md:pl-0 md:grid md:grid-cols-2 md:gap-16 pb-12 last:pb-0">
      {/* node */}
      <motion.span
        initial={{ scale: 0 }}
        whileInView={{ scale: 1 }}
        viewport={{ once: true, amount: 0.8 }}
        transition={{ type: 'spring', stiffness: 260, damping: 18 }}
        className="absolute left-5 md:left-1/2 top-6 -translate-x-1/2 h-11 w-11 grid place-items-center rounded-full border-4 text-[var(--on-primary,#fff)]"
        style={{ background: 'var(--gradient)', borderColor: 'var(--bg)' }}
      >
        <Icon />
      </motion.span>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.6 }}
        whileHover={{ y: -4 }}
        className={`card relative p-5 md:p-6 hover:border-[var(--primary)] transition-colors ${
          left ? 'md:col-start-1' : 'md:col-start-2'
        }`}
      >
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full border border-[var(--border)] px-3 py-1 text-[11px] uppercase tracking-wider text-[var(--primary)]">
            {label}
          </span>
          <span className="rounded-full bg-[var(--bg-tint)] px-3 py-1 text-[11px] text-[var(--muted)]">
            {e.period}
          </span>
          {isLatest && (
            <span
              className="rounded-full px-3 py-1 text-[11px] font-semibold text-[var(--on-primary,#fff)]"
              style={{ background: 'var(--gradient)' }}
            >
              Latest
            </span>
          )}
        </div>

        <div className="mt-4 flex items-center gap-5">
          <div className="min-w-0 flex-1">
            <h3 className="text-lg font-bold leading-snug">{e.title}</h3>
            <p className="mt-1 text-sm text-[var(--muted)]">{e.degree}</p>
          </div>
          <Ring value={value} max={max} />
        </div>
      </motion.div>
    </li>
  )
}

/* ---------- section ---------- */
export default function Education() {
  const items = [...education].reverse() // oldest first = journey
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 75%', 'end 65%'] })
  const fill = useSpring(scrollYProgress, { stiffness: 90, damping: 28 })

  const all = items.flatMap((e) => years(e.period))
  const span = all.length ? Math.max(...all) - Math.min(...all) : 0
  const latest = items[items.length - 1]
  const latestGpa = parseScore(latest.score).value

  const stats = [
    { label: 'Qualifications', value: items.length, decimals: 0, suffix: '' },
    { label: 'Institutions', value: new Set(items.map((e) => e.title)).size, decimals: 0, suffix: '' },
    { label: 'Degree GPA', value: latestGpa, decimals: 2, suffix: '' },
  ]

  return (
    <section className="relative mx-auto max-w-5xl px-5 py-16">
      <div
        className="pointer-events-none absolute left-1/2 top-20 h-72 w-72 -translate-x-1/2 rounded-full blur-3xl opacity-20"
        style={{ background: 'var(--gradient)' }}
      />

      {/* heading */}
      <div className="relative text-center max-w-2xl mx-auto">
        <p className="text-xs uppercase tracking-[0.25em] text-[var(--primary)]">Education</p>
        <h2 className="mt-2 text-3xl md:text-4xl font-extrabold">
          Academic <span className="gradient-text">Journey</span>
        </h2>
        <p className="mt-3 text-[var(--muted)]">
          From school to a B.Tech in AI &amp; Data Science, one step at a time.
        </p>
      </div>

      {/* stats */}
      <div className="relative mt-8 flex flex-wrap justify-center gap-4">
        {stats.map((s) => (
          <div key={s.label} className="card px-6 py-3 text-center min-w-32">
            <p className="text-2xl font-extrabold gradient-text">
              <CountUp to={s.value} decimals={s.decimals} />
              {s.suffix}
            </p>
            <p className="text-xs text-[var(--muted)]">{s.label}</p>
          </div>
        ))}
      </div>

      {/* timeline */}
      <div ref={ref} className="relative mt-14">
        <div className="absolute left-5 md:left-1/2 top-0 bottom-0 w-0.5 -translate-x-1/2 bg-[var(--border)]" />
        <motion.div
          className="absolute left-5 md:left-1/2 top-0 bottom-0 w-0.5 -translate-x-1/2 origin-top"
          style={{ scaleY: fill, background: 'var(--gradient)' }}
        />

        <ul>
          {items.map((e, i) => (
            <Milestone key={e.id} e={e} i={i} isLatest={i === items.length - 1} />
          ))}
        </ul>

               {/* line end dot */}
        <div className="relative h-10">
          <span className="absolute left-5 md:left-1/2 bottom-0 -translate-x-1/2 translate-y-1/2 grid place-items-center">
            <motion.span
              animate={{ scale: [1, 2.4, 1], opacity: [0.5, 0, 0.5] }}
              transition={{ duration: 2.2, repeat: Infinity }}
              className="absolute h-4 w-4 rounded-full"
              style={{ background: 'var(--primary)' }}
            />
            <span className="relative h-4 w-4 rounded-full" style={{ background: 'var(--gradient)' }} />
          </span>
        </div>
      </div>

      {/* next chapter + roles (line ku velila) */}
      <div className="relative mt-8 pl-14 md:pl-0 md:text-center">
        <p className="text-sm text-[var(--muted)]">Next chapter:</p>

        <div className="mt-24">
          <p className="text-white font-semibold">Open to these roles</p>
          <div className="mt-4 flex flex-wrap md:justify-center gap-2">
            {['AI/ML Developer', 'Full Stack Developer', 'Data Engineer'].map((r) => (
              <span
                key={r}
                className="rounded-full border border-[var(--primary)] px-4 py-1.5 text-xs font-medium text-[var(--primary)]"
              >
                {r}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}