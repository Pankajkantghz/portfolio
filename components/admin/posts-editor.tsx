'use client'

import { useEffect, useState } from 'react'

type PostDraft = {
  slug: string
  title: string
  summary: string
  image: string
  author: string
  publishedAt: string
  body: string
}

const blankPost = (): PostDraft => ({
  slug: '',
  title: '',
  summary: '',
  image: '',
  author: 'Pankaj Yadav',
  publishedAt: new Date().toISOString().slice(0, 10),
  body: ''
})

const fieldClass =
  'mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring'

export default function PostsEditor() {
  const [posts, setPosts] = useState<PostDraft[]>([])
  const [selectedSlug, setSelectedSlug] = useState('__new__')
  const [post, setPost] = useState<PostDraft>(blankPost)
  const [busy, setBusy] = useState(false)
  const [notice, setNotice] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true
    fetch('/api/admin/posts', { cache: 'no-store' })
      .then(async response => {
        const result = await response.json()
        if (!response.ok) throw new Error(result.error || 'Could not load posts.')
        if (active) setPosts(result.posts as PostDraft[])
      })
      .catch(cause => {
        if (active) setError(cause instanceof Error ? cause.message : 'Could not load posts.')
      })
    return () => { active = false }
  }, [])

  function choosePost(slug: string) {
    setSelectedSlug(slug)
    setPost(posts.find(item => item.slug === slug) || blankPost())
    setError('')
    setNotice('')
  }

  async function savePost(action: 'save' | 'delete') {
    if (action === 'delete' && !window.confirm(`Delete “${post.title}”?`)) return
    setBusy(true)
    setError('')
    setNotice('')
    try {
      const response = await fetch('/api/admin/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...post, action })
      })
      const result = await response.json()
      if (!response.ok) throw new Error(result.error || 'Could not save the post.')

      if (action === 'delete') {
        const remaining = posts.filter(item => item.slug !== post.slug)
        setPosts(remaining)
        setPost(remaining[0] || blankPost())
        setSelectedSlug(remaining[0]?.slug || '__new__')
        setNotice('Post deleted from GitHub. Vercel will redeploy the portfolio.')
      } else {
        const next = [...posts.filter(item => item.slug !== post.slug), post]
        setPosts(next)
        setSelectedSlug(post.slug)
        setNotice('Post saved to GitHub. Vercel will redeploy the portfolio.')
      }
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Could not save the post.')
    } finally {
      setBusy(false)
    }
  }

  async function uploadImage(file?: File) {
    if (!file) return
    setBusy(true)
    setError('')
    setNotice('')
    try {
      const form = new FormData()
      form.set('file', file)
      form.set('type', 'post-image')
      form.set('slug', post.slug)
      const response = await fetch('/api/admin/upload', { method: 'POST', body: form })
      const result = await response.json()
      if (!response.ok) throw new Error(result.error || 'Could not upload the image.')
      setPost(current => ({ ...current, image: result.path }))
      setNotice('Image uploaded. Save the post to connect it to the post.')
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Could not upload the image.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <section className="space-y-5">
      {error && <p role="alert" className="rounded-md border border-red-500/30 bg-red-500/5 p-3 text-sm text-red-500">{error}</p>}
      {notice && <p role="status" className="rounded-md border border-border bg-muted/40 p-3 text-sm text-muted-foreground">{notice}</p>}

      <div className="flex flex-wrap items-center gap-3">
        <label className="min-w-56 flex-1 text-sm font-medium">Select post
          <select value={selectedSlug} onChange={event => choosePost(event.target.value)} className={fieldClass}>
            <option value="__new__">New post</option>
            {posts.map(item => <option key={item.slug} value={item.slug}>{item.title}</option>)}
          </select>
        </label>
        <button type="button" onClick={() => choosePost('__new__')} className="mt-6 rounded-full border border-border px-4 py-2 text-sm transition-colors hover:bg-muted">New post</button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="text-sm font-medium">Title
          <input className={fieldClass} value={post.title} onChange={event => setPost({ ...post, title: event.target.value })} />
        </label>
        <label className="text-sm font-medium">URL slug
          <input className={fieldClass} readOnly={selectedSlug !== '__new__'} value={post.slug} onChange={event => setPost({ ...post, slug: event.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') })} placeholder="my-post" />
        </label>
      </div>
      <label className="block text-sm font-medium">Summary
        <textarea rows={2} className={fieldClass} value={post.summary} onChange={event => setPost({ ...post, summary: event.target.value })} />
      </label>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="text-sm font-medium">Author
          <input className={fieldClass} value={post.author} onChange={event => setPost({ ...post, author: event.target.value })} />
        </label>
        <label className="text-sm font-medium">Published date
          <input type="date" className={fieldClass} value={post.publishedAt} onChange={event => setPost({ ...post, publishedAt: event.target.value })} />
        </label>
      </div>
      <label className="block text-sm font-medium">Cover image path
        <input className={fieldClass} value={post.image} onChange={event => setPost({ ...post, image: event.target.value })} placeholder="/images/posts/my-post.png" />
      </label>
      <label className="block text-sm font-medium">Upload cover image (PNG, JPEG, or WebP; up to 4 MB)
        <input type="file" accept="image/png,image/jpeg,image/webp" className={`${fieldClass} file:mr-3 file:rounded-full file:border-0 file:bg-muted file:px-3 file:py-1`} onChange={event => uploadImage(event.target.files?.[0])} disabled={busy || !post.slug} />
      </label>
      <label className="block text-sm font-medium">Post content (Markdown / MDX)
        <textarea rows={20} className={`${fieldClass} font-mono text-xs`} value={post.body} onChange={event => setPost({ ...post, body: event.target.value })} />
      </label>
      <div className="flex flex-wrap gap-3">
        <button type="button" onClick={() => savePost('save')} disabled={busy} className="rounded-full border border-border px-5 py-2 text-sm font-medium transition-colors hover:bg-muted disabled:opacity-50">{busy ? 'Saving…' : 'Save post'}</button>
        {selectedSlug !== '__new__' && (
          <button type="button" onClick={() => savePost('delete')} disabled={busy} className="rounded-full border border-red-500/40 px-5 py-2 text-sm text-red-500 transition-colors hover:bg-red-500/5 disabled:opacity-50">Delete post</button>
        )}
      </div>
    </section>
  )
}
