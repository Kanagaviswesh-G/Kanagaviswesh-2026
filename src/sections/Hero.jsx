import { motion } from 'framer-motion'
import {
  FaLinkedinIn,
  FaGithub,
  FaEnvelope,
  FaFileAlt,
  FaLayerGroup,
  FaBrain,
  FaCode,
} from 'react-icons/fa'
import Button from '../components/common/Button'
import { profile } from '../data/profile'
import { scrollToId } from '../utils/scroll'
import useMediaQuery from '../hooks/useMediaQuery'

const socials = [
  { Icon: FaLinkedinIn, href: profile.linkedin, label: 'LinkedIn' },
  { Icon: FaGithub, href: profile.github, label: 'GitHub' },
  { Icon: FaEnvelope, href: `mailto:${profile.email}`, label: 'Email' },
  { Icon: FaFileAlt, href: profile.resume, label: 'Resume' },
]

const statIcons = [FaLayerGroup, FaBrain, FaCode, FaFileAlt]

const innerTags = ['Pandas', 'Docker', 'Django']

function Orbit({ items, size, duration, reverse = false, dashed = false }) {
  const dir = reverse ? -360 : 360
  return (
    <motion.div
      animate={{ rotate: dir }}
      transition={{ duration, repeat: Infinity, ease: 'linear' }}
      className={`absolute rounded-full border ${
        dashed ? 'border-dashed' : ''
      } border-[var(--border)]`}
      style={{
        width: `${size}%`,
        height: `${size}%`,
        top: `${(100 - size) / 2}%`,
        left: `${(100 - size) / 2}%`,
      }}
    >
      {items.map((item, i) => {
        const angle = (i * 360) / items.length
        const rad = (angle * Math.PI) / 180
        return (
          <span
            key={item}
            className="absolute"
            style={{
              left: `${50 + 50 * Math.cos(rad)}%`,
              top: `${50 + 50 * Math.sin(rad)}%`,
              transform: 'translate(-50%, -50%)',
            }}
          >
            <motion.span
              animate={{ rotate: -dir }}
              transition={{ duration, repeat: Infinity, ease: 'linear' }}
              className="block card px-2 py-1 text-[10px] sm:px-3 sm:py-1.5 sm:text-xs font-medium whitespace-nowrap shadow-lg shadow-black/40 backdrop-blur"
            >
              {item}
            </motion.span>
          </span>
        )
      })}
    </motion.div>
  )
}

function OrbitVisual() {
  const small = useMediaQuery('(max-width: 639px)')

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.7, delay: 0.1 }}
      className="relative mx-auto w-full max-w-[280px] sm:max-w-sm aspect-square"
    >
      {/* soft background glow */}
      <motion.div
        animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.55, 0.3] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute inset-10 rounded-full blur-3xl"
        style={{ background: 'var(--gradient)' }}
      />

      {/* ping rings */}
      {[0, 1.3].map((d) => (
        <motion.span
          key={d}
          initial={{ scale: 0.3, opacity: 0.6 }}
          animate={{ scale: 1, opacity: 0 }}
          transition={{ duration: 3.5, repeat: Infinity, delay: d, ease: 'easeOut' }}
          className="absolute inset-0 rounded-full border border-[var(--primary)]"
        />
      ))}

      {/* orbits */}
      <Orbit items={profile.floatingTags} size={small ? 78 : 96} duration={30} dashed />
      <Orbit items={innerTags} size={small ? 50 : 62} duration={20} reverse />

      {/* core */}
      <motion.div
        animate={{ scale: [1, 1.06, 1] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-1/2 left-1/2 h-20 w-20 sm:h-28 sm:w-28 -translate-x-1/2 -translate-y-1/2 rounded-full grid place-items-center border border-[var(--primary)] bg-[var(--bg-card)]"
        style={{ boxShadow: '0 0 40px var(--glow)' }}
      >
        <span className="gradient-text text-3xl sm:text-4xl font-extrabold">
          {profile.initials}
        </span>
      </motion.div>
    </motion.div>
  )
}

export default function Hero() {
  return (
    <section className="relative overflow-hidden min-h-[calc(100svh-5rem)] flex items-center">
      <div
        className="pointer-events-none absolute inset-0 opacity-60"
        style={{
          background: 'radial-gradient(60% 60% at 60% 40%, var(--glow), transparent 70%)',
        }}
      />

      <div className="relative w-full mx-auto max-w-7xl px-5 py-12 lg:py-16 grid gap-10 lg:grid-cols-[1.15fr_1fr_auto] items-center">
        {/* LEFT */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-block rounded-full border border-[var(--border)] bg-[var(--bg-card)] px-4 py-1.5 text-xs text-[var(--muted)]">
            🎓 {profile.badge}
          </span>

          <h1 className="mt-5 text-4xl md:text-5xl font-extrabold leading-tight">
            Hi, I’m <br />
            <span className="gradient-text">{profile.name}</span>
          </h1>

          <p className="mt-3 text-lg font-semibold">{profile.roles}</p>
          <p className="mt-4 max-w-xl text-[var(--muted)] leading-relaxed">
            <span className="text-white font-medium">{profile.tagline}</span>{' '}
            {profile.intro}
          </p>

          <div className="mt-7 flex flex-wrap gap-4">
            <Button
              href="#projects"
              onClick={(e) => {
                e.preventDefault()
                scrollToId('projects')
              }}
            >
              View My Work →
            </Button>
            <Button
              href="#contact"
              variant="outline"
              onClick={(e) => {
                e.preventDefault()
                scrollToId('contact')
              }}
            >
              Contact Me
            </Button>
          </div>

          <div className="mt-7 flex items-center gap-3">
            {socials.map(({ Icon, href, label }) => (
              <a
                key={label}
                href={href}
                target={href.startsWith('mailto:') ? undefined : '_blank'}
                rel="noreferrer"
                aria-label={label}
                className="h-10 w-10 grid place-items-center rounded-lg border border-[var(--border)] bg-[var(--bg-card)] text-[var(--muted)] hover:text-white hover:border-[var(--primary)] transition"
              >
                <Icon size={16} />
              </a>
            ))}
          </div>
        </motion.div>

        {/* CENTER: animated orbit */}
        <OrbitVisual />

        {/* RIGHT: stats */}
        <div className="grid grid-cols-2 lg:grid-cols-1 gap-4 lg:w-44">
          {profile.stats.map((s, i) => {
            const Icon = statIcons[i % statIcons.length]
            return (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + i * 0.1 }}
                className="card p-4 flex items-center gap-3"
              >
                <span className="h-10 w-10 grid place-items-center rounded-lg bg-[var(--bg-tint)] text-[var(--primary)]">
                  <Icon />
                </span>
                <div>
                  <p className="font-bold leading-tight">{s.value}</p>
                  <p className="text-xs text-[var(--muted)]">{s.label}</p>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}