# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

## Blog publishing and production hosting

This Vite application includes a Node 22 backend. Copy `.env.example` to `.env` and set a long, unique `ADMIN_PASSKEY`. Never prefix this secret with `VITE_`; it must stay on the server. Configure `SITE_URL` to match the public HTTPS origin.

Run `npm run build` and then `npm start`. Put the Node service behind an HTTPS reverse proxy. For development, `npm run dev` starts both the API server (loading `.env`) and Vite. Restart it after changing the passkey; Vite proxies API and discovery routes. A static-only host cannot run publishing, RSS, or the dynamic sitemap.

Set `POSTS_FILE` to a path on persistent storage and back it up. The JSON store supports one server process, with serialized atomic writes; use a database before scaling to multiple instances. Visit `/admin`, unlock with the passkey, and save a draft or published post. Public feeds only expose published posts. Login issues a signed, HttpOnly, SameSite=Strict cookie valid for seven days. Set NODE_ENV=production behind HTTPS to enable Secure cookies. Changing ADMIN_PASSKEY invalidates existing sessions; logout clears the browser cookie. The dashboard supports create, edit, status changes, and permanent deletion. Markdown supports headings, paragraphs, unordered lists, blockquotes, and fenced code with lightweight syntax coloring. HTML is rendered as escaped text.

`/robots.txt`, `/sitemap.xml`, and `/rss.xml` are served dynamically. Existing sample essays in `src/data/dispatches.js` are no longer the public feed. The new store starts empty so the homepage displays Coming Soon until a post is published.
