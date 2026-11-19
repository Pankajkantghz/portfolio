type Bucket = { count: number; resetAt: number }

const buckets = new Map<string, Bucket>()

/** Process-local backstop; use a shared store for multi-instance deployments. */
export function isRateLimited(
  key: string,
  limit: number,
  windowMs: number
): boolean {
  const now = Date.now()
  const bucket = buckets.get(key)

  if (!bucket || bucket.resetAt <= now) {
    if (buckets.size >= 5000) {
      const oldestKey = buckets.keys().next().value
      if (oldestKey) buckets.delete(oldestKey)
    }

    buckets.set(key, { count: 1, resetAt: now + windowMs })

    if (buckets.size > 1000) {
      for (const [bucketKey, value] of buckets) {
        if (value.resetAt <= now) buckets.delete(bucketKey)
      }
    }

    return false
  }

  if (bucket.count >= limit) return true

  bucket.count += 1
  return false
}
