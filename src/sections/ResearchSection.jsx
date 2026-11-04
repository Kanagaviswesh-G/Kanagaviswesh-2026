import { FaFileAlt } from 'react-icons/fa'
import Button from '../components/common/Button'
import { certifications } from '../data/certifications'

export default function ResearchSection() {
  const paper = certifications.find((c) => c.type === 'research')
  if (!paper) return null

  return (
    <section className="mx-auto max-w-7xl px-5 py-12">
      <div className="card p-6 md:p-8 flex flex-col md:flex-row md:items-center gap-6">
        <span className="h-16 w-16 shrink-0 grid place-items-center rounded-2xl bg-[var(--bg-tint)] text-[var(--primary)] text-2xl">
          <FaFileAlt />
        </span>
        <div className="flex-1">
          <p className="text-xs uppercase tracking-wider text-[var(--primary)]">Research Paper (IEEE)</p>
          <h3 className="text-xl font-bold mt-1">{paper.description}</h3>
          <p className="text-sm text-[var(--muted)] mt-1">{paper.issuer}</p>
        </div>
        <Button href={paper.link} target="_blank" rel="noreferrer">
          {paper.cta}
        </Button>
      </div>
    </section>
  )
}