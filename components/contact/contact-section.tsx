'use client'

import Link from 'next/link'
import { Mail } from 'lucide-react'
import { GitHubLogoIcon, LinkedInLogoIcon } from '@radix-ui/react-icons'

export default function ContactSection() {
  return (
    <section className="pb-12">
      <div className="border-border rounded-2xl border p-6 md:p-8">
        <div className="space-y-6">
          {/* Heading */}
          <div>
            <h2 className="title font-mono leading-tight">
              Let&apos;s build something together
            </h2>

            <p className="text-muted-foreground mt-3 max-w-md text-sm leading-6">
              I build full-stack web apps, AI-powered tools, and real-time
              experiences with React, Next.js, Node.js, and TypeScript. Have a
              project or opportunity in mind? Let&apos;s talk.
            </p>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/contact"
              className="border-border hover:bg-muted rounded-full border px-5 py-2 text-sm font-medium transition-colors"
            >
              Start a Conversation
            </Link>

            <Link
              href="mailto:pankaj.py96810@gmail.com"
              className="border-border text-muted-foreground hover:bg-muted hover:text-foreground flex items-center gap-2 rounded-full border px-4 py-2 text-sm transition-colors"
            >
              <Mail className="h-4 w-4" />
              Email
            </Link>

            <Link
              href="https://www.linkedin.com/in/pankaj025/"
              target="_blank"
              aria-label="LinkedIn"
              className="border-border text-muted-foreground hover:bg-muted hover:text-foreground flex h-9 w-9 items-center justify-center rounded-full border transition-colors"
            >
              <LinkedInLogoIcon className="h-4 w-4" />
            </Link>

            <Link
              href="https://github.com/Pankajkantghz"
              target="_blank"
              aria-label="GitHub"
              className="border-border text-muted-foreground hover:bg-muted hover:text-foreground flex h-9 w-9 items-center justify-center rounded-full border transition-colors"
            >
              <GitHubLogoIcon className="h-4 w-4" />
            </Link>
          </div>

          {/* Footer */}
          <p className="text-muted-foreground text-xs">
            Open to project inquiries and software development opportunities.
          </p>
        </div>
      </div>
    </section>
  )
}
