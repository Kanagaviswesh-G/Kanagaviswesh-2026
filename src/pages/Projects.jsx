import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence, useInView } from 'framer-motion'
import {
  FaGithub, FaExternalLinkAlt, FaCopy, FaCheck, FaChevronLeft, FaChevronRight,
  FaBrain, FaRobot, FaFilm, FaHeart, FaChartPie, FaChartLine, FaUsers,
  FaCalendarCheck, FaCloud, FaHotel, FaTrain, FaWalking, FaCode,
} from 'react-icons/fa'
import { projects, projectCategories } from '../data/projects'
import { profile } from '../data/profile'

const ICONS = {
  brain: FaBrain, robot: FaRobot, film: FaFilm, heart: FaHeart, chart: FaChartPie,
  trend: FaChartLine, users: FaUsers, calendar: FaCalendarCheck, cloud: FaCloud,
  hotel: FaHotel, train: FaTrain, walk: FaWalking,
}
const CYCLE_MS = 8000
const pad = (n) => String(n).padStart(2, '0')

function useTypewriter(text, speed = 22) {
  const [out, setOut] = useState('')
  useEffect(() => {
    setOut('')
    let i = 0
    const t = setInterval(() => {
      i += 1
      setOut(text.slice(0, i))
      if (i >= text.length) clearInterval(t)
    }, speed)
    return () => clearInterval(t)
  }, [text, speed])
  return out
}

function CloneLine({ url }) {
  const cmd = `git clone ${url}`
  const typed = useTypewriter(cmd)
  const [copied, setCopied] = useState(false)

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(cmd)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {
      /* ignore */
    }
  }

  return (
    <div
      className="flex items-center justify-between gap-3 rounded-lg border border-[var(--border)] px-4 py-3 font-mono text-xs"
      style={{ background: 'var(--bg-deep, #050810)' }}
    >
      <p className="truncate text-[var(--muted)]">
        <span style={{ color: 'var(--accent)' }}>$</span> {typed}
        <motion.span
          animate={{ opacity: [1, 0, 1] }}
          transition={{ duration: 1, repeat: Infinity }}
          className="ml-0.5 inline-block h-3.5 w-1.5 align-middle"
          style={{ background: 'var(--accent)' }}
        />
      </p>
      <button
        onClick={copy}
        aria-label="Copy clone command"
        className="shrink-0 text-[var(--muted)] hover:text-white transition"
      >
        {copied ? <FaCheck style={{ color: 'var(--accent)' }} /> : <FaCopy />}
      </button>
    </div>
  )
}

