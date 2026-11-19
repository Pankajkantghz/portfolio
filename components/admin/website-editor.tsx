'use client'

import { useEffect, useState } from 'react'

import initialSite from '@/content/site.json'
import type { ServiceIconName, SiteContent } from '@/lib/content/site'

const fieldClass =
  'mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring'
const iconNames: ServiceIconName[] = ['Globe', 'Database', 'Code2', 'Wrench', 'Zap', 'Plug']
const socialNames: (keyof SiteContent['social'])[] = [
  'github', 'linkedin', 'codeforces', 'leetcode', 'geeksforgeeks'
]

type ExperienceItem = SiteContent['experience']['items'][number]

export default function WebsiteEditor() {
  const [site, setSite] = useState<SiteContent>(initialSite as SiteContent)
  const [busy, setBusy] = useState(false)
  const [notice, setNotice] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true
    fetch('/api/admin/site', { cache: 'no-store' })
      .then(async response => {
        const result = await response.json()
        if (!response.ok) throw new Error(result.error || 'Could not load website content.')
        if (active) setSite(result.site as SiteContent)
      })
      .catch(cause => {
        if (active) setError(cause instanceof Error ? cause.message : 'Could not load website content.')
      })
    return () => { active = false }
  }, [])

  function updateExperience(index: number, update: Partial<ExperienceItem>) {
    setSite(current => ({
      ...current,
      experience: {
        ...current.experience,
        items: current.experience.items.map((item, i) => i === index ? { ...item, ...update } : item)
      }
    }))
  }

  async function uploadPhoto(file?: File) {
    if (!file) return
    setBusy(true)
    setError('')
    setNotice('')
    try {
      const form = new FormData()
      form.set('file', file)
      form.set('type', 'profile-image')
      const response = await fetch('/api/admin/upload', { method: 'POST', body: form })
      const result = await response.json()
      if (!response.ok) throw new Error(result.error || 'Could not upload the profile photo.')
      setSite(current => ({ ...current, profile: { ...current.profile, photo: result.path } }))
      setNotice('Photo uploaded. Save website content to publish it on your profile.')
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Could not upload the profile photo.')
    } finally {
      setBusy(false)
    }
  }

  async function saveWebsite() {
    setBusy(true)
    setError('')
    setNotice('')
    try {
      const response = await fetch('/api/admin/site', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(site)
      })
      const result = await response.json()
      if (!response.ok) throw new Error(result.error || 'Could not save website content.')
      setNotice('Website content saved to GitHub. Vercel will redeploy the portfolio.')
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Could not save website content.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold">Header and profile</h2>
        <p className="mt-1 text-sm text-muted-foreground">Update the site header, intro text, and profile photo.</p>
      </div>

      {error && <p role="alert" className="rounded-md border border-red-500/30 bg-red-500/5 p-3 text-sm text-red-500">{error}</p>}
      {notice && <p role="status" className="rounded-md border border-border bg-muted/40 p-3 text-sm text-muted-foreground">{notice}</p>}

      <div className="rounded-lg border border-border p-4 sm:p-5">
        <label className="block text-sm font-medium">Header logo text
          <input className={fieldClass} maxLength={12} value={site.header.brand} onChange={event => setSite(current => ({ ...current, header: { ...current.header, brand: event.target.value } }))} />
        </label>
        <h3 className="mt-5 text-sm font-semibold">Navigation links</h3>
        <div className="mt-3 space-y-3">
          {site.header.links.map((link, index) => (
            <div key={`${index}-${link.label}`} className="grid gap-2 sm:grid-cols-[1fr_1.5fr_auto_auto] sm:items-end">
              <label className="text-sm">Label
                <input className={fieldClass} value={link.label} onChange={event => setSite(current => ({ ...current, header: { ...current.header, links: current.header.links.map((item, i) => i === index ? { ...item, label: event.target.value } : item) } }))} />
              </label>
              <label className="text-sm">URL
                <input className={fieldClass} value={link.href} onChange={event => setSite(current => ({ ...current, header: { ...current.header, links: current.header.links.map((item, i) => i === index ? { ...item, href: event.target.value } : item) } }))} />
              </label>
              <label className="flex items-center gap-2 py-2 text-xs text-muted-foreground">
                <input type="checkbox" checked={Boolean(link.external)} onChange={event => setSite(current => ({ ...current, header: { ...current.header, links: current.header.links.map((item, i) => i === index ? { ...item, external: event.target.checked } : item) } }))} />
                New tab
              </label>
              <button type="button" aria-label={`Remove ${link.label} navigation link`} onClick={() => setSite(current => ({ ...current, header: { ...current.header, links: current.header.links.filter((_, i) => i !== index) } }))} className="rounded-md px-3 py-2 text-sm text-red-500 hover:bg-red-500/5">Remove</button>
            </div>
          ))}
        </div>
        <button type="button" onClick={() => setSite(current => ({ ...current, header: { ...current.header, links: [...current.header.links, { label: 'New link', href: '/' }] } }))} className="mt-4 text-sm text-muted-foreground underline underline-offset-4 hover:text-foreground">Add navigation link</button>
      </div>

      <div className="grid gap-4 rounded-lg border border-border p-4 sm:grid-cols-2 sm:p-5">
        <label className="text-sm font-medium">Intro heading
          <input className={fieldClass} value={site.profile.heading} onChange={event => setSite(current => ({ ...current, profile: { ...current.profile, heading: event.target.value } }))} />
        </label>
        <label className="text-sm font-medium">Photo alt text
          <input className={fieldClass} value={site.profile.photoAlt} onChange={event => setSite(current => ({ ...current, profile: { ...current.profile, photoAlt: event.target.value } }))} />
        </label>
        <label className="text-sm font-medium sm:col-span-2">Intro description
          <textarea rows={3} className={fieldClass} value={site.profile.description} onChange={event => setSite(current => ({ ...current, profile: { ...current.profile, description: event.target.value } }))} />
        </label>
        <label className="text-sm font-medium sm:col-span-2">Photo path
          <input className={fieldClass} value={site.profile.photo} onChange={event => setSite(current => ({ ...current, profile: { ...current.profile, photo: event.target.value } }))} />
        </label>
        <label className="text-sm font-medium sm:col-span-2">Upload profile photo (PNG, JPEG, or WebP; up to 4 MB)
          <input type="file" accept="image/png,image/jpeg,image/webp" className={`${fieldClass} file:mr-3 file:rounded-full file:border-0 file:bg-muted file:px-3 file:py-1`} onChange={event => uploadPhoto(event.target.files?.[0])} disabled={busy} />
        </label>
        <label className="text-sm font-medium">Primary button label
          <input className={fieldClass} value={site.profile.primaryActionLabel} onChange={event => setSite(current => ({ ...current, profile: { ...current.profile, primaryActionLabel: event.target.value } }))} />
        </label>
        <label className="text-sm font-medium">Primary button URL
          <input className={fieldClass} value={site.profile.primaryActionHref} onChange={event => setSite(current => ({ ...current, profile: { ...current.profile, primaryActionHref: event.target.value } }))} />
        </label>
        <label className="text-sm font-medium">Secondary button label
          <input className={fieldClass} value={site.profile.secondaryActionLabel} onChange={event => setSite(current => ({ ...current, profile: { ...current.profile, secondaryActionLabel: event.target.value } }))} />
        </label>
        <label className="text-sm font-medium">Secondary button URL
          <input className={fieldClass} value={site.profile.secondaryActionHref} onChange={event => setSite(current => ({ ...current, profile: { ...current.profile, secondaryActionHref: event.target.value } }))} />
        </label>
      </div>

      <div className="space-y-4 rounded-lg border border-border p-4 sm:p-5">
        <div>
          <h2 className="text-lg font-semibold">Experience</h2>
          <p className="mt-1 text-sm text-muted-foreground">Edit experience entries and bullet points.</p>
        </div>
        <label className="block text-sm font-medium">Section heading
          <input className={fieldClass} value={site.experience.title} onChange={event => setSite(current => ({ ...current, experience: { ...current.experience, title: event.target.value } }))} />
        </label>
        <label className="block text-sm font-medium">Section description
          <textarea rows={2} className={fieldClass} value={site.experience.description} onChange={event => setSite(current => ({ ...current, experience: { ...current.experience, description: event.target.value } }))} />
        </label>
        {site.experience.items.map((item, index) => (
          <div key={`${item.role}-${index}`} className="space-y-3 rounded-md border border-border p-3">
            <div className="grid gap-3 sm:grid-cols-3">
              <label className="text-sm">Role<input className={fieldClass} value={item.role} onChange={event => updateExperience(index, { role: event.target.value })} /></label>
              <label className="text-sm">Company<input className={fieldClass} value={item.company} onChange={event => updateExperience(index, { company: event.target.value })} /></label>
              <label className="text-sm">Duration<input className={fieldClass} value={item.duration} onChange={event => updateExperience(index, { duration: event.target.value })} /></label>
            </div>
            <label className="block text-sm">Experience points (one per line)
              <textarea rows={4} className={fieldClass} value={item.points.join('\n')} onChange={event => updateExperience(index, { points: event.target.value.split('\n').filter(point => point.trim()) })} />
            </label>
            <button type="button" onClick={() => setSite(current => ({ ...current, experience: { ...current.experience, items: current.experience.items.filter((_, i) => i !== index) } }))} className="text-sm text-red-500">Delete experience</button>
          </div>
        ))}
        <button type="button" onClick={() => setSite(current => ({ ...current, experience: { ...current.experience, items: [...current.experience.items, { role: 'New role', company: 'Company', duration: 'Duration', points: [] }] } }))} className="text-sm text-muted-foreground underline underline-offset-4 hover:text-foreground">Add experience</button>
      </div>

      <div className="space-y-4 rounded-lg border border-border p-4 sm:p-5">
        <div>
          <h2 className="text-lg font-semibold">Services</h2>
          <p className="mt-1 text-sm text-muted-foreground">Edit the service cards and their icons.</p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="block text-sm font-medium">Home section heading
            <input className={fieldClass} value={site.services.title} onChange={event => setSite(current => ({ ...current, services: { ...current.services, title: event.target.value } }))} />
          </label>
          <label className="block text-sm font-medium">Services page heading
            <input className={fieldClass} value={site.services.pageTitle} onChange={event => setSite(current => ({ ...current, services: { ...current.services, pageTitle: event.target.value } }))} />
          </label>
        </div>
        <label className="block text-sm font-medium">Section description
          <textarea rows={2} className={fieldClass} value={site.services.description} onChange={event => setSite(current => ({ ...current, services: { ...current.services, description: event.target.value } }))} />
        </label>
        {site.services.items.map((item, index) => (
          <div key={`${item.title}-${index}`} className="grid gap-3 rounded-md border border-border p-3 sm:grid-cols-[1fr_1fr_auto]">
            <label className="text-sm">Title<input className={fieldClass} value={item.title} onChange={event => setSite(current => ({ ...current, services: { ...current.services, items: current.services.items.map((service, i) => i === index ? { ...service, title: event.target.value } : service) } }))} /></label>
            <label className="text-sm">Icon
              <select className={fieldClass} value={item.icon} onChange={event => setSite(current => ({ ...current, services: { ...current.services, items: current.services.items.map((service, i) => i === index ? { ...service, icon: event.target.value as ServiceIconName } : service) } }))}>
                {iconNames.map(name => <option key={name} value={name}>{name}</option>)}
              </select>
            </label>
            <button type="button" onClick={() => setSite(current => ({ ...current, services: { ...current.services, items: current.services.items.filter((_, i) => i !== index) } }))} className="self-end rounded-md px-2 py-2 text-sm text-red-500">Remove</button>
            <label className="text-sm sm:col-span-3">Description<textarea rows={2} className={fieldClass} value={item.description} onChange={event => setSite(current => ({ ...current, services: { ...current.services, items: current.services.items.map((service, i) => i === index ? { ...service, description: event.target.value } : service) } }))} /></label>
          </div>
        ))}
        <button type="button" onClick={() => setSite(current => ({ ...current, services: { ...current.services, items: [...current.services.items, { title: '', description: '', icon: 'Code2' }] } }))} className="text-sm text-muted-foreground underline underline-offset-4 hover:text-foreground">Add service</button>
      </div>

      <div className="grid gap-4 rounded-lg border border-border p-4 sm:grid-cols-3 sm:p-5">
        <label className="text-sm font-medium">Skills heading
          <input className={fieldClass} value={site.home.skillsTitle} onChange={event => setSite(current => ({ ...current, home: { ...current.home, skillsTitle: event.target.value } }))} />
        </label>
        <label className="text-sm font-medium sm:col-span-2">Skills description
          <input className={fieldClass} value={site.home.skillsDescription} onChange={event => setSite(current => ({ ...current, home: { ...current.home, skillsDescription: event.target.value } }))} />
        </label>
        <label className="text-sm font-medium">Recent projects heading
          <input className={fieldClass} value={site.home.recentProjectsTitle} onChange={event => setSite(current => ({ ...current, home: { ...current.home, recentProjectsTitle: event.target.value } }))} />
        </label>
        <label className="text-sm font-medium">Recent posts heading
          <input className={fieldClass} value={site.home.recentPostsTitle} onChange={event => setSite(current => ({ ...current, home: { ...current.home, recentPostsTitle: event.target.value } }))} />
        </label>
        <label className="text-sm font-medium">Number of recent items
          <input type="number" min={1} max={12} className={fieldClass} value={site.home.recentCount} onChange={event => setSite(current => ({ ...current, home: { ...current.home, recentCount: Number(event.target.value) } }))} />
        </label>
      </div>

      <div className="space-y-4 rounded-lg border border-border p-4 sm:p-5">
        <h2 className="text-lg font-semibold">Contact and footer</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="text-sm font-medium">Homepage contact heading
            <input className={fieldClass} value={site.contact.homeHeading} onChange={event => setSite(current => ({ ...current, contact: { ...current.contact, homeHeading: event.target.value } }))} />
          </label>
          <label className="text-sm font-medium">Contact page heading
            <input className={fieldClass} value={site.contact.pageHeading} onChange={event => setSite(current => ({ ...current, contact: { ...current.contact, pageHeading: event.target.value } }))} />
          </label>
          <label className="text-sm font-medium sm:col-span-2">Homepage contact description
            <textarea rows={3} className={fieldClass} value={site.contact.homeDescription} onChange={event => setSite(current => ({ ...current, contact: { ...current.contact, homeDescription: event.target.value } }))} />
          </label>
          <label className="text-sm font-medium">Primary action label
            <input className={fieldClass} value={site.contact.actionLabel} onChange={event => setSite(current => ({ ...current, contact: { ...current.contact, actionLabel: event.target.value } }))} />
          </label>
          <label className="text-sm font-medium">Primary action URL
            <input className={fieldClass} value={site.contact.actionHref} onChange={event => setSite(current => ({ ...current, contact: { ...current.contact, actionHref: event.target.value } }))} />
          </label>
          <label className="text-sm font-medium">Public email
            <input type="email" className={fieldClass} value={site.contact.email} onChange={event => setSite(current => ({ ...current, contact: { ...current.contact, email: event.target.value } }))} />
          </label>
          <label className="text-sm font-medium">Availability text
            <input className={fieldClass} value={site.contact.availability} onChange={event => setSite(current => ({ ...current, contact: { ...current.contact, availability: event.target.value } }))} />
          </label>
        </div>
        <h3 className="pt-2 text-sm font-semibold">Social profile links</h3>
        <div className="grid gap-3 sm:grid-cols-2">
          {socialNames.map(network => (
            <label key={network} className="text-sm font-medium capitalize">{network === 'geeksforgeeks' ? 'GeeksforGeeks' : network}
              <input type="url" className={fieldClass} value={site.social[network]} onChange={event => setSite(current => ({ ...current, social: { ...current.social, [network]: event.target.value } }))} />
            </label>
          ))}
          <label className="text-sm font-medium">Footer copyright name
            <input className={fieldClass} value={site.footer.copyrightName} onChange={event => setSite(current => ({ ...current, footer: { ...current.footer, copyrightName: event.target.value } }))} />
          </label>
        </div>
      </div>

      <button type="button" onClick={saveWebsite} disabled={busy} className="rounded-full border border-border px-5 py-2 text-sm font-medium transition-colors hover:bg-muted disabled:opacity-50">
        {busy ? 'Saving…' : 'Save website content'}
      </button>
    </section>
  )
}
