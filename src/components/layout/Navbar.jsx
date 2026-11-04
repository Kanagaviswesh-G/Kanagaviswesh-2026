import { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { HiMenuAlt3, HiX } from 'react-icons/hi'
import { NAV_LINKS, SECTION_IDS, SOCIALS } from '../../utils/constants'
import { scrollToId } from '../../utils/scroll'
import useActiveSection from '../../hooks/useActiveSection'
import useScrollProgress from '../../hooks/useScrollProgress'

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const active = useActiveSection(SECTION_IDS, pathname)
  const progress = useScrollProgress()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10)
    onScroll()
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const go = (id) => (e) => {
    e.preventDefault()
    setOpen(false)
    if (pathname === '/') scrollToId(id)
    else navigate('/', { state: { scrollTo: id } })
  }

  const linkCls = (id) =>
    `text-sm font-medium transition-colors ${
      active === id && pathname === '/' ? 'text-white' : 'text-[var(--muted)] hover:text-white'
    }`

  const resumeStyle = { background: 'var(--gradient)', color: 'var(--on-primary, #fff)' }

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 h-20 flex items-center transition-all ${
        scrolled
          ? 'bg-[color-mix(in_srgb,var(--bg)_85%,transparent)] backdrop-blur-md border-b border-[var(--border)]'
          : 'bg-transparent'
      }`}
    >
      <nav className="mx-auto w-full max-w-7xl px-5 flex items-center justify-between">
        <a href="/#home" onClick={go('home')} className="flex items-center gap-3">
          <span className="gradient-text text-2xl font-extrabold tracking-tight">KG</span>
          <span className="h-6 w-px bg-[var(--border)]" />
          <span className="font-semibold">Kanagaviswesh G</span>
        </a>

        <ul className="hidden lg:flex items-center gap-7">
          {NAV_LINKS.map((l) => (
            <li key={l.id}>
              <a href={`/#${l.id}`} onClick={go(l.id)} className={linkCls(l.id)}>
                <span className="relative pb-1">
                  {l.label}
                  {active === l.id && pathname === '/' && (
                    <motion.span
                      layoutId="nav-underline"
                      className="absolute left-0 -bottom-0.5 h-0.5 w-full rounded"
                      style={{ background: 'var(--gradient)' }}
                    />
                  )}
                </span>
              </a>
            </li>
          ))}
        </ul>

        <a
          href={SOCIALS.resume}
          download
          className="hidden lg:inline-block rounded-lg px-5 py-2.5 text-sm font-semibold hover:opacity-90 transition"
          style={resumeStyle}
        >
          Download Resume
        </a>

        <button
          className="lg:hidden text-2xl"
          onClick={() => setOpen((o) => !o)}
          aria-label="Toggle menu"
        >
          {open ? <HiX /> : <HiMenuAlt3 />}
        </button>
      </nav>

      {/* scroll progress bar */}
      <div
        className="absolute bottom-0 left-0 h-0.5 w-full origin-left"
        style={{ background: 'var(--gradient)', transform: `scaleX(${progress})` }}
      />

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="lg:hidden absolute top-20 inset-x-0 bg-[color-mix(in_srgb,var(--bg)_95%,transparent)] backdrop-blur-md border-b border-[var(--border)] px-5 py-5"
          >
            <ul className="flex flex-col gap-4">
              {NAV_LINKS.map((l) => (
                <li key={l.id}>
                  <a href={`/#${l.id}`} onClick={go(l.id)} className={linkCls(l.id)}>
                    {l.label}
                  </a>
                </li>
              ))}
              <li>
                <a
                  href={SOCIALS.resume}
                  download
                  className="inline-block rounded-lg px-5 py-2.5 text-sm font-semibold"
                  style={resumeStyle}
                >
                  Download Resume
                </a>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}