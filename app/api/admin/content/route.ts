import matter from 'gray-matter'
import { NextResponse } from 'next/server'
import { z } from 'zod'

import { isAdminAuthenticated } from '@/lib/admin/auth'
import { readRepositoryDirectory, readRepositoryFile, readRepositoryText } from '@/lib/admin/github'

const SkillsSchema = z.array(
  z.object({
    title: z.string().min(1).max(50),
    items: z.array(z.string().min(1).max(50)).max(30)
  })
).max(12)

export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: 'Sign in to manage your portfolio.' }, { status: 401 })
  }

  try {
    const projectFiles = await readRepositoryDirectory('content/projects')
    const projects = await Promise.all(
      projectFiles
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
            publishedAt: typeof data.publishedAt === 'string' ? data.publishedAt : '',
            body: content.trim()
          }
        })
    )

    const skillsText = await readRepositoryText('content/skills.json')
    if (!skillsText) {
      throw new Error('The content/skills.json file is missing from the configured repository.')
    }
    const skills = SkillsSchema.parse(JSON.parse(skillsText))
    const resume = await readRepositoryFile('public/resume.pdf')

    return NextResponse.json({
      projects: projects.filter(Boolean),
      skills,
      resumeAvailable: Boolean(resume)
    })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Could not load portfolio content.' },
      { status: 502 }
    )
  }
}
