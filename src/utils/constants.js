import { profile } from '../data/profile'

export const NAV_LINKS = [
  { label: 'Home', id: 'home' },
  { label: 'About', id: 'about' },
  { label: 'Skills', id: 'skills' },
  { label: 'Projects', id: 'projects' },
  { label: 'Education', id: 'education' },
  { label: 'Certifications', id: 'certifications' },
  { label: 'Contact', id: 'contact' },
]

export const SECTION_IDS = NAV_LINKS.map((l) => l.id)

export const SOCIALS = {
  linkedin: profile.linkedin,
  github: profile.github,
  email: `mailto:${profile.email}`,
  resume: profile.resume,
}