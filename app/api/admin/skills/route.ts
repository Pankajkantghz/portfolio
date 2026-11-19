import { NextResponse } from 'next/server'
import { z } from 'zod'

import { isAdminAuthenticated, isSameOriginRequest } from '@/lib/admin/auth'
import { writeRepositoryFile } from '@/lib/admin/github'

const SkillsSchema = z.array(
  z.object({
    title: z.string().trim().min(1).max(50),
    items: z.array(z.string().trim().min(1).max(50)).max(30)
  })
).min(1).max(12)

export async function PUT(request: Request) {
  if (!isSameOriginRequest(request)) {
    return NextResponse.json({ error: 'Invalid request origin.' }, { status: 403 })
  }
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: 'Sign in to manage your portfolio.' }, { status: 401 })
  }

  const parsed = SkillsSchema.safeParse(await request.json().catch(() => null))
  if (!parsed.success) {
    return NextResponse.json({ error: 'Check the skill categories and try again.' }, { status: 400 })
  }

  try {
    const content = `${JSON.stringify(parsed.data, null, 2)}\n`
    await writeRepositoryFile(
      'content/skills.json',
      Buffer.from(content, 'utf8').toString('base64'),
      'Update portfolio skills'
    )
    return NextResponse.json({ ok: true })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Could not save skills.' },
      { status: 502 }
    )
  }
}
