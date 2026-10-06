# Rajat Srivastav Portfolio

A Next.js App Router portfolio retaining the interactive portfolio sections, blog, and Dispatches CMS.

## Local development

Use Node.js 20.9 or newer. Set `ADMIN_PASSKEY` to a long random secret and `SITE_URL` to the site's origin. For local development, copy `.env.example` to `.env`, use `SITE_URL=http://localhost:3000`.

- `npm run dev` starts Next.js.
- `npm run lint` runs ESLint.
- `npm run typecheck` checks TypeScript.
- `npm run build` creates the production build.
- `npm start` serves the production build.

The CMS is at `/admin`. Sessions use a signed, HttpOnly, SameSite=Strict cookie with a seven-day lifetime. CRUD routes live under `/api/posts`; public responses contain published posts only. Local and standalone Node runs use the JSON file in `data/posts.json` by default. Set `POSTS_FILE` to a persistent path when the host has a durable filesystem.

## Vercel CMS storage

Vercel's function filesystem is ephemeral. For durable CMS data, configure an Upstash Redis database and set `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` as server-only environment variables. The adapter stores the post collection under `portfolio:posts`; set `POSTS_REDIS_KEY` to customize it. A Vercel deployment without Redis remains buildable, but CMS reads are empty and writes return a setup error instead of silently storing data that may disappear.

The app serves dynamic `/robots.txt`, `/sitemap.xml`, and `/rss.xml` routes. Markdown content is rendered as escaped text.
