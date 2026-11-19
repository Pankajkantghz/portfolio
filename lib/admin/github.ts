type GitHubFile = {
  name: string
  path: string
  type: string
  sha?: string
  content?: string
}

function repositoryConfig() {
  const { GITHUB_TOKEN, GITHUB_OWNER, GITHUB_REPO } = process.env
  if (!GITHUB_TOKEN || !GITHUB_OWNER || !GITHUB_REPO) {
    throw new Error('GitHub repository settings are not configured.')
  }

  return {
    token: GITHUB_TOKEN,
    owner: GITHUB_OWNER,
    repo: GITHUB_REPO,
    branch: process.env.GITHUB_BRANCH || 'main'
  }
}

function contentsUrl(path: string) {
  const { owner, repo } = repositoryConfig()
  const encodedPath = path.split('/').map(encodeURIComponent).join('/')
  return `https://api.github.com/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/contents/${encodedPath}`
}

async function githubFetch(url: string, init: RequestInit = {}) {
  const { token } = repositoryConfig()
  return fetch(url, {
    ...init,
    cache: 'no-store',
    headers: {
      Accept: 'application/vnd.github+json',
      Authorization: `Bearer ${token}`,
      'X-GitHub-Api-Version': '2022-11-28',
      ...init.headers
    }
  })
}

export async function readRepositoryFile(path: string): Promise<GitHubFile | null> {
  const { branch } = repositoryConfig()
  const response = await githubFetch(`${contentsUrl(path)}?ref=${encodeURIComponent(branch)}`)

  if (response.status === 404) return null
  if (!response.ok) {
    throw new Error(`GitHub could not read ${path} (${response.status}).`)
  }

  return (await response.json()) as GitHubFile
}

export async function readRepositoryText(path: string): Promise<string | null> {
  const file = await readRepositoryFile(path)
  if (!file?.content) return null
  return Buffer.from(file.content.replace(/\s/g, ''), 'base64').toString('utf8')
}

export async function readRepositoryDirectory(path: string): Promise<GitHubFile[]> {
  const { branch } = repositoryConfig()
  const response = await githubFetch(`${contentsUrl(path)}?ref=${encodeURIComponent(branch)}`)

  if (response.status === 404) return []
  if (!response.ok) {
    throw new Error(`GitHub could not list ${path} (${response.status}).`)
  }

  const files = (await response.json()) as GitHubFile[]
  return Array.isArray(files) ? files : []
}

export async function writeRepositoryFile(
  path: string,
  contentBase64: string,
  message: string
) {
  const { branch, owner, repo } = repositoryConfig()
  const existing = await readRepositoryFile(path)
  const response = await githubFetch(contentsUrl(path), {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      message,
      content: contentBase64,
      branch,
      ...(existing?.sha ? { sha: existing.sha } : {})
    })
  })

  if (!response.ok) {
    const body = (await response.json().catch(() => ({}))) as { message?: string }
    throw new Error(body.message || `GitHub could not save ${path} (${response.status}).`)
  }

  return { owner, repo, branch }
}

export async function deleteRepositoryFile(path: string, message: string) {
  const { branch } = repositoryConfig()
  const existing = await readRepositoryFile(path)
  if (!existing?.sha) throw new Error(`The file ${path} does not exist.`)

  const response = await githubFetch(contentsUrl(path), {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message, sha: existing.sha, branch })
  })

  if (!response.ok) {
    const body = (await response.json().catch(() => ({}))) as { message?: string }
    throw new Error(body.message || `GitHub could not delete ${path} (${response.status}).`)
  }
}
