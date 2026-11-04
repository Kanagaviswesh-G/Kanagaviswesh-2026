import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import {
  motion,
  AnimatePresence,
  useScroll,
  useVelocity,
  useSpring,
  useTransform,
  useReducedMotion,
} from 'framer-motion'
import { FaPlay, FaStop, FaTimes, FaVolumeUp, FaVolumeMute } from 'react-icons/fa'
import useActiveSection from '../../hooks/useActiveSection'
import { scrollToId } from '../../utils/scroll'
import { NAV_LINKS, SECTION_IDS } from '../../utils/constants'
import { profile } from '../../data/profile'
import { skills } from '../../data/skills'
import { projects } from '../../data/projects'
import { education } from '../../data/education'

const IMG = '/images/guide.png'
const FRAMES = [IMG, '/images/guide-mid.png', '/images/guide-open.png'] // closed, mid, open
const TOUR_PAUSE_MS = 2800
const SEND_BTN_ID = 'send-message-btn'

/* ---------- what he says in each section ---------- */
const first = profile.name.split(' ')[0]

const SCRIPTS = {
  home: () =>
    `Hi! I'm ${first}, an AI/ML and full stack developer. Welcome to my portfolio! Scroll down and I'll walk you through everything, or hit "Take the tour".`,
  about: () =>
    `I'm a B.Tech graduate in AI and Data Science who loves building AI-powered, full-stack and data-driven solutions. I've even presented a research paper at an IEEE conference.`,
  skills: () =>
    `Here's my toolkit: ${skills.length} technologies across Python, React, FastAPI, Django, TensorFlow and more. Use the tabs to filter by category.`,
  projects: () =>
    `I've built ${projects.length} projects, from an AutoML platform to a RAG knowledge assistant. Hover to pause the showcase, and copy any clone command!`,
  education: () =>
    `I earned my B.Tech in AI and Data Science from ${education[0].title}. The rings show my GPA at each stage of the journey.`,
  certifications: () =>
    `I'm a certified Qlik Sense Business Analyst, and I presented my IEEE research paper at NIT Puducherry.`,
  contact: () =>
    `Let's build something together! Fill in the form and hit Send Message, or reach me by email, LinkedIn or GitHub. I'd love to hear from you.`,
}

const EMOJI = {
  home: '👋',
  about: '🎓',
  skills: '⚡',
  projects: '🎉',
  education: '📚',
  certifications: '🏆',
  contact: '💌',
}

const labelOf = (id) => NAV_LINKS.find((l) => l.id === id)?.label ?? id

/* ---------- voice helpers (male voice only) ---------- */
const canSpeak = typeof window !== 'undefined' && 'speechSynthesis' in window

const MALE =
  /prabhat|ravi|hemant|david|mark|guy|ryan|george|james|richard|daniel|alex|fred|brian|eric|roger|davis|jason|christopher|steffan|male/i
const FEMALE =
  /heera|kalpana|neerja|zira|hazel|susan|aria|jenny|samantha|karen|moira|tessa|veena|fiona|sonia|libby|female/i

const pickVoice = () => {
  const en = window.speechSynthesis
    .getVoices()
    .filter((v) => v.lang?.toLowerCase().startsWith('en'))
  const male = en.filter((v) => MALE.test(v.name) && !FEMALE.test(v.name))
  return (
    male.find((v) => v.lang === 'en-IN') ||
    male.find((v) => /natural|online/i.test(v.name)) ||
    male[0] ||
    null
  )
}

/* pronunciation fixes (only used for the browser-voice fallback) */
const PRONOUNCE = [
  [/AI\/ML/g, 'A I M L'],
  [/Kanagaviswesh/g, 'Kanaga Viswesh'],
  [/\bAI\b/g, 'A I'],
  [/FastAPI/g, 'Fast A P I'],
  [/AutoML/g, 'Auto M L'],
  [/\bRAG\b/g, 'rag'],
  [/\bIEEE\b/g, 'I triple E'],
  [/\bNIT\b/g, 'N I T'],
  [/B\.Tech/g, 'B Tech'],
  [/\bGPA\b/g, 'G P A'],
  [/Django/g, 'Jango'],
  [/Qlik/g, 'Click'],
  [/GitHub/g, 'Git Hub'],
  [/LinkedIn/g, 'Linked In'],
  [/TensorFlow/g, 'Tensor Flow'],
]
const say = (s) => PRONOUNCE.reduce((a, [re, to]) => a.replace(re, to), s)