function Detail({ p, index, total, onPrev, onNext }) {
  const Icon = ICONS[p.icon] ?? FaCode

  return (
    <motion.div
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -40 }}
      transition={{ duration: 0.35 }}
      className="card overflow-hidden"
      style={{ '--accent': `hsl(${p.hue} 85% 62%)` }}
    >
      {/* window bar */}
      <div className="flex items-center justify-between border-b border-[var(--border)] px-4 py-2.5">
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-red-400/80" />
          <span className="h-2.5 w-2.5 rounded-full bg-yellow-400/80" />
          <span className="h-2.5 w-2.5 rounded-full bg-green-400/80" />
          <span className="ml-3 hidden sm:block font-mono text-xs text-[var(--muted)] truncate max-w-[260px]">
            ~/projects/{p.slug}
          </span>
        </div>
        <div className="flex items-center gap-2 text-xs text-[var(--muted)]">
          <button onClick={onPrev} aria-label="Previous" className="hover:text-white p-1"><FaChevronLeft /></button>
          <span className="font-mono">{pad(index + 1)}/{pad(total)}</span>
          <button onClick={onNext} aria-label="Next" className="hover:text-white p-1"><FaChevronRight /></button>
        </div>
      </div>

      {/* cover */}
      <div
        className="relative h-40 sm:h-48 overflow-hidden"
        style={{
          background:
            'linear-gradient(135deg, color-mix(in srgb, var(--accent) 38%, var(--bg-card)), var(--bg-card) 75%)',
        }}
      >
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage:
              'linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)',
            backgroundSize: '28px 28px',
          }}
        />
        <motion.div
          animate={{ scale: [1, 1.25, 1], opacity: [0.25, 0.45, 0.25] }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -right-10 -top-10 h-56 w-56 rounded-full blur-3xl"
          style={{ background: 'var(--accent)' }}
        />
        <motion.div
          animate={{ y: [0, -10, 0], rotate: [0, 5, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute left-6 top-1/2 -translate-y-1/2 grid h-20 w-20 place-items-center rounded-2xl border text-4xl"
          style={{
            color: 'var(--accent)',
            borderColor: 'var(--accent)',
            background: 'color-mix(in srgb, var(--accent) 14%, var(--bg-card))',
            boxShadow: '0 0 40px color-mix(in srgb, var(--accent) 35%, transparent)',
          }}
        >
          <Icon />
        </motion.div>
        <span
          className="absolute left-4 top-4 rounded-full border px-3 py-1 text-[11px] font-medium"
          style={{ borderColor: 'var(--accent)', color: 'var(--accent)' }}
        >
          {p.category}
        </span>
        <span className="absolute bottom-1 right-4 text-7xl sm:text-8xl font-extrabold opacity-10 select-none">
          {pad(index + 1)}
        </span>
      </div>

      {/* body */}
      <div className="p-5 sm:p-7">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h3 className="text-2xl font-extrabold">{p.title}</h3>
          {p.language && (
            <span className="flex items-center gap-2 text-xs text-[var(--muted)]">
              <span className="h-2.5 w-2.5 rounded-full" style={{ background: 'var(--accent)' }} />
              {p.language}
            </span>
          )}
        </div>
        <p className="mt-2 text-[var(--muted)] leading-relaxed">{p.description}</p>

        <ul className="mt-4 space-y-2">
          {p.highlights.map((h, i) => (
            <motion.li
              key={h}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15 + i * 0.1 }}
              className="flex gap-3 text-sm"
            >
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: 'var(--accent)' }} />
              <span>{h}</span>
            </motion.li>
          ))}
        </ul>

        <div className="mt-5 flex flex-wrap gap-2">
          {p.tags.map((t, i) => (
            <motion.span
              key={t}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 + i * 0.05 }}
              className="rounded-md border px-2.5 py-1 text-xs"
              style={{
                borderColor: 'color-mix(in srgb, var(--accent) 40%, var(--border))',
                background: 'color-mix(in srgb, var(--accent) 8%, transparent)',
              }}
            >
              {t}
            </motion.span>
          ))}
        </div>

        <div className="mt-6">
          <CloneLine url={p.github} />
        </div>

        <div className="mt-5 flex flex-wrap gap-3">
          <a
            href={p.github}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-semibold transition hover:-translate-y-0.5"
            style={{ background: 'var(--accent)', color: '#0b0b0f' }}
          >
            <FaGithub /> View Code
          </a>
          {p.demo && (
            <a
              href={p.demo}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-lg border px-5 py-2.5 text-sm font-semibold transition hover:-translate-y-0.5"
              style={{ borderColor: 'var(--accent)', color: 'var(--accent)' }}
            >
              Live Demo <FaExternalLinkAlt size={11} />
            </a>
          )}
        </div>
      </div>
    </motion.div>
  )
}

