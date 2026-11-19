import { NextResponse } from 'next/server'
import { z } from 'zod'

import {
  createAdminSession,
  isSameOriginRequest,
  setAdminSessionCookie,
  verifyAdminPassword
} from '@/lib/admin/auth'

const LoginSchema = z.object({ password: z.string().min(1).max(512) })

export async function POST(request: Request) {
  if (!isSameOriginRequest(request)) {
    return NextResponse.json({ error: 'Invalid request origin.' }, { status: 403 })
  }

  const parsed = LoginSchema.safeParse(await request.json().catch(() => null))
  if (!parsed.success || !verifyAdminPassword(parsed.data.password)) {
    return NextResponse.json({ error: 'Incorrect admin password.' }, { status: 401 })
  }

  try {
    const response = NextResponse.json({ ok: true })
    setAdminSessionCookie(response, createAdminSession())
    return response
  } catch {
    return NextResponse.json(
      { error: 'Admin session is not configured on this deployment.' },
      { status: 503 }
    )
  }
}
