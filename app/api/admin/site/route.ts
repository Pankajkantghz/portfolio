import { NextResponse } from 'next/server'
import { z } from 'zod'

import { isAdminAuthenticated, isSameOriginRequest } from '@/lib/admin/auth'
import { readRepositoryText, writeRepositoryFile } from '@/lib/admin/github'

const SafeHref = z.string().trim().min(1).max(300).refine(
  value => (value.startsWith('/') && !value.startsWith('//')) || /^https?:\/\//i.test(value),
  'Use a site path or an http(s) URL.'
)

const SiteSchema = z.object({
  header: z.object({
    brand: z.string().trim().min(1).max(12),
    links: z.array(z.object({
      label: z.string().trim().min(1).max(40),
      href: SafeHref,
      external: z.boolean().optional()
    })).max(10)
  }),
  profile: z.object({
    heading: z.string().trim().min(1).max(120),
    description: z.string().trim().min(1).max(1000),
    photo: z.string().trim().min(1).max(300).refine(value => value.startsWith('/images/') && !value.includes('..')),
    photoAlt: z.string().trim().min(1).max(120),
    primaryActionLabel: z.string().trim().min(1).max(80),
    primaryActionHref: SafeHref,
    secondaryActionLabel: z.string().trim().min(1).max(80),
    secondaryActionHref: SafeHref
  }),
  experience: z.object({
    title: z.string().trim().min(1).max(80),
    description: z.string().trim().min(1).max(500),
    items: z.array(z.object({
      role: z.string().trim().min(1).max(100),
      company: z.string().trim().min(1).max(100),
      duration: z.string().trim().min(1).max(100),
      points: z.array(z.string().trim().max(500)).max(12)
    })).max(20)
  }),
  services: z.object({
    title: z.string().trim().min(1).max(80),
    pageTitle: z.string().trim().min(1).max(100),
    description: z.string().trim().min(1).max(500),
    items: z.array(z.object({
      title: z.string().trim().min(1).max(100),
      description: z.string().trim().min(1).max(500),
      icon: z.enum(['Globe', 'Database', 'Code2', 'Wrench', 'Zap', 'Plug'])
    })).max(20)
  }),
  home: z.object({
    skillsTitle: z.string().trim().min(1).max(100),
    skillsDescription: z.string().trim().min(1).max(500),
    recentProjectsTitle: z.string().trim().min(1).max(100),
    recentPostsTitle: z.string().trim().min(1).max(100),
    recentCount: z.number().int().min(1).max(12)
  }),
  contact: z.object({
    homeHeading: z.string().trim().min(1).max(120),
    homeDescription: z.string().trim().min(1).max(1000),
    actionLabel: z.string().trim().min(1).max(80),
    actionHref: SafeHref,
    email: z.string().trim().email().max(254),
    availability: z.string().trim().min(1).max(300),
    pageHeading: z.string().trim().min(1).max(120)
  }),
  social: z.object({
    github: z.string().trim().url().max(300),
    linkedin: z.string().trim().url().max(300),
    codeforces: z.string().trim().url().max(300),
    leetcode: z.string().trim().url().max(300),
    geeksforgeeks: z.string().trim().url().max(300)
  }),
  footer: z.object({
    copyrightName: z.string().trim().min(1).max(120)
  })
})

export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: 'Sign in to manage your portfolio.' }, { status: 401 })
  }

  try {
    const source = await readRepositoryText('content/site.json')
    if (!source) throw new Error('The content/site.json file is missing from the configured repository.')
    const site = SiteSchema.parse(JSON.parse(source))
    return NextResponse.json({ site })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Could not load website content.' },
      { status: 502 }
    )
  }
}

export async function PUT(request: Request) {
  if (!isSameOriginRequest(request)) {
    return NextResponse.json({ error: 'Invalid request origin.' }, { status: 403 })
  }
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: 'Sign in to manage your portfolio.' }, { status: 401 })
  }

  const parsed = SiteSchema.safeParse(await request.json().catch(() => null))
  if (!parsed.success) {
    return NextResponse.json({ error: 'Check the website fields and try again.' }, { status: 400 })
  }

  try {
    const content = `${JSON.stringify(parsed.data, null, 2)}\n`
    await writeRepositoryFile(
      'content/site.json',
      Buffer.from(content, 'utf8').toString('base64'),
      'Update portfolio website content'
    )
    return NextResponse.json({ ok: true })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Could not save website content.' },
      { status: 502 }
    )
  }
}