export default function Projects() {
  const [filter, setFilter] = useState('All')
  const [index, setIndex] = useState(0)
  const [hovered, setHovered] = useState(false)
  const ref = useRef(null)
  const inView = useInView(ref, { amount: 0.25 })

  const list = filter === 'All' ? projects : projects.filter((p) => p.category === filter)
  const safe = Math.min(index, list.length - 1)
  const current = list[safe]
  const paused = hovered || !inView || list.length < 2

  const go = (i) => setIndex((i + list.length) % list.length)
  const pick = (c) => {
    setFilter(c)
    setIndex(0)
  }
  const countOf = (c) => (c === 'All' ? projects.length : projects.filter((p) => p.category === c).length)

  useEffect(() => {
    if (paused) return
    const t = setTimeout(() => setIndex((i) => (i + 1) % list.length), CYCLE_MS)
    return () => clearTimeout(t)
  }, [index, paused, list.length, filter])

  return (
    <section ref={ref} className="relative mx-auto max-w-7xl px-5 py-16">
      <style>{`@keyframes pgrow{from{transform:scaleX(0)}to{transform:scaleX(1)}}`}</style>
      <div
        className="pointer-events-none absolute left-1/2 top-24 h-72 w-72 -translate-x-1/2 rounded-full blur-3xl opacity-20"
        style={{ background: 'var(--gradient)' }}
      />

      <div className="relative text-center max-w-2xl mx-auto">
        <p className="text-xs uppercase tracking-[0.25em] text-[var(--primary)]">Portfolio</p>
        <h2 className="mt-2 text-3xl md:text-4xl font-extrabold">
          Things I’ve <span className="gradient-text">Built</span>
        </h2>
        <p className="mt-3 text-[var(--muted)]">
          AI/ML, full stack and data projects, straight from my GitHub.
        </p>
      </div>

      {/* filter tabs */}
      <div className="relative mt-8 flex flex-wrap justify-center gap-2">
        {projectCategories.map((c) => (
          <button
            key={c}
            onClick={() => pick(c)}
            className="relative rounded-full border border-[var(--border)] px-4 py-2 text-sm font-medium"
          >
            {filter === c && (
              <motion.span
                layoutId="proj-pill"
                className="absolute inset-0 rounded-full"
                style={{ background: 'var(--gradient)' }}
                transition={{ type: 'spring', stiffness: 400, damping: 32 }}
              />
            )}
            <span
              className={`relative z-10 transition-colors ${
                filter === c ? 'text-[var(--on-primary,#fff)]' : 'text-[var(--muted)] hover:text-white'
              }`}
            >
              {c} <span className="opacity-70 text-xs">{countOf(c)}</span>
            </span>
          </button>
        ))}
      </div>

      {/* explorer */}
      <div
        className="relative mt-8 grid gap-5 lg:grid-cols-[300px_1fr]"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {/* list */}
        <div className="flex lg:flex-col gap-2 overflow-x-auto lg:overflow-x-visible lg:max-h-[620px] lg:overflow-y-auto pb-2 lg:pb-0 lg:pr-1">
          {list.map((p, i) => {
            const active = i === safe
            const accent = `hsl(${p.hue} 85% 62%)`
            return (
              <button
                key={p.id}
                onClick={() => go(i)}
                className="relative min-w-[210px] lg:min-w-0 text-left rounded-xl border border-[var(--border)] px-4 py-3 transition-colors hover:border-[var(--muted)]"
              >
                {active && (
                  <motion.span
                    layoutId="proj-active"
                    className="absolute inset-0 rounded-xl border"
                    style={{
                      borderColor: accent,
                      background: `color-mix(in srgb, ${accent} 10%, var(--bg-card))`,
                    }}
                    transition={{ type: 'spring', stiffness: 400, damping: 34 }}
                  />
                )}
                <div className="relative flex items-center gap-3">
                  <span
                    className="font-mono text-xs"
                    style={{ color: active ? accent : 'var(--muted)' }}
                  >
                    {pad(i + 1)}
                  </span>
                  <div className="min-w-0">
                    <p className={`truncate text-sm font-semibold ${active ? '' : 'text-[var(--muted)]'}`}>
                      {p.title}
                    </p>
                    <p className="text-[11px] text-[var(--muted)]">{p.category}</p>
                  </div>
                </div>
                {active && !paused && (
                  <span
                    key={`${p.id}-${paused}`}
                    className="absolute bottom-1 left-4 right-4 h-0.5 origin-left rounded"
                    style={{
                      background: accent,
                      animation: `pgrow ${CYCLE_MS}ms linear forwards`,
                    }}
                  />
                )}
              </button>
            )
          })}
        </div>

        {/* detail */}
        <AnimatePresence mode="wait">
          <Detail
            key={current.id}
            p={current}
            index={safe}
            total={list.length}
            onPrev={() => go(safe - 1)}
            onNext={() => go(safe + 1)}
          />
        </AnimatePresence>
      </div>

      <div className="relative mt-8 text-center">
        <a
          href={`${profile.github}?tab=repositories`}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 text-sm font-medium text-[var(--primary)] hover:text-white transition"
        >
          <FaGithub /> See all repositories on GitHub →
        </a>
      </div>
    </section>
  )
}