/* ---------- typewriter ---------- */
function useTyping(text, { animate, speed, start }) {
  const [typing, setTyping] = useState({ text, animate, start, n: 0 })

  if (
    typing.text !== text ||
    typing.animate !== animate ||
    typing.start !== start
  ) {
    setTyping({ text, animate, start, n: 0 })
  }

  useEffect(() => {
    if (!start || !animate) return

    let i = 0
    const t = setInterval(() => {
      i += 1
      setTyping((current) =>
        current.text === text &&
        current.animate === animate &&
        current.start === start
          ? { ...current, n: i }
          : current,
      )
      if (i >= text.length) clearInterval(t)
    }, speed)
    return () => clearInterval(t)
  }, [text, animate, speed, start])

  const n = !start ? 0 : !animate ? text.length : typing.n
  return { shown: text.slice(0, n), done: n >= text.length }
}

/* ---------- random mouth (0 closed, 1 mid, 2 open) ---------- */
function useMouth(active) {
  const [m, setM] = useState(0)

  useEffect(() => {
    if (!active) return
    const t = setInterval(() => {
      setM((prev) => {
        const r = Math.random()
        let n = r < 0.2 ? 0 : r < 0.6 ? 1 : 2
        if (n === prev) n = (n + 1) % 3
        return n
      })
    }, 120)
    return () => clearInterval(t)
  }, [active])

  return active ? m : 0
}

/* ---------- emoji burst above his head ---------- */
function Burst({ emoji }) {
  return (
    <div className="pointer-events-none absolute left-1/2 top-0 h-0 w-0">
      {[0, 1, 2, 3, 4].map((i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, y: 0, x: 0, scale: 0.4 }}
          animate={{
            opacity: [0, 1, 1, 0],
            y: -70 - i * 14,
            x: (i - 2) * 18,
            scale: [0.4, 1.25, 1],
            rotate: (i - 2) * 14,
          }}
          transition={{ duration: 1.6, delay: i * 0.08, ease: 'easeOut' }}
          className="absolute text-xl"
          style={{ marginLeft: -10 }}
        >
          {emoji}
        </motion.span>
      ))}
    </div>
  )
}

