import { useState } from 'react'
import axios from 'axios'
import { FaEnvelope, FaPhoneAlt, FaLinkedinIn, FaGithub } from 'react-icons/fa'
import SectionHeading from '../components/common/SectionHeading'
import Button from '../components/common/Button'
import { profile } from '../data/profile'

const inputCls =
  'w-full rounded-lg border border-[var(--border)] bg-[var(--bg-soft)] px-4 py-3 text-sm outline-none focus:border-[var(--primary)] transition'

const EMPTY = { name: '', email: '', message: '', website: '' }

export default function Contact() {
  const [form, setForm] = useState(EMPTY)
  const [status, setStatus] = useState('idle') // idle | sending | success | error
  const [errorMsg, setErrorMsg] = useState('')

  const contacts = [
    { Icon: FaEnvelope, label: 'Email', value: profile.email, href: `mailto:${profile.email}` },
    { Icon: FaPhoneAlt, label: 'Phone', value: profile.phone, href: `tel:${profile.phone.replace(/\s/g, '')}` },
    { Icon: FaLinkedinIn, label: 'LinkedIn', value: 'Kanagaviswesh G', href: profile.linkedin },
    { Icon: FaGithub, label: 'GitHub', value: 'Kanagaviswesh-G', href: profile.github },
  ]

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const onSubmit = async (e) => {
    e.preventDefault()
    if (status === 'sending') return
    setStatus('sending')
    setErrorMsg('')

    try {
      await axios.post('/.netlify/functions/send-email', form)
      setStatus('success')
      setForm(EMPTY)
      setTimeout(() => setStatus('idle'), 6000)
    } catch (err) {
      setErrorMsg(err.response?.data?.error || '')
      setStatus('error')
    }
  }

  return (
    <section className="mx-auto max-w-6xl px-5 py-12">
      <SectionHeading title="Get In Touch" subtitle="Have a role or project in mind? Send me a message." />

      <div className="grid gap-8 lg:grid-cols-[1fr_1.2fr]">
        <div className="space-y-4">
          {contacts.map(({ Icon, label, value, href }) => (
            <a
              key={label}
              href={href}
              target={href.startsWith('http') ? '_blank' : undefined}
              rel="noreferrer"
              className="card p-4 flex items-center gap-4 hover:border-[var(--primary)] transition-colors"
            >
              <span className="h-11 w-11 grid place-items-center rounded-lg bg-[var(--bg-tint)] text-[var(--primary)]">
                <Icon />
              </span>
              <div className="min-w-0">
                <p className="text-xs text-[var(--muted)]">{label}</p>
                <p className="font-medium text-sm truncate">{value}</p>
              </div>
            </a>
          ))}
        </div>

        <form onSubmit={onSubmit} className="card relative p-6 md:p-8 space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <input
              className={inputCls}
              name="name"
              value={form.name}
              onChange={onChange}
              placeholder="Your name"
              maxLength={100}
              required
            />
            <input
              className={inputCls}
              type="email"
              name="email"
              value={form.email}
              onChange={onChange}
              placeholder="Your email"
              required
            />
          </div>

          <textarea
            className={`${inputCls} min-h-36 resize-y`}
            name="message"
            value={form.message}
            onChange={onChange}
            placeholder="Your message"
            maxLength={3000}
            required
          />

          {/* honeypot: bots fill this, humans never see it */}
          <input
            name="website"
            value={form.website}
            onChange={onChange}
            tabIndex={-1}
            autoComplete="off"
            aria-hidden="true"
            className="absolute -left-[9999px] h-0 w-0 opacity-0"
          />

          <Button id="send-message-btn" type="submit" disabled={status === 'sending'}>
            {status === 'sending' ? 'Sending...' : 'Send Message'}
          </Button>

          {status === 'success' && (
            <p className="text-sm text-emerald-400">Message sent! I will get back to you soon.</p>
          )}
          {status === 'error' && (
            <p className="text-sm text-red-400">
              {errorMsg || 'Could not send right now.'} You can also email me directly at {profile.email}.
            </p>
          )}
        </form>
      </div>
    </section>
  )
}