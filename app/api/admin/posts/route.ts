import matter from 'gray-matter'
import { NextResponse } from 'next/server'
import { z } from 'zod'

import { isAdminAuthenticated, isSameOriginRequest } from '@/lib/admin/auth'
import { deleteRepositoryFile, readRepositoryDirectory, readRepositoryText, writeRepositoryFile } from '@/lib/admin/github'

const Slug = z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
const PostSchema = z.object({
  action: z.enum(['save', 'delete']),
  slug: Slug,
  title: z.string().trim().min(1).max(120),
  summary: z.string().trim().min(1).max(500),
  image: z.string().trim().max(300),
  author: z.string().trim().min(1).max(100),
  publishedAt: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).or(z.literal('')),
  body: z.string().max(100_000)
})

export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: 'Sign in to manage your portfolio.' }, { status: 401 })
  }

  try {
    const files = await readRepositoryDirectory('content/posts')
    const posts = await Promise.all(files
      .filter(file => file.type === 'file' && file.name.endsWith('.mdx'))
      .map(async file => {
        const source = await readRepositoryText(file.path)
        if (source === null) return null
        const { data, content } = matter(source)
        return {
          slug: file.name.replace(/\.mdx$/, ''),
          title: typeof data.title === 'string' ? data.title : '',
          summary: typeof data.summary === 'string' ? data.summary : '',
          image: typeof data.image === 'string' ? data.image : '',
          author: typeof data.author === 'string' ? data.author : 'Pankaj Yadav',
          publishedAt: typeof data.publishedAt === 'string' ? data.publishedAt : '',
          body: content.trim()
        }
      }))
    return NextResponse.json({ posts: posts.filter(Boolean) })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Could not load posts.' },
      { status: 502 }
    )
  }
}

export async function POST(request: Request) {
  if (!isSameOriginRequest(request)) {
    return NextResponse.json({ error: 'Invalid request origin.' }, { status: 403 })
  }
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: 'Sign in to manage your portfolio.' }, { status: 401 })
  }

  const parsed = PostSchema.safeParse(await request.json().catch(() => null))
  if (!parsed.success) {
    return NextResponse.json({ error: 'Check the post fields and try again.' }, { status: 400 })
  }

  const post = parsed.data
  const path = `content/posts/${post.slug}.mdx`
  try {
    if (post.action === 'delete') {
      await deleteRepositoryFile(path, `Delete post: ${post.title}`)
      return NextResponse.json({ ok: true })
    }

    const frontmatter: Record<string, string> = {
      title: post.title,
      summary: post.summary,
      author: post.author
    }
    if (post.image) frontmatter.image = post.image
    if (post.publishedAt) frontmatter.publishedAt = post.publishedAt

    const source = matter.stringify(post.body.trim() + '\n', frontmatter)
    await writeRepositoryFile(
      path,
      Buffer.from(source, 'utf8').toString('base64'),
      `Update post: ${post.title}`
    )
    return NextResponse.json({ ok: true })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Could not save the post.' },
      { status: 502 }
    )
  }
}
