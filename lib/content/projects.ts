import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

const rootDirectory = path.join(process.cwd(), 'content', 'projects')

export type Project = {
  metadata: ProjectMetadata
  content: string
}

export type ProjectMetadata = {
  title?: string
  summary?: string
  image?: string
  author?: string
  publishedAt?: string
  slug: string
}

export function getProjectBySlug(slug: string): Project | null {
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/i.test(slug)) return null

  try {
    const filePath = path.join(rootDirectory, `${slug}.mdx`)

    const fileContent = fs.readFileSync(filePath, {
      encoding: 'utf8'
    })

    const { data, content } = matter(fileContent)

    return {
      metadata: {
        ...data,
        slug
      },
      content
    }
  } catch {
    return null
  }
}

export function getProjects(limit?: number): ProjectMetadata[] {
  const files = fs.readdirSync(rootDirectory)

  const projects = files
    .filter(file => file.endsWith('.mdx'))
    .map(file => getProjectMetadata(file))
    .sort((a, b) => {
      const dateA = Date.parse(a.publishedAt ?? '')
      const dateB = Date.parse(b.publishedAt ?? '')

      if (Number.isNaN(dateA) && Number.isNaN(dateB)) {
        return a.slug.localeCompare(b.slug)
      }
      if (Number.isNaN(dateA)) return 1
      if (Number.isNaN(dateB)) return -1

      return dateB - dateA || a.slug.localeCompare(b.slug)
    })

  if (limit) {
    return projects.slice(0, limit)
  }

  return projects
}

export function getProjectMetadata(filepath: string): ProjectMetadata {
  const slug = filepath.replace(/\.mdx$/, '')

  const filePath = path.join(rootDirectory, filepath)

  const fileContent = fs.readFileSync(filePath, {
    encoding: 'utf8'
  })

  const { data } = matter(fileContent)

  return {
    ...data,
    slug
  }
}
