# Pankaj Yadav — Portfolio

Personal portfolio and blog built with Next.js, React, TypeScript, Tailwind CSS, and MDX.

- **Live site:** [pankajyadavme.vercel.app](https://pankajyadavme.vercel.app)
- **Admin panel:** `/admin` (requires the environment variables below)

## Features

- Project, post, skills, services, and experience pages
- MDX project writeups and technical posts
- Contact form with email delivery through Resend
- Password-protected admin panel for managing projects, skills, and the resume
- GitHub-backed admin updates that trigger Vercel deployments

## Getting started

Requirements: Node.js 20 or newer and npm.

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Run the production build locally with:

```bash
npm run build
npm start
```

## Environment configuration

Copy `.env.example` to `.env.local` and set the values required for the features you use. Keep secrets out of Git and never use a `NEXT_PUBLIC_` prefix for them.

| Variable | Purpose |
| --- | --- |
| `ADMIN_PASSWORD` | Password used to sign in at `/admin`. Choose a strong, unique value. |
| `ADMIN_SESSION_SECRET` | Random secret used to sign admin sessions; must be at least 32 characters. |
| `GITHUB_TOKEN` | Fine-grained token scoped to this repository with Contents read and write access. |
| `GITHUB_OWNER` | GitHub account or organization that owns the repository. |
| `GITHUB_REPO` | Repository used by the admin panel; currently `portfolio`. |
| `GITHUB_BRANCH` | Branch where admin changes are committed; currently `main`. |
| `RESEND_API_KEY` | Optional API key for contact form email delivery. |

Generate a session secret locally:

```bash
openssl rand -base64 48
```

For detailed token setup, local admin configuration, and content-management notes, see [ADMIN_SETUP.md](./ADMIN_SETUP.md).

## Managing content

Portfolio content is stored in `content/` and static assets are stored in `public/`. You can edit these files directly or use the admin panel after configuring its GitHub credentials.

- **Projects:** create, edit, and delete project entries. Project writeups live in `content/projects/` as MDX.
- **Skills:** edit categories and skill names stored in `content/skills.json`.
- **Resume:** upload a replacement PDF or delete the current resume from the admin panel.
- **Project images:** upload PNG, JPEG, or WebP images from the project editor.

Each admin change is committed to the configured GitHub branch. When that repository is connected to Vercel, the commit starts a deployment.

## Project structure

```text
app/                  Next.js routes, API handlers, and global styles
components/admin/     Admin interface
components/contact/   Contact form and contact section
components/content/   Project, post, and MDX components
components/home/      Homepage sections
components/layout/    Header, footer, and theme providers
content/posts/        Technical posts in MDX
content/projects/     Project writeups in MDX
content/skills.json   Skills content
emails/               Contact form email template
lib/admin/            Admin authentication and GitHub API helpers
lib/contact/          Contact validation, actions, and rate limiting
lib/content/          Post and project data loading
public/               Images, icons, and resume PDF
```

## Checks

```bash
npm run lint
npm run build
```
