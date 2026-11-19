import { NextResponse } from 'next/server'

import { clearAdminSessionCookie, isSameOriginRequest } from '@/lib/admin/auth'

export async function POST(request: Request) {
  if (!isSameOriginRequest(request)) {
    return NextResponse.json({ error: 'Invalid request origin.' }, { status: 403 })
  }

  const response = NextResponse.json({ ok: true })
  clearAdminSessionCookie(response)
  return response
}
