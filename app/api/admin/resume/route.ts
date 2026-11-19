import { NextResponse } from 'next/server'

import { isAdminAuthenticated, isSameOriginRequest } from '@/lib/admin/auth'
import { deleteRepositoryFile } from '@/lib/admin/github'

export async function DELETE(request: Request) {
  if (!isSameOriginRequest(request)) {
    return NextResponse.json({ error: 'Invalid request origin.' }, { status: 403 })
  }
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: 'Sign in to manage your portfolio.' }, { status: 401 })
  }

  try {
    await deleteRepositoryFile('public/resume.pdf', 'Delete resume PDF')
    return NextResponse.json({ ok: true })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Could not delete the resume.' },
      { status: 502 }
    )
  }
}
