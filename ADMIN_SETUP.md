# Admin panel setup

The admin panel is available at `/admin`. It uses GitHub as the content store:
website settings, post and project MDX, skills JSON, resume PDFs, and uploaded
images are committed to the configured repository. When the repository is connected to
Vercel for deployments, those commits trigger a site redeploy. This setup does
not require a separate database.

## Environment variables

Set these in local `.env.local` and in the Vercel project's environment
variables:

```env
ADMIN_PASSWORD=choose-a-long-unique-password
ADMIN_SESSION_SECRET=generate-a-random-secret-at-least-32-characters-long
GITHUB_TOKEN=github_pat_your_fine_grained_token
GITHUB_OWNER=Pankajkantghz
GITHUB_REPO=portfolio
GITHUB_BRANCH=main
```

Generate a session secret with:

```bash
openssl rand -base64 48
```

Create a fine-grained GitHub token scoped to this repository with **Contents:
Read and write** permission. Keep all values private. Never put the GitHub token
in a `NEXT_PUBLIC_` variable or commit it to the repository.

After setting the Vercel variables, redeploy the project. Visit `/admin` and
sign in with `ADMIN_PASSWORD`.

## Managing content

- **Website:** edit the header and navigation, profile copy and photo, experience, services, contact details, social links, and recent-section headings/count.
- **Posts:** create, edit, or delete MDX entries in `content/posts/`; posts are ordered by published date.
- **Projects:** create, edit, or delete project MDX files in `content/projects/`.
- **Skills:** edit the six category lists stored in `content/skills.json`.
- **Resume:** upload a PDF to replace or delete `public/resume.pdf`.
- **Images:** upload PNG, JPEG, or WebP images up to 4 MB for your profile, posts, or projects.

The admin session is stored in an HTTP-only, same-site cookie. Each content
change is committed to the configured GitHub branch; Vercel publishes it after
the deployment finishes.
