import ServicesSection from '@/components/home/service-section'
import siteContent from '@/content/site.json'

export default function Services() {
  return (
    <section className="pb-24 pt-40">
      <div className="container max-w-3xl">
        <h1 className="title mb-8 font-mono">{siteContent.services.pageTitle}</h1>

        <ServicesSection />
      </div>
    </section>
  )
}
