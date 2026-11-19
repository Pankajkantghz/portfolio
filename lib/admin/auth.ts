import { createHmac, timingSafeEqual } from 'node:crypto'
import { cookies } from 'next/headers'

const COOKIE_NAME = 'portfolio_admin_session'
const SESSION_TTL_SECONDS = 60 * 60 * 24 * 7

function sessionSecret() {
  const secret = process.env.ADMIN_SESSION_SECRET
  if (!secret || secret.length < 32) {
    throw new Error('ADMIN_SESSION_SECRET must contain at least 32 characters.')
  }
  return secret
}

function signature(payload: string) {
  return createHmac('sha256', sessionSecret())
    .update(payload)
    .digest('base64url')
}

export function isSameOriginRequest(request: Request) {
  const origin = request.headers.get('origin')
  if (!origin) return false

  try {
    return new URL(origin).origin === new URL(request.url).origin
  } catch {
    return false
  }
}

export function verifyAdminPassword(password: string) {
  const expected = process.env.ADMIN_PASSWORD
  if (!expected) return false

  const actualHash = createHmac('sha256', 'admin-password-check')
    .update(password)
    .digest()
  const expectedHash = createHmac('sha256', 'admin-password-check')
    .update(expected)
    .digest()

  return timingSafeEqual(actualHash, expectedHash)
}

export function createAdminSession() {
  const expiresAt = Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS
  const payload = Buffer.from(JSON.stringify({ expiresAt })).toString('base64url')
  return `${payload}.${signature(payload)}`
}

export function verifyAdminSession(token?: string) {
  if (!token) return false

  try {
    const [payload, providedSignature] = token.split('.')
    if (!payload || !providedSignature) return false

    const expectedSignature = signature(payload)
    const provided = Buffer.from(providedSignature)
    const expected = Buffer.from(expectedSignature)
    if (provided.length !== expected.length || !timingSafeEqual(provided, expected)) {
      return false
    }

    const value = JSON.parse(Buffer.from(payload, 'base64url').toString()) as {
      expiresAt?: number
    }

    return typeof value.expiresAt === 'number' && value.expiresAt > Date.now() / 1000
  } catch {
    return false
  }
}

export async function isAdminAuthenticated() {
  const cookieStore = await cookies()
  return verifyAdminSession(cookieStore.get(COOKIE_NAME)?.value)
}

export function setAdminSessionCookie(response: Response, token: string) {
  const secure = process.env.NODE_ENV === 'production' ? '; Secure' : ''
  response.headers.append(
    'Set-Cookie',
    `${COOKIE_NAME}=${token}; Path=/; HttpOnly; SameSite=Strict; Max-Age=${SESSION_TTL_SECONDS}${secure}`
  )
}

export function clearAdminSessionCookie(response: Response) {
  const secure = process.env.NODE_ENV === 'production' ? '; Secure' : ''
  response.headers.append(
    'Set-Cookie',
    `${COOKIE_NAME}=; Path=/; HttpOnly; SameSite=Strict; Max-Age=0${secure}`
  )
}
