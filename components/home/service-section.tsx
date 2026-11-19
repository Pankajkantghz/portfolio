import { Code2, Database, Globe, Zap, Wrench, Plug } from 'lucide-react'

export default function ServicesSection() {
  const services = [
    {
      title: 'Full Stack Development',
      description:
        'Responsive web applications built with React, Next.js, Node.js, and Express, with PostgreSQL-backed features.',
      icon: Globe
    },
    {
      title: 'REST API Development',
      description:
        'REST APIs and CRUD workflows using Node.js and Express, with OpenAPI documentation and ownership-based access control.',
      icon: Database
    },
    {
      title: 'Frontend Development',
      description:
        'Responsive interfaces, dashboards, and authentication flows built with React, Next.js, Redux, TypeScript, and Tailwind CSS.',
      icon: Code2
    },
    {
      title: 'Performance & Bug Fixes',
      description:
        'Improve application performance and security with load-time optimization, rate limiting, input sanitization, domain filtering, and secure error handling.',
      icon: Wrench
    },
    {
      title: 'Real-Time Features',
      description:
        'Real-time multiplayer experiences using WebSockets, with server-authoritative game logic and synchronized state.',
      icon: Zap
    },
    {
      title: 'Authentication & API Integration',
      description:
        'Integrate Google OAuth, external APIs, and services such as grammar checking into web applications.',
      icon: Plug
    }
  ]

  return (
    <section className="pb-24">
      <div className="mb-12">
        <h2 className="title mb-3 font-mono">Services</h2>
        <p className="text-muted-foreground text-sm">
          Services I provide for startups, businesses, and modern web
          applications.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {services.map(service => {
          const Icon = service.icon
          return (
            <div
              key={service.title}
              className="border-border rounded-lg border p-5"
            >
              <Icon className="text-muted-foreground mb-3 h-5 w-5" />
              <h3 className="mb-1.5 text-sm font-semibold">{service.title}</h3>
              <p className="text-muted-foreground text-sm">
                {service.description}
              </p>
            </div>
          )
        })}
      </div>
    </section>
  )
}
