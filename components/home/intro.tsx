import Image from 'next/image'
import Link from 'next/link'

import siteContent from '@/content/site.json'

export default function Intro() {
  return (
    <section className="mt-12 flex flex-col-reverse items-start justify-between gap-8 pb-24 md:flex-row md:items-center">
      {/* Content */}
      <div className="max-w-2xl">
        <h1 className="title font-mono leading-tight no-underline">
          {siteContent.profile.heading}
        </h1>

        <p className="text-muted-foreground mt-5 max-w-xl text-base leading-relaxed">
          {siteContent.profile.description}
        </p>

        {/* CTA */}
        <div className="mt-7 flex flex-wrap items-center gap-4">
          <Link
            href={siteContent.profile.primaryActionHref}
            className="hover:text-foreground text-sm font-medium underline underline-offset-4 transition-all duration-200 hover:scale-103"
          >
            {siteContent.profile.primaryActionLabel}
          </Link>

          <Link
            href={siteContent.profile.secondaryActionHref}
            className="hover:text-foreground text-sm font-medium underline underline-offset-4 transition-all duration-200 hover:scale-103"
          >
            {siteContent.profile.secondaryActionLabel}
          </Link>
        </div>
      </div>

      {/* Image */}
      <div className="relative">
        <Image
          src={siteContent.profile.photo}
          alt={siteContent.profile.photoAlt}
          width={200}
          height={200}
          priority
          className="transform opacity-90 rounded-2xl object-cover shadow-2xl ring-2 ring-slate-800 transition-all duration-500 ease-in-out hover:scale-[1.02] hover:opacity-85"
        />
      </div>
    </section>
  )
}
