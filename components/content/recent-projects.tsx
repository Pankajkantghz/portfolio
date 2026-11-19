import Link from 'next/link'
import { getProjects } from '@/lib/content/projects'
import Projects from '@/components/content/projects'
import siteContent from '@/content/site.json'

export default async function RecentProjects() {
  const projects = getProjects(siteContent.home.recentCount)

  return (
    <section className="pb-24">
      <div>
        <h2 className="title mb-12 font-mono">{siteContent.home.recentProjectsTitle}</h2>
        <Projects projects={projects} />

        <Link
          href="/projects"
          className="text-muted-foreground hover:text-foreground mt-8 inline-flex items-center gap-2 underline decoration-1 underline-offset-2 transition-colors"
        >
          <span>All projects</span>
        </Link>
      </div>
    </section>
  )
}
