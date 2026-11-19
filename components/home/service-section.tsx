import { Code2, Database, Globe, Zap, Wrench, Plug } from 'lucide-react'
import siteContent from '@/content/site.json'
import type { LucideIcon } from 'lucide-react'
import type { ServiceIconName, SiteContent } from '@/lib/content/site'

const serviceIcons: Record<ServiceIconName, LucideIcon> = {
  Code2,
  Database,
  Globe,
  Wrench,
  Zap,
  Plug
}

export default function ServicesSection() {
  return (
    <section className="pb-24">
      <div className="mb-12">
        <h2 className="title mb-3 font-mono">{siteContent.services.title}</h2>
        <p className="text-muted-foreground text-sm">
          {siteContent.services.description}
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {(siteContent.services as SiteContent['services']).items.map((service, index) => {
          const Icon = serviceIcons[service.icon]
          return (
            <div
              key={`${service.title}-${index}`}
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
