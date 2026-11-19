import matter from 'gray-matter'
import { NextResponse } from 'next/server'
import { z } from 'zod'

import { isAdminAuthenticated, isSameOriginRequest } from '@/lib/admin/auth'
import { deleteRepositoryFile, writeRepositoryFile } from '@/lib/admin/github'

const Slug = z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
const ProjectSchema = z.object({
  action: z.enum(['save', 'delete']),
  slug: Slug,
  title: z.string().min(1).max(100),
  summary: z.string().min(1).max(300),
  image: z.string().max(300),
  publishedAt: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).or(z.literal('')),
  body: z.string().max(100_000)
})

export async function POST(request: Request) {
  if (!isSameOriginRequest(request)) {
    return NextResponse.json({ error: 'Invalid request origin.' }, { status: 403 })
  }
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: 'Sign in to manage your portfolio.' }, { status: 401 })
  }

  const parsed = ProjectSchema.safeParse(await request.json().catch(() => null))
  if (!parsed.success) {
    return NextResponse.json({ error: 'Check the project fields and try again.' }, { status: 400 })
  }

  const project = parsed.data
  const path = `content/projects/${project.slug}.mdx`

  try {
    if (project.action === 'delete') {
      await deleteRepositoryFile(path, `Delete project: ${project.title}`)
      return NextResponse.json({ ok: true })
    }

    const frontmatter: Record<string, string> = {
      title: project.title,
      summary: project.summary,
      author: 'Pankaj Yadav'
    }
    if (project.image) frontmatter.image = project.image
    if (project.publishedAt) frontmatter.publishedAt = project.publishedAt

    const source = matter.stringify(project.body.trim() + '\n', frontmatter)
    await writeRepositoryFile(
      path,
      Buffer.from(source, 'utf8').toString('base64'),
      `Update project: ${project.title}`
    )

    return NextResponse.json({ ok: true })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Could not save the project.' },
      { status: 502 }
    )
  }
}
