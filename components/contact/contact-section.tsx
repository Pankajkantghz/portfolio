'use client'

import Link from 'next/link'
import { Mail } from 'lucide-react'
import { GitHubLogoIcon, LinkedInLogoIcon } from '@radix-ui/react-icons'
import siteContent from '@/content/site.json'

export default function ContactSection() {
  return (
    <section className="pb-12">
      <div className="border-border rounded-2xl border p-6 md:p-8">
        <div className="space-y-6">
          {/* Heading */}
          <div>
            <h2 className="title font-mono leading-tight">
              {siteContent.contact.homeHeading}
            </h2>

            <p className="text-muted-foreground mt-3 max-w-md text-sm leading-6">
              {siteContent.contact.homeDescription}
            </p>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap items-center gap-3">
            <Link
              href={siteContent.contact.actionHref}
              className="border-border hover:bg-muted rounded-full border px-5 py-2 text-sm font-medium transition-colors"
            >
              {siteContent.contact.actionLabel}
            </Link>

            <Link
              href={`mailto:${siteContent.contact.email}`}
              className="border-border text-muted-foreground hover:bg-muted hover:text-foreground flex items-center gap-2 rounded-full border px-4 py-2 text-sm transition-colors"
            >
              <Mail className="h-4 w-4" />
              Email
            </Link>

            <Link
              href={siteContent.social.linkedin}
              target="_blank"
              rel="noreferrer"
              aria-label="LinkedIn"
              className="border-border text-muted-foreground hover:bg-muted hover:text-foreground flex h-9 w-9 items-center justify-center rounded-full border transition-colors"
            >
              <LinkedInLogoIcon className="h-4 w-4" />
            </Link>

            <Link
              href={siteContent.social.github}
              target="_blank"
              rel="noreferrer"
              aria-label="GitHub"
              className="border-border text-muted-foreground hover:bg-muted hover:text-foreground flex h-9 w-9 items-center justify-center rounded-full border transition-colors"
            >
              <GitHubLogoIcon className="h-4 w-4" />
            </Link>
          </div>

          {/* Footer */}
          <p className="text-muted-foreground text-xs">
            {siteContent.contact.availability}
          </p>
        </div>
      </div>
    </section>
  )
}
