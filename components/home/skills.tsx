import type { ComponentType } from 'react'
import {
  SiCplusplus,
  SiJavascript,
  SiTypescript,
  SiMysql,
  SiReact,
  SiRedux,
  SiNodedotjs,
  SiExpress,
  SiTailwindcss,
  SiMongodb,
  SiPostgresql,
  SiFirebase,
  SiGit,
  SiDocker,
  SiPostman,
  SiGraphql,
  SiNextdotjs,
  SiGithub,
  SiLinux,
  SiHtml5,
  SiRedis,
  SiFigma,
  SiNestjs
} from 'react-icons/si'
import { Cloud, Code2, Network, Workflow } from 'lucide-react'
import skills from '@/content/skills.json'

type SkillIcon = ComponentType<{ className?: string }>

const skillIcons: Record<string, SkillIcon> = {
  'C++': SiCplusplus,
  Java: Code2,
  JavaScript: SiJavascript,
  TypeScript: SiTypescript,
  SQL: SiMysql,
  React: SiReact,
  'Next.js': SiNextdotjs,
  Redux: SiRedux,
  HTML: SiHtml5,
  CSS: Code2,
  'Tailwind CSS': SiTailwindcss,
  'Node.js': SiNodedotjs,
  Express: SiExpress,
  NestJS: SiNestjs,
  'REST API': SiPostman,
  WebSockets: Network,
  GraphQL: SiGraphql,
  MongoDB: SiMongodb,
  PostgreSQL: SiPostgresql,
  Redis: SiRedis,
  Firebase: SiFirebase,
  Git: SiGit,
  GitHub: SiGithub,
  Docker: SiDocker,
  Linux: SiLinux,
  AWS: Cloud,
  Postman: SiPostman,
  Figma: SiFigma,
  Groq: Code2,
  DSA: SiCplusplus,
  DBMS: SiMysql,
  OS: SiLinux,
  CN: Network,
  'System Design': Workflow,
  OOP: Code2
}

export default function SkillsSection() {
  return (
    <section className="pb-24">
      <div className="mb-12">
        <h2 className="title mb-3 font-mono">Skills</h2>
        <p className="text-muted-foreground text-sm">
          Technologies, tools, and concepts I use to build scalable modern
          applications.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {skills.map(skill => (
          <div
            key={skill.title}
            className="border-border rounded-lg border p-5"
          >
            <h3 className="mb-4 text-sm font-semibold">{skill.title}</h3>

            <div className="flex flex-wrap gap-2">
              {skill.items.map(name => {
                const Icon = skillIcons[name] ?? Code2
                return (
                  <div
                    key={name}
                    className="border-border text-muted-foreground flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs"
                  >
                    <Icon className="text-sm" />
                    <span>{name}</span>
                  </div>
                )
              })}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
