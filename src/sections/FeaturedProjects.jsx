import SectionHeading from '../components/common/SectionHeading'
import ProjectCard from '../components/projects/ProjectCard'
import { projects } from '../data/projects'

export default function FeaturedProjects() {
  const featured = projects.filter((p) => p.featured)

  return (
    <section className="mx-auto max-w-7xl px-5 py-12">
      <SectionHeading
        title="Featured Projects"
        subtitle="A collection of my best work in AI/ML, full stack development and data science."
        actionLabel="View All Projects"
        actionTo="/projects"
      />
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {featured.map((p) => (
          <ProjectCard key={p.id} project={p} />
        ))}
      </div>
    </section>
  )
}