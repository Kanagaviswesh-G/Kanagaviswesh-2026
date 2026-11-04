import { FaLinkedinIn, FaGithub, FaEnvelope, FaFileAlt } from 'react-icons/fa'
import { SOCIALS } from '../../utils/constants'
import { profile } from '../../data/profile'

const icons = [
  {
    Icon: FaLinkedinIn,
    href: SOCIALS.linkedin,
    label: 'LinkedIn',
    bg: '#0A66C2',
    fg: '#ffffff',
    glow: '#0A66C2',
  },
  {
    Icon: FaGithub,
    href: SOCIALS.github,
    label: 'GitHub',
    bg: '#24292f',
    fg: '#ffffff',
    glow: '#e4e4e7',
  },
  {
    Icon: FaEnvelope,
    href: SOCIALS.email,
    label: 'Email',
    bg: 'linear-gradient(135deg, #EA4335, #c5221f)',
    fg: '#ffffff',
    glow: '#EA4335',
  },
  {
    Icon: FaFileAlt,
    href: SOCIALS.resume,
    label: 'Resume',
    bg: 'linear-gradient(135deg, #F5D000, #D4A800)',
    fg: '#111111',
    glow: '#F5B700',
  },
]

export default function Footer() {
  return (
    <footer className="border-t border-[var(--border)] bg-[#07040f]">
      <div className="mx-auto max-w-7xl px-5 py-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <span className="gradient-text text-2xl font-extrabold">KG</span>
          <span className="h-6 w-px bg-[var(--border)]" />
          <div>
            <p className="font-semibold leading-tight">{profile.name}</p>
            <p className="text-xs text-[var(--muted)]">{profile.footerTagline}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {icons.map(({ Icon, href, label, bg, fg, glow }) => (
            <a
              key={label}
              href={href}
              target={href.startsWith('mailto:') ? undefined : '_blank'}
              rel="noreferrer"
              aria-label={label}
              title={label}
              style={{ background: bg, color: fg, '--glow': glow }}
              className="h-10 w-10 grid place-items-center rounded-xl transition-all duration-300 hover:-translate-y-1 hover:scale-105 hover:shadow-[0_0_18px_color-mix(in_srgb,var(--glow)_55%,transparent)]"
            >
              <Icon size={17} />
            </a>
          ))}
        </div>
      </div>
      <p className="text-center text-xs text-[var(--muted)] pb-5">
        © 2026 {profile.name}. All rights reserved.
      </p>
    </footer>
  )
}