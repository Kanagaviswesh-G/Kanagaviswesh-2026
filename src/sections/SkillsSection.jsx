import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence, animate, useInView } from 'framer-motion'
import * as Si from 'react-icons/si'
import { FaDatabase, FaChartBar, FaChartLine, FaRobot, FaCode } from 'react-icons/fa'
import { skills, skillCategories } from '../data/skills'
import { projects } from '../data/projects'

const META = {
  Python: { Icon: Si.SiPython, color: '#4B8BBE' },
  SQL: { Icon: FaDatabase, color: '#38bdf8' },
  'React.js': { Icon: Si.SiReact, color: '#61DAFB' },
  HTML: { Icon: Si.SiHtml5, color: '#E34F26' },
  CSS: { Icon: Si.SiCss3, color: '#2D8CE8' },
  FastAPI: { Icon: Si.SiFastapi, color: '#05B8A0' },
  Django: { Icon: Si.SiDjango, color: '#44B78B' },
  MySQL: { Icon: Si.SiMysql, color: '#5B9BD5' },
  'Scikit-learn': { Icon: Si.SiScikitlearn, color: '#F7931E' },
  XGBoost: { Icon: Si.SiXgboost ?? FaChartLine, color: '#2F9BE9' },
  TensorFlow: { Icon: Si.SiTensorflow, color: '#FF6F00' },
  Keras: { Icon: Si.SiKeras ?? FaRobot, color: '#D00000' },
  PyTorch: { Icon: Si.SiPytorch ?? FaRobot, color: '#EE4C2C' },
  Pandas: { Icon: Si.SiPandas, color: '#a78bfa' },
  NumPy: { Icon: Si.SiNumpy, color: '#4DABCF' },
  Matplotlib: { Icon: FaChartBar, color: '#3b9ac4' },
  Seaborn: { Icon: FaChartLine, color: '#5fb0b7' },
  Git: { Icon: Si.SiGit, color: '#F05032' },
  GitHub: { Icon: Si.SiGithub, color: '#e4e4e7' },
  Docker: { Icon: Si.SiDocker, color: '#2496ED' },
}

const getMeta = (name) => {
  const m = META[name]
  return { Icon: m?.Icon ?? FaCode, color: m?.color ?? '#a1a1aa' }
}

/* ---------- count up ---------- */
function CountUp({ to }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true })
  const [v, setV] = useState(0)

  useEffect(() => {
    if (!inView) return
    const c = animate(0, to, { duration: 1.2, onUpdate: (x) => setV(Math.round(x)) })
    return () => c.stop()
  }, [inView, to])

  return <span ref={ref}>{v}</span>
}

/* ---------- marquee ---------- */
function Chip({ skill }) {
  const { Icon, color } = getMeta(skill.name)
  return (
    <div className="mr-4 flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--bg-card)] px-4 py-2 text-sm whitespace-nowrap">
      <Icon style={{ color }} />
      <span className="text-[var(--muted)]">{skill.name}</span>
    </div>
  )
}

function Marquee({ items, reverse = false, duration = 45 }) {
  const loop = [...items, ...items]
  const mask = 'linear-gradient(90deg, transparent, #000 12%, #000 88%, transparent)'
  return (
    <div className="overflow-hidden" style={{ maskImage: mask, WebkitMaskImage: mask }}>
      <motion.div
        className="flex w-max py-1.5"
        animate={{ x: reverse ? ['-50%', '0%'] : ['0%', '-50%'] }}
        transition={{ duration, repeat: Infinity, ease: 'linear' }}
      >
        {loop.map((s, i) => (
          <Chip key={`${s.name}-${i}`} skill={s} />
        ))}
      </motion.div>
    </div>
  )
}

/* ---------- skill card ---------- */
function SkillCard({ skill, index }) {
  const { Icon, color } = getMeta(skill.name)

  const onMove = (e) => {
    const r = e.currentTarget.getBoundingClientRect()
    e.currentTarget.style.setProperty('--mx', `${e.clientX - r.left}px`)
    e.currentTarget.style.setProperty('--my', `${e.clientY - r.top}px`)
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 24, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.4, delay: Math.min(index * 0.03, 0.4) }}
      whileHover={{ y: -6 }}
      onMouseMove={onMove}
      style={{ '--c': color, '--mx': '50%', '--my': '50%' }}
      className="card group relative overflow-hidden p-5 hover:border-[var(--c)] transition-colors"
    >
      {/* spotlight */}
      <div
        className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          background:
            'radial-gradient(180px circle at var(--mx) var(--my), color-mix(in srgb, var(--c) 28%, transparent), transparent 70%)',
        }}
      />

      <div className="relative flex flex-col items-center text-center">
        <motion.div
          whileHover={{ rotate: [0, -10, 10, -6, 0], scale: 1.12 }}
          transition={{ duration: 0.5 }}
          className="h-14 w-14 grid place-items-center rounded-2xl text-3xl"
          style={{
            color,
            background: 'color-mix(in srgb, var(--c) 14%, transparent)',
          }}
        >
          <Icon />
        </motion.div>

        <h3 className="mt-3 font-semibold">{skill.name}</h3>
        <p className="text-[11px] uppercase tracking-wider text-[var(--muted)] mt-0.5">
          {skill.category}
        </p>
      </div>
    </motion.div>
  )
}

/* ---------- section ---------- */
export default function SkillsSection() {
  const [active, setActive] = useState('All')
  const list = active === 'All' ? skills : skills.filter((s) => s.category === active)
  const countOf = (c) => (c === 'All' ? skills.length : skills.filter((s) => s.category === c).length)

  const half = Math.ceil(skills.length / 2)
  const rowA = skills.slice(0, half)
  const rowB = skills.slice(half)

  const stats = [
    { label: 'Technologies', value: skills.length },
    { label: 'Categories', value: skillCategories.length - 1 },
    { label: 'Projects Built', value: projects.length },
  ]

  return (
    <section className="relative mx-auto max-w-7xl px-5 py-16">
      <div
        className="pointer-events-none absolute left-1/2 top-24 h-72 w-72 -translate-x-1/2 rounded-full blur-3xl opacity-20"
        style={{ background: 'var(--gradient)' }}
      />

      {/* heading */}
      <div className="relative text-center max-w-2xl mx-auto">
        <p className="text-xs uppercase tracking-[0.25em] text-[var(--primary)]">Tech Stack</p>
        <h2 className="mt-2 text-3xl md:text-4xl font-extrabold">
          Skills &amp; <span className="gradient-text">Technologies</span>
        </h2>
        <p className="mt-3 text-[var(--muted)]">
          Tools I use to turn data into models, and models into real products.
        </p>
      </div>

      {/* stats */}
      <div className="relative mt-8 flex flex-wrap justify-center gap-4">
        {stats.map((s) => (
          <div key={s.label} className="card px-6 py-3 text-center min-w-32">
            <p className="text-2xl font-extrabold gradient-text">
              <CountUp to={s.value} />+
            </p>
            <p className="text-xs text-[var(--muted)]">{s.label}</p>
          </div>
        ))}
      </div>

      {/* marquee */}
      <div className="relative mt-10 space-y-2">
        <Marquee items={rowA} duration={45} />
        <Marquee items={rowB} reverse duration={55} />
      </div>

      {/* tabs */}
      <div className="relative mt-10 flex flex-wrap justify-center gap-2">
        {skillCategories.map((c) => (
          <button
            key={c}
            onClick={() => setActive(c)}
            className="relative rounded-full border border-[var(--border)] px-4 py-2 text-sm font-medium"
          >
            {active === c && (
              <motion.span
                layoutId="skill-pill"
                className="absolute inset-0 rounded-full"
                style={{ background: 'var(--gradient)' }}
                transition={{ type: 'spring', stiffness: 400, damping: 32 }}
              />
            )}
            <span
              className={`relative z-10 transition-colors ${
                active === c ? 'text-[var(--on-primary,#fff)]' : 'text-[var(--muted)] hover:text-white'
              }`}
            >
              {c} <span className="opacity-70 text-xs">{countOf(c)}</span>
            </span>
          </button>
        ))}
      </div>

      {/* grid */}
      <motion.div
        layout
        className="relative mt-8 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4"
      >
        <AnimatePresence mode="popLayout">
          {list.map((s, i) => (
            <SkillCard key={s.name} skill={s} index={i} />
          ))}
        </AnimatePresence>
      </motion.div>
    </section>
  )
}