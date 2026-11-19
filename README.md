# Portfolio

A personal portfolio built with Next.js App Router, React, TypeScript, Tailwind CSS, and MDX content.

## Requirements

- Node.js 20 or newer
- npm

## Development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Production

```bash
npm run build
npm start
```

## Contact form configuration

Set `RESEND_API_KEY` in the deployment environment to enable email delivery from the contact form. Keep credentials in environment configuration and out of source control.

## Project layout

- `app/` — routes, layouts, and global styles
- `components/layout/` — site header, footer, and providers
- `components/home/` — homepage sections
- `components/contact/` — contact UI
- `components/content/` — post, project, search, and MDX UI
- `components/ui/` — shared UI primitives
- `content/` — MDX posts and project writeups
- `emails/` — transactional email templates
- `lib/content/` — MDX loading and metadata
- `lib/contact/` — schemas, server actions, and throttling
- `lib/utils.ts` — shared utilities
- `public/` — static images, icons, and resume
