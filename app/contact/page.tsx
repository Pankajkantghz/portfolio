import ContactForm from '@/components/contact/contact-form'
import siteContent from '@/content/site.json'

export default function Contact() {
  return (
    <section className="pt-40 pb-24">
      <div className="container max-w-3xl font-mono">
        <h2 className="title font-mono">{siteContent.contact.pageHeading}</h2>

        <ContactForm />
      </div>
    </section>
  )
}
