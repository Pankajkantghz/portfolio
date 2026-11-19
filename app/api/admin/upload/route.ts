import { NextResponse } from 'next/server'
import { z } from 'zod'

import { isAdminAuthenticated, isSameOriginRequest } from '@/lib/admin/auth'
import { writeRepositoryFile } from '@/lib/admin/github'

const Slug = z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
const MAX_UPLOAD_BYTES = 4 * 1024 * 1024

function imageExtension(bytes: Buffer) {
  if (bytes.length >= 8 && bytes.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]))) return 'png'
  if (bytes.length >= 3 && bytes[0] === 255 && bytes[1] === 216 && bytes[2] === 255) return 'jpg'
  if (bytes.length >= 12 && bytes.toString('ascii', 0, 4) === 'RIFF' && bytes.toString('ascii', 8, 12) === 'WEBP') return 'webp'
  return null
}

export async function POST(request: Request) {
  if (!isSameOriginRequest(request)) {
    return NextResponse.json({ error: 'Invalid request origin.' }, { status: 403 })
  }
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: 'Sign in to manage your portfolio.' }, { status: 401 })
  }

  try {
    const form = await request.formData()
    const file = form.get('file')
    const type = form.get('type')

    if (!(file instanceof File) || file.size === 0 || file.size > MAX_UPLOAD_BYTES) {
      return NextResponse.json({ error: 'Choose a file smaller than 4 MB.' }, { status: 400 })
    }

    const bytes = Buffer.from(await file.arrayBuffer())
    let path: string
    let publicPath: string | undefined

    if (type === 'resume') {
      if (bytes.subarray(0, 5).toString('ascii') !== '%PDF-') {
        return NextResponse.json({ error: 'The selected file is not a valid PDF.' }, { status: 400 })
      }
      path = 'public/resume.pdf'
    } else if (type === 'project-image') {
      const slug = Slug.safeParse(form.get('slug'))
      const extension = imageExtension(bytes)
      if (!slug.success || !extension) {
        return NextResponse.json(
          { error: 'Choose a PNG, JPEG, or WebP screenshot and a valid project slug.' },
          { status: 400 }
        )
      }
      const filename = `${slug.data}-${Date.now()}.${extension}`
      path = `public/images/projects/${filename}`
      publicPath = `/images/projects/${filename}`
    } else {
      return NextResponse.json({ error: 'Choose a resume or project image upload.' }, { status: 400 })
    }

    await writeRepositoryFile(
      path,
      bytes.toString('base64'),
      type === 'resume' ? 'Update resume PDF' : 'Upload project image'
    )

    return NextResponse.json({ ok: true, path: publicPath })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Could not upload the file.' },
      { status: 502 }
    )
  }
}