/* ---------- points at the real "Send Message" button ---------- */
function PointAtButton({ show }) {
  const [rect, setRect] = useState(null)

  useEffect(() => {
    if (!show) return
    const update = () => {
      const el = document.getElementById(SEND_BTN_ID)
      if (!el) return setRect(null)
      const r = el.getBoundingClientRect()
      const visible = r.bottom > 80 && r.top < window.innerHeight
      setRect(visible ? { top: r.top, left: r.left, width: r.width, height: r.height } : null)
    }
    update()
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    return () => {
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
  }, [show])

  if (!rect) return null
  const above = rect.left < 64

  return createPortal(
    <>
      <motion.span
        animate={{ scale: [1, 1.07, 1], opacity: [0.9, 0.35, 0.9] }}
        transition={{ duration: 1.4, repeat: Infinity }}
        className="pointer-events-none fixed z-[41] rounded-xl border-2"
        style={{
          top: rect.top - 4,
          left: rect.left - 4,
          width: rect.width + 8,
          height: rect.height + 8,
          borderColor: 'var(--primary)',
          boxShadow: '0 0 24px var(--glow)',
        }}
      />
      <motion.span
        animate={above ? { y: [0, 10, 0] } : { x: [0, 12, 0] }}
        transition={{ duration: 0.9, repeat: Infinity, ease: 'easeInOut' }}
        className="pointer-events-none fixed z-[41] text-3xl"
        style={
          above
            ? { top: rect.top - 46, left: rect.left + 18 }
            : { top: rect.top + rect.height / 2 - 18, left: rect.left - 52 }
        }
      >
        {above ? '👇' : '👉'}
      </motion.span>
    </>,
    document.body
  )
}

/* ---------- the character ---------- */
function Avatar({ speaking, mouth, pointing, hop, reduce, onClick }) {
  const { scrollY } = useScroll()
  const velocity = useVelocity(scrollY)
  const smooth = useSpring(velocity, { stiffness: 80, damping: 20 })
  const leanRaw = useTransform(smooth, [-2000, 0, 2000], [6, 0, -6])
  const lean = reduce ? 0 : leanRaw

  const headAnim = reduce
    ? {}
    : pointing
    ? { rotate: speaking ? [-6, -9, -5, -8, -6] : [-6, -7.5, -6] }
    : speaking
    ? { rotate: [0, -2.8, 1.6, -1.4, 2.4, 0] }
    : { rotate: [0, -1.2, 0, 1.2, 0] }

  return (
    <div
      className="relative w-[58px] sm:w-[84px] lg:w-[96px] cursor-pointer select-none"
      style={{ aspectRatio: '420 / 1314' }}
      onClick={onClick}
    >
      {/* ground shadow */}
      <motion.div
        animate={reduce ? {} : { scaleX: [1, 0.9, 1], opacity: [0.55, 0.4, 0.55] }}
        transition={{ duration: 4.2, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute -bottom-1 left-1/2 h-2.5 w-[130%] -translate-x-1/2 rounded-full bg-black/60 blur-md"
      />

      {/* hop on section change */}
      <motion.div
        className="absolute inset-0"
        animate={hop && !reduce ? { y: [0, -22, 0, -7, 0] } : { y: 0 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
      >
        {/* lean with scroll speed */}
        <motion.div
          className="absolute inset-0"
          style={{ rotate: lean, transformOrigin: '50% 100%' }}
          whileHover={reduce ? undefined : { scale: 1.05 }}
        >
          {/* breathing + gentle sway */}
          <motion.div
            className="absolute inset-0"
            style={{ transformOrigin: '50% 100%' }}
            animate={
              reduce
                ? {}
                : {
                    scaleY: [1, 1.012, 1],
                    rotate: pointing ? [-3.5, -2.5, -3.5] : [-0.5, 0.5, -0.5],
                  }
            }
            transition={{ duration: 4.2, repeat: Infinity, ease: 'easeInOut' }}
          >
            {/* body (neck down) */}
            <img
              src={IMG}
              alt=""
              draggable={false}
              className="pointer-events-none absolute inset-0 h-full w-full"
              style={{ clipPath: 'inset(27% 0 0 0)' }}
            />

            {/* head layer: nods while talking, mouth frames swap here */}
            <motion.div
              className="absolute inset-x-0 top-0"
              style={{
                height: '30%',
                overflow: 'hidden',
                transformOrigin: '48.2% 95.7%',
                WebkitMaskImage: 'linear-gradient(to bottom, #000 86%, transparent 100%)',
                maskImage: 'linear-gradient(to bottom, #000 86%, transparent 100%)',
              }}
              animate={headAnim}
              transition={{
                duration: speaking ? 1.1 : 6,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            >
              {FRAMES.map((src, i) => (
                <img
                  key={src}
                  src={src}
                  alt={i === 0 ? 'Kanagaviswesh' : ''}
                  draggable={false}
                  className="pointer-events-none absolute left-0 top-0 w-full max-w-none"
                  style={{
                    height: '333.333%',
                    opacity: mouth === i ? 1 : 0,
                  }}
                />
              ))}
            </motion.div>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  )
}

/* ---------- guide (character + speech bubble + tour + voice) ---------- */
export default function Guide() {
  const active = useActiveSection(SECTION_IDS)
  const reduce = useReducedMotion()

  const [ready, setReady] = useState(false)
  const [minimized, setMinimized] = useState(false)
  const [bubbleOpen, setBubbleOpen] = useState(true)
  const [tour, setTour] = useState(false)
  const [hop, setHop] = useState(false)
  const [burst, setBurst] = useState(null)
  const [voice, setVoice] = useState(false)
  const [voiceBusy, setVoiceBusy] = useState(false)
  const [voicesReady, setVoicesReady] = useState(false)
  const [typeMs, setTypeMs] = useState(null)
  const [audioPlaying, setAudioPlaying] = useState(false)
  const [audioMouth, setAudioMouth] = useState(0)
  const uttId = useRef(0)

  const text = (SCRIPTS[active] ?? SCRIPTS.home)()
  const { shown, done } = useTyping(text, {
    animate: !reduce,
    speed: voice ? typeMs ?? 68 : 18,
    start: ready,
  })
  const idx = SECTION_IDS.indexOf(active)
  const speaking = !minimized && ((!done && bubbleOpen) || voiceBusy)
  const pointing = active === 'contact' && !minimized

  const randomMouth = useMouth(speaking && !reduce && !audioPlaying)
  const mouth = audioPlaying ? audioMouth : randomMouth

  /* entrance delay */
  useEffect(() => {
    const t = setTimeout(() => setReady(true), 1200)
    return () => clearTimeout(t)
  }, [])

  /* voices load late in browsers, wait for them */
  useEffect(() => {
    if (!canSpeak) return
    const load = () => {
      if (window.speechSynthesis.getVoices().length) setVoicesReady(true)
    }
    load()
    window.speechSynthesis.addEventListener('voiceschanged', load)
    return () => window.speechSynthesis.removeEventListener('voiceschanged', load)
  }, [])

  /* hop + emoji + reopen bubble whenever the section changes */
  useEffect(() => {
    if (!ready) return
    const t0 = setTimeout(() => {
      setBubbleOpen(true)
      setHop(true)
      setBurst({ id: Date.now(), emoji: EMOJI[active] ?? '✨' })
    }, 0)
    const t1 = setTimeout(() => setHop(false), 750)
    const t2 = setTimeout(() => setBurst(null), 2000)
    return () => {
      clearTimeout(t0)
      clearTimeout(t1)
      clearTimeout(t2)
    }
  }, [active, ready])

  /* voice narration: mp3 (neural voice + real lip-sync), browser voice as fallback */
  useEffect(() => {
    window.speechSynthesis?.cancel()
    uttId.current += 1
    const id = uttId.current
    const shouldNarrate = voice && !minimized && ready
    const resetTimer = setTimeout(() => {
      setAudioPlaying(false)
      setAudioMouth(0)
      setTypeMs(null)
      setVoiceBusy(Boolean(shouldNarrate))
    }, 0)

    if (!shouldNarrate) {
      return () => clearTimeout(resetTimer)
    }

    let raf
    let ctx
    let killed = false
    const audio = new Audio(`/voice/${active}.mp3`)

    const finish = () => {
      if (killed || uttId.current !== id) return
      setVoiceBusy(false)
      setAudioPlaying(false)
      setAudioMouth(0)
    }

    const fallback = () => {
      if (killed) return
      setAudioPlaying(false)
      if (!canSpeak) return finish()
      const u = new SpeechSynthesisUtterance(say(text))
      const v = pickVoice()
      if (v) {
        u.voice = v
        u.lang = v.lang
        u.pitch = 0.95
      } else {
        u.lang = 'en-IN'
        u.pitch = 0.6
      }
      u.rate = 0.95
      u.onend = finish
      u.onerror = finish
      window.speechSynthesis.speak(u)
    }

    audio.onloadedmetadata = () => {
      if (isFinite(audio.duration) && audio.duration > 0) {
        setTypeMs(Math.max(12, (audio.duration * 1000 * 0.92) / text.length))
      }
    }
    audio.onended = finish
    audio.onerror = fallback

    // real lip-sync: audio volume -> mouth frame
    try {
      ctx = new (window.AudioContext || window.webkitAudioContext)()
      const src = ctx.createMediaElementSource(audio)
      const analyser = ctx.createAnalyser()
      analyser.fftSize = 512
      src.connect(analyser)
      analyser.connect(ctx.destination)
      const buf = new Uint8Array(analyser.fftSize)
      let last = 0

      const tick = (t) => {
        analyser.getByteTimeDomainData(buf)
        let sum = 0
        for (let i = 0; i < buf.length; i++) {
          const d = (buf[i] - 128) / 128
          sum += d * d
        }
        const rms = Math.sqrt(sum / buf.length)
        if (t - last > 70) {
          setAudioMouth(rms < 0.02 ? 0 : rms < 0.08 ? 1 : 2)
          last = t
        }
        raf = requestAnimationFrame(tick)
      }
      audio.onplay = () => {
        setAudioPlaying(true)
        raf = requestAnimationFrame(tick)
      }
      ctx.resume?.()
    } catch {
      /* analyser fail aana random mouth use aagum */
    }

    audio.play().catch(fallback)

    return () => {
      killed = true
      clearTimeout(resetTimer)
      cancelAnimationFrame(raf)
      audio.onended = audio.onerror = audio.onplay = audio.onloadedmetadata = null
      audio.pause()
      audio.src = ''
      if (ctx && ctx.state !== 'closed') ctx.close()
      window.speechSynthesis?.cancel()
    }
  }, [text, active, voice, minimized, ready, voicesReady])

  /* tour: after he finishes (typing and voice), scroll to the next section */
  useEffect(() => {
    if (!tour || !done || voiceBusy || minimized) return
    const t = setTimeout(() => {
      if (idx >= SECTION_IDS.length - 1) setTour(false)
      else scrollToId(SECTION_IDS[idx + 1])
    }, TOUR_PAUSE_MS)
    return () => clearTimeout(t)
  }, [tour, done, voiceBusy, idx, minimized])

  /* any manual scroll/keypress cancels the tour */
  useEffect(() => {
    if (!tour) return
    const stop = () => setTour(false)
    window.addEventListener('wheel', stop, { passive: true })
    window.addEventListener('touchmove', stop, { passive: true })
    window.addEventListener('keydown', stop)
    return () => {
      window.removeEventListener('wheel', stop)
      window.removeEventListener('touchmove', stop)
      window.removeEventListener('keydown', stop)
    }
  }, [tour])

  const toggleTour = () => {
    if (tour) {
      setTour(false)
      return
    }
    setTour(true)
    if (active !== SECTION_IDS[0]) scrollToId(SECTION_IDS[0])
  }

  if (!ready) return null

  /* minimized: KV button */
  if (minimized) {
    return (
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setMinimized(false)}
        aria-label="Open portfolio guide"
        className="fixed bottom-4 right-4 z-40 h-16 w-16"
      >
        {/* pulse ring */}
        {!reduce && (
          <motion.span
            animate={{ scale: [1, 1.35], opacity: [0.6, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeOut' }}
            className="absolute inset-0 rounded-full"
            style={{ border: '2px solid var(--primary)' }}
          />
        )}

        {/* KV badge */}
        <span
          className="absolute inset-0 grid place-items-center rounded-full border-2"
          style={{
            borderColor: 'var(--primary)',
            background: 'var(--bg-card)',
            boxShadow: '0 0 24px var(--glow)',
          }}
        >
          <span className="gradient-text text-xl font-extrabold tracking-tight">KV</span>
        </span>

        {/* bot badge */}
        <motion.span
          animate={reduce ? {} : { rotate: [0, 18, -8, 18, 0] }}
          transition={{ duration: 1.6, repeat: Infinity, repeatDelay: 2 }}
          className="absolute -right-1 -top-1 grid h-6 w-6 place-items-center rounded-full border border-[var(--border)] text-xs"
          style={{ background: 'var(--bg-card)' }}
        >
          🤖
        </motion.span>
      </motion.button>
    )
  }

  return (
    <>
      <PointAtButton show={pointing} />

      <motion.div
        initial={{ y: 120, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 120, damping: 16 }}
        className="pointer-events-none fixed bottom-0 right-3 z-40 sm:right-5"
      >
        <div className="relative">
          {burst && <Burst key={burst.id} emoji={burst.emoji} />}

          {/* speech bubble */}
          <AnimatePresence>
            {bubbleOpen && (
              <motion.div
                key="bubble"
                initial={{ opacity: 0, scale: 0.85, x: 12 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.85, x: 12 }}
                style={{ transformOrigin: '100% 20%' }}
                className="pointer-events-auto card absolute right-full top-2 mr-3 w-[min(270px,calc(100vw-110px))] sm:w-[300px] p-4 shadow-2xl"
              >
                <span
                  className="absolute -right-1.5 top-12 h-3 w-3 rotate-45 border-r border-t border-[var(--border)]"
                  style={{ background: 'var(--bg-card)' }}
                />

                <div className="flex items-center justify-between gap-2">
                  <AnimatePresence mode="wait">
                    <motion.span
                      key={active}
                      initial={{ opacity: 0, y: -6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="rounded-full border border-[var(--border)] px-2.5 py-0.5 text-[10px] uppercase tracking-wider text-[var(--primary)]"
                    >
                      {labelOf(active)}
                    </motion.span>
                  </AnimatePresence>

                  <div className="flex items-center gap-2.5">
                    {canSpeak && (
                      <button
                        onClick={() => setVoice((v) => !v)}
                        aria-label={voice ? 'Turn voice off' : 'Turn voice on'}
                        title={voice ? 'Voice on (click to mute)' : 'Voice off (click to listen)'}
                        className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[10px] transition ${
                          voice
                            ? 'border-[var(--primary)] text-[var(--primary)]'
                            : 'border-[var(--border)] text-[var(--muted)] hover:text-white'
                        }`}
                      >
                        {voice ? <FaVolumeUp size={10} /> : <FaVolumeMute size={10} />}
                        {voice ? 'Voice on' : 'Voice off'}
                      </button>
                    )}
                    <button
                      onClick={() => setMinimized(true)}
                      aria-label="Minimize guide"
                      className="text-[var(--muted)] hover:text-white transition"
                    >
                      <FaTimes size={12} />
                    </button>
                  </div>
                </div>

                <p className="mt-2.5 min-h-[72px] text-[13px] leading-relaxed">
                  {shown}
                  {!done && (
                    <motion.span
                      animate={{ opacity: [1, 0, 1] }}
                      transition={{ duration: 0.8, repeat: Infinity }}
                      className="ml-0.5 inline-block h-3.5 w-1 align-middle"
                      style={{ background: 'var(--primary)' }}
                    />
                  )}
                </p>

                <div className="mt-3 flex items-center justify-between gap-2">
                  <button
                    onClick={toggleTour}
                    className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] font-semibold transition hover:opacity-90"
                    style={{ background: 'var(--gradient)', color: 'var(--on-primary,#fff)' }}
                  >
                    {tour ? <FaStop size={9} /> : <FaPlay size={9} />}
                    {tour ? 'Stop tour' : 'Take the tour'}
                  </button>

                  <div className="flex items-center gap-1">
                    {SECTION_IDS.map((id, i) => (
                      <button
                        key={id}
                        onClick={() => scrollToId(id)}
                        aria-label={labelOf(id)}
                        title={labelOf(id)}
                        className="h-1.5 rounded-full transition-all"
                        style={{
                          width: i === idx ? 16 : 6,
                          background: i === idx ? 'var(--primary)' : 'var(--border)',
                        }}
                      />
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* character */}
          <div className="pointer-events-auto">
            <Avatar
              speaking={speaking}
              mouth={mouth}
              pointing={pointing}
              hop={hop}
              reduce={reduce}
              onClick={() => setBubbleOpen((o) => !o)}
            />
          </div>
        </div>
      </motion.div>
    </>
  )
}