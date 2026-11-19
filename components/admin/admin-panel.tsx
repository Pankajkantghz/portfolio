'use client'

import { useEffect, useState, type FormEvent } from 'react'
import WebsiteEditor from '@/components/admin/website-editor'
import PostsEditor from '@/components/admin/posts-editor'

type SkillCategory = { title: string; items: string[] }
type ProjectDraft = {
  slug: string
  title: string
  summary: string
  image: string
  publishedAt: string
  body: string
}
type Project = ProjectDraft
type Tab = 'website' | 'projects' | 'posts' | 'skills' | 'resume'

const blankProject = (): ProjectDraft => ({
  slug: '',
  title: '',
  summary: '',
  image: '',
  publishedAt: new Date().toISOString().slice(0, 10),
  body: ''
})

const fieldClass =
  'mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring'

export default function AdminPanel() {
  const [checking, setChecking] = useState(true)
  const [authenticated, setAuthenticated] = useState(false)
  const [password, setPassword] = useState('')
  const [tab, setTab] = useState<Tab>('website')
  const [projects, setProjects] = useState<Project[]>([])
  const [skills, setSkills] = useState<SkillCategory[]>([])
  const [selectedSlug, setSelectedSlug] = useState('')
  const [project, setProject] = useState<ProjectDraft>(blankProject)
  const [resumeAvailable, setResumeAvailable] = useState(false)
  const [busy, setBusy] = useState(false)
  const [notice, setNotice] = useState('')
  const [error, setError] = useState('')

  async function loadContent() {
    const response = await fetch('/api/admin/content', { cache: 'no-store' })
    const result = await response.json()
    if (!response.ok) throw new Error(result.error || 'Could not load portfolio content.')

    const nextProjects = result.projects as Project[]
    setProjects(nextProjects)
    setSkills(result.skills as SkillCategory[])
    setResumeAvailable(Boolean(result.resumeAvailable))
    if (!selectedSlug && nextProjects.length) {
      setSelectedSlug(nextProjects[0].slug)
      setProject(nextProjects[0])
    }
  }

  useEffect(() => {
    let active = true
    fetch('/api/admin/session', { cache: 'no-store' })
      .then(response => response.json())
      .then(async result => {
        if (!active) return
        setAuthenticated(Boolean(result.authenticated))
        if (result.authenticated) await loadContent()
      })
      .catch(() => {
        if (active) setError('Could not connect to the admin service.')
      })
      .finally(() => {
        if (active) setChecking(false)
      })

    return () => {
      active = false
    }
    // Initial session check only; loadContent is intentionally invoked once.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function signIn(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setBusy(true)
    setError('')
    setNotice('')
    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      })
      const result = await response.json()
      if (!response.ok) throw new Error(result.error || 'Sign in failed.')
      setAuthenticated(true)
      setPassword('')
      await loadContent()
      setNotice('Signed in. Portfolio edits will be saved to GitHub.')
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Sign in failed.')
    } finally {
      setBusy(false)
    }
  }

  async function signOut() {
    await fetch('/api/admin/logout', { method: 'POST' })
    setAuthenticated(false)
    setProjects([])
    setSkills([])
    setNotice('')
  }

  async function saveSkills() {
    setBusy(true)
    setError('')
    setNotice('')
    try {
      const response = await fetch('/api/admin/skills', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(skills)
      })
      const result = await response.json()
      if (!response.ok) throw new Error(result.error || 'Could not save skills.')
      setNotice('Skills saved to GitHub. Vercel will redeploy the portfolio.')
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Could not save skills.')
    } finally {
      setBusy(false)
    }
  }

  async function saveProject(action: 'save' | 'delete') {
    setBusy(true)
    setError('')
    setNotice('')
    try {
      const response = await fetch('/api/admin/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...project, action })
      })
      const result = await response.json()
      if (!response.ok) throw new Error(result.error || 'Could not save project.')

      if (action === 'delete') {
        const remaining = projects.filter(item => item.slug !== project.slug)
        setProjects(remaining)
        const next = remaining[0] || blankProject()
        setSelectedSlug(next.slug || '__new__')
        setProject(next)
        setNotice('Project deleted from GitHub. Vercel will redeploy the portfolio.')
      } else {
        const updated = { ...project }
        const next = [...projects.filter(item => item.slug !== project.slug), updated]
        setProjects(next.sort((a, b) => a.title.localeCompare(b.title)))
        setSelectedSlug(project.slug)
        setNotice('Project saved to GitHub. Vercel will redeploy the portfolio.')
      }
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Could not save project.')
    } finally {
      setBusy(false)
    }
  }

  async function uploadFile(file: File, type: 'resume' | 'project-image') {
    const form = new FormData()
    form.set('file', file)
    form.set('type', type)
    if (type === 'project-image') form.set('slug', project.slug)

    const response = await fetch('/api/admin/upload', { method: 'POST', body: form })
    const result = await response.json()
    if (!response.ok) throw new Error(result.error || 'Upload failed.')
    return result.path as string | undefined
  }

  async function handleUpload(file: File | undefined, type: 'resume' | 'project-image') {
    if (!file) return
    setBusy(true)
    setError('')
    setNotice('')
    try {
      const path = await uploadFile(file, type)
      if (type === 'resume') {
        setResumeAvailable(true)
        setNotice('Resume uploaded to GitHub. Vercel will redeploy the portfolio.')
      } else if (path) {
        setProject(current => ({ ...current, image: path }))
        setNotice('Image uploaded. Save the project to link it to this image.')
      }
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Upload failed.')
    } finally {
      setBusy(false)
    }
  }

  async function deleteResume() {
    if (!window.confirm('Delete the current resume PDF?')) return

    setBusy(true)
    setError('')
    setNotice('')
    try {
      const response = await fetch('/api/admin/resume', { method: 'DELETE' })
      const result = await response.json()
      if (!response.ok) throw new Error(result.error || 'Could not delete the resume.')
      setResumeAvailable(false)
      setNotice('Resume deleted from GitHub. Vercel will redeploy the portfolio.')
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Could not delete the resume.')
    } finally {
      setBusy(false)
    }
  }

  function chooseProject(slug: string) {
    setSelectedSlug(slug)
    const selected = projects.find(item => item.slug === slug)
    setProject(selected || blankProject())
  }

  function updateSkillCategory(index: number, update: Partial<SkillCategory>) {
    setSkills(current => current.map((category, i) => i === index ? { ...category, ...update } : category))
  }

  function updateSkill(index: number, skillIndex: number, value: string) {
    setSkills(current => current.map((category, i) => {
      if (i !== index) return category
      return {
        ...category,
        items: category.items.map((item, j) => j === skillIndex ? value : item)
      }
    }))
  }

  if (checking) {
    return <p className="text-sm text-muted-foreground">Checking admin access…</p>
  }

  if (!authenticated) {
    return (
      <div className="mx-auto max-w-md rounded-xl border border-border p-6 sm:p-8">
        <h1 className="title font-mono">Admin sign in</h1>
        <p className="mt-6 text-sm text-muted-foreground">
          Sign in to manage your resume, projects, and skills.
        </p>
        <form className="mt-6 space-y-4" onSubmit={signIn}>
          <label className="block text-sm font-medium" htmlFor="admin-password">
            Admin password
            <input
              id="admin-password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={event => setPassword(event.target.value)}
              className={fieldClass}
            />
          </label>
          <button className="rounded-full border border-border px-5 py-2 text-sm font-medium transition-colors hover:bg-muted disabled:opacity-50" disabled={busy}>
            {busy ? 'Signing in…' : 'Sign in'}
          </button>
        </form>
        {error && <p role="alert" className="mt-4 text-sm text-red-500">{error}</p>}
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="title font-mono">Portfolio admin</h1>
          <p className="mt-5 text-sm text-muted-foreground">
            Changes are committed to GitHub and published by Vercel.
          </p>
        </div>
        <button onClick={signOut} className="rounded-full border border-border px-4 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
          Sign out
        </button>
      </div>

      <div className="flex flex-wrap gap-2 border-b border-border pb-3">
        {(['website', 'projects', 'posts', 'skills', 'resume'] as const).map(item => (
          <button
            key={item}
            onClick={() => { setTab(item); setError(''); setNotice('') }}
            className={`rounded-full px-4 py-2 text-sm capitalize transition-colors ${tab === item ? 'bg-foreground text-background' : 'text-muted-foreground hover:bg-muted hover:text-foreground'}`}
          >
            {item}
          </button>
        ))}
      </div>

      {error && <p role="alert" className="rounded-md border border-red-500/30 bg-red-500/5 p-3 text-sm text-red-500">{error}</p>}
      {notice && <p role="status" className="rounded-md border border-border bg-muted/40 p-3 text-sm text-muted-foreground">{notice}</p>}

      <div className={tab === 'website' ? '' : 'hidden'}>
        <WebsiteEditor />
      </div>
      <section className={`space-y-5 ${tab === 'posts' ? '' : 'hidden'}`}>
          <div>
            <h2 className="text-lg font-semibold">Posts</h2>
            <p className="mt-1 text-sm text-muted-foreground">Create, edit, and delete posts. The homepage shows the newest posts first.</p>
          </div>
          <PostsEditor />
      </section>

      {tab === 'projects' && (
        <section className="space-y-5">
          <div className="flex flex-wrap items-center gap-3">
            <label className="min-w-56 flex-1 text-sm font-medium">
              Select project
              <select value={selectedSlug} onChange={event => chooseProject(event.target.value)} className={fieldClass}>
                {projects.map(item => <option key={item.slug} value={item.slug}>{item.title}</option>)}
                {selectedSlug === '__new__' && <option value="__new__">New project</option>}
              </select>
            </label>
            <button
              onClick={() => { setSelectedSlug('__new__'); setProject(blankProject()); setError(''); setNotice('') }}
              className="mt-6 rounded-full border border-border px-4 py-2 text-sm transition-colors hover:bg-muted"
            >
              New project
            </button>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="text-sm font-medium">Title
              <input className={fieldClass} value={project.title} onChange={event => setProject({ ...project, title: event.target.value })} />
            </label>
            <label className="text-sm font-medium">URL slug
              <input className={fieldClass} readOnly={selectedSlug !== '__new__'} value={project.slug} onChange={event => setProject({ ...project, slug: event.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') })} placeholder="my-project" />
            </label>
          </div>
          <label className="block text-sm font-medium">Summary
            <textarea className={fieldClass} rows={2} value={project.summary} onChange={event => setProject({ ...project, summary: event.target.value })} />
          </label>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="text-sm font-medium">Published date
              <input type="date" className={fieldClass} value={project.publishedAt} onChange={event => setProject({ ...project, publishedAt: event.target.value })} />
            </label>
            <label className="text-sm font-medium">Project image path
              <input className={fieldClass} value={project.image} onChange={event => setProject({ ...project, image: event.target.value })} placeholder="/images/projects/my-project.png" />
            </label>
          </div>
          <label className="block text-sm font-medium">Upload project screenshot
            <input type="file" accept="image/png,image/jpeg,image/webp" className={`${fieldClass} file:mr-3 file:rounded-full file:border-0 file:bg-muted file:px-3 file:py-1`} onChange={event => handleUpload(event.target.files?.[0], 'project-image')} disabled={busy || !project.slug} />
          </label>
          <label className="block text-sm font-medium">Project page content (Markdown / MDX)
            <textarea className={`${fieldClass} font-mono text-xs`} rows={16} value={project.body} onChange={event => setProject({ ...project, body: event.target.value })} />
          </label>
          <div className="flex flex-wrap gap-3">
            <button onClick={() => saveProject('save')} disabled={busy} className="rounded-full border border-border px-5 py-2 text-sm font-medium transition-colors hover:bg-muted disabled:opacity-50">
              {busy ? 'Saving…' : 'Save project'}
            </button>
            {selectedSlug !== '__new__' && selectedSlug && (
              <button onClick={() => { if (window.confirm(`Delete ${project.title}?`)) void saveProject('delete') }} disabled={busy} className="rounded-full border border-red-500/40 px-5 py-2 text-sm text-red-500 transition-colors hover:bg-red-500/5 disabled:opacity-50">
                Delete project
              </button>
            )}
          </div>
        </section>
      )}

      {tab === 'skills' && (
        <section className="space-y-5">
          {skills.map((category, index) => (
            <div key={`${category.title}-${index}`} className="rounded-lg border border-border p-4 sm:p-5">
              <div className="flex items-center gap-3">
                <input aria-label="Category name" className={fieldClass} value={category.title} onChange={event => updateSkillCategory(index, { title: event.target.value })} />
                <button aria-label={`Remove ${category.title} category`} onClick={() => setSkills(current => current.filter((_, i) => i !== index))} className="rounded-md px-3 py-2 text-sm text-red-500 hover:bg-red-500/5">Remove</button>
              </div>
              <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {category.items.map((item, skillIndex) => (
                  <div key={`${index}-${skillIndex}`} className="flex items-center gap-2">
                    <input aria-label="Skill name" className={fieldClass} value={item} onChange={event => updateSkill(index, skillIndex, event.target.value)} />
                    <button aria-label={`Remove ${item}`} onClick={() => updateSkillCategory(index, { items: category.items.filter((_, i) => i !== skillIndex) })} className="rounded-md px-2 py-2 text-sm text-muted-foreground hover:bg-muted">×</button>
                  </div>
                ))}
              </div>
              <button onClick={() => updateSkillCategory(index, { items: [...category.items, 'New skill'] })} className="mt-4 text-sm text-muted-foreground underline underline-offset-4 hover:text-foreground">Add skill</button>
            </div>
          ))}
          <div className="flex flex-wrap gap-3">
            <button onClick={() => setSkills(current => [...current, { title: 'New category', items: [] }])} className="rounded-full border border-border px-4 py-2 text-sm transition-colors hover:bg-muted">Add category</button>
            <button onClick={saveSkills} disabled={busy} className="rounded-full border border-border px-5 py-2 text-sm font-medium transition-colors hover:bg-muted disabled:opacity-50">{busy ? 'Saving…' : 'Save skills'}</button>
          </div>
        </section>
      )}

      {tab === 'resume' && (
        <section className="max-w-2xl space-y-5 rounded-lg border border-border p-5 sm:p-6">
          <div>
            <h2 className="text-lg font-semibold">Resume PDF</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Uploading replaces <code className="rounded bg-muted px-1.5 py-0.5">/resume.pdf</code>, used by the Resume links on your portfolio.
            </p>
          </div>
          <p className="text-sm text-muted-foreground">{resumeAvailable ? 'A resume is currently stored in the repository.' : 'No resume PDF was found in the repository.'}</p>
          <label className="block text-sm font-medium">Choose a PDF (maximum 4 MB)
            <input type="file" accept="application/pdf,.pdf" className={`${fieldClass} file:mr-3 file:rounded-full file:border-0 file:bg-muted file:px-3 file:py-1`} onChange={event => handleUpload(event.target.files?.[0], 'resume')} disabled={busy} />
          </label>
          {busy && <p className="text-sm text-muted-foreground">Updating resume…</p>}
          {resumeAvailable && (
            <button
              type="button"
              onClick={deleteResume}
              disabled={busy}
              className="rounded-full border border-red-500/40 px-5 py-2 text-sm text-red-500 transition-colors hover:bg-red-500/5 disabled:opacity-50"
            >
              Delete resume
            </button>
          )}
        </section>
      )}
    </div>
  )
}
