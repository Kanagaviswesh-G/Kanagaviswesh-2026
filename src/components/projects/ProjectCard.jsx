import { useState } from 'react'
import { motion } from 'framer-motion'
import { FaGithub, FaExternalLinkAlt } from 'react-icons/fa'

export default function ProjectCard({ project }) {
  const [imgError, setImgError] = useState(false)

  return (
    <motion.article
      whileHover={{ y: -6 }}
      transition={{ type: 'spring', stiffness: 260, damping: 20 }}
      className="card overflow-hidden flex flex-col h-full hover:border-[var(--primary)] transition-colors"
    >
      <div className="aspect-[16/10] bg-[#1d1238] overflow-hidden">
        {imgError ? (
          <div className="h-full w-full grid place-items-center text-center px-4">
            <span className="gradient-text text-lg font-bold">{project.title}</span>
          </div>
        ) : (
          <img
            src={project.image}
            alt={project.title}
            onError={() => setImgError(true)}
            className="h-full w-full object-cover"
          />
        )}
      </div>

      <div className="p-5 flex flex-col flex-1">
        <div className="flex flex-wrap gap-2 mb-3">
          {project.tags.map((t) => (
            <span
              key={t}
              className="rounded-md border border-[var(--border)] bg-[#0f0820] px-2 py-0.5 text-[11px] text-[var(--muted)]"
            >
              {t}
            </span>
          ))}
        </div>

        <h3 className="font-bold text-lg leading-snug">{project.title}</h3>
        <p className="mt-2 text-sm text-[var(--muted)] leading-relaxed flex-1">
          {project.description}
        </p>

        <div className="mt-5 flex items-center justify-between">
          <a
            href={project.demo}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-lg border border-[var(--primary)] px-4 py-2 text-sm font-semibold text-[var(--primary)] hover:bg-[var(--primary)] hover:text-white transition"
          >
            Live Demo <FaExternalLinkAlt size={11} />
          </a>
          <a
            href={project.github}
            target="_blank"
            rel="noreferrer"
            aria-label="GitHub"
            className="text-[var(--muted)] hover:text-white transition"
          >
            <FaGithub size={22} />
          </a>
        </div>
      </div>
    </motion.article>
  )
}