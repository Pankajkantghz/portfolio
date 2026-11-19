import Link from 'next/link'
import Image from 'next/image'
import { GitHubLogoIcon, LinkedInLogoIcon } from '@radix-ui/react-icons'
import { SiCodeforces } from 'react-icons/si'
import siteContent from '@/content/site.json'

export default function Footer() {
  return (
    <footer className="py-10">
      <div className="border-border container max-w-3xl border-t pt-12">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          {/* Left */}
          <div className="flex flex-wrap items-center gap-8">
            <Link href="/" className="font-serif text-sm font-bold">
              Home
            </Link>

            <ul className="text-muted-foreground flex items-center gap-6 text-sm font-light">
              {siteContent.header.links.filter(link => link.href !== '/resume.pdf').map(link => (
                <li key={link.label} className="hover:text-foreground transition-colors">
                  <Link href={link.href}>{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Right */}
          <div className="text-muted-foreground flex items-center gap-4">
            <Link
              href={siteContent.social.linkedin}
              target="_blank"
              rel="noreferrer"
              className="hover:text-foreground transition-colors"
              aria-label="LinkedIn"
            >
              <LinkedInLogoIcon className="h-4 w-4" />
            </Link>

            <Link
              href={siteContent.social.github}
              target="_blank"
              rel="noreferrer"
              className="hover:text-foreground transition-colors"
              aria-label="GitHub"
            >
              <GitHubLogoIcon className="h-4 w-4" />
            </Link>

            <Link
              href={siteContent.social.codeforces}
              target="_blank"
              rel="noreferrer"
              className="hover:text-foreground transition-colors"
              aria-label="Codeforces"
            >
              <SiCodeforces className="h-4 w-4" />
            </Link>

            <Link
              href={siteContent.social.leetcode}
              target="_blank"
              rel="noreferrer"
              className="hover:text-foreground flex items-center gap-1 text-xs transition-colors"
            >
              <Image
                src="https://upload.wikimedia.org/wikipedia/commons/1/19/LeetCode_logo_black.png"
                alt="LeetCode"
                width={20}
                height={20}
                className="h-5 w-5 dark:invert"
              />
            </Link>

            <Link
              href={siteContent.social.geeksforgeeks}
              target="_blank"
              rel="noreferrer"
              className="hover:text-foreground flex items-center gap-1 text-xs transition-colors"
            >
              <Image
                src="https://media.geeksforgeeks.org/gfg-gg-logo.svg"
                alt="GFG"
                width={20}
                height={20}
                className="h-5 w-5"
              />
            </Link>
          </div>
        </div>

        {/* Bottom */}
        <p className="text-muted-foreground mt-12 flex justify-center text-xs">
          © {new Date().getFullYear()} {siteContent.footer.copyrightName}. All rights reserved.
        </p>
      </div>
    </footer>
  )
}
