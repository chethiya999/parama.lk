# Cloudflare deployment (parama.lk)

Static HTML/CSS/JS is built into `public/` and deployed to **Cloudflare Pages**. Large media (logos, product photos) are served from **R2** (`pub-df1f9faee3d94aabbd406007fa5bfcca.r2.dev`) and are not copied into `public/`.

## Cloudflare Pages (dashboard)

**Required:** In **Workers & Pages → parama → Settings → Builds**, change the deploy command from `npx wrangler deploy` to **`npx wrangler pages deploy public`**. Using `wrangler deploy` targets a Worker, validates `_redirects` in `public/`, and fails with “Infinite loop detected”.

| Setting | Value |
|---------|-------|
| Build command | `bun run build` |
| Build output directory | `public` |
| Deploy command | `npx wrangler pages deploy public` |

Or a single deploy step: `bun run deploy` (build + Pages deploy)

If the build command is left empty, `postinstall` still runs `public/` generation on Cloudflare CI (`WORKERS_CI` / `CI` / `CF_PAGES`).

## Routing

This site is multi-page static HTML (links use `*.html` paths). There is **no** `_redirects` file — pretty-URL rewrites caused infinite loops with Cloudflare asset routing.

## Local commands

```bash
bun install
bun run build          # creates public/
bun run deploy         # build + wrangler pages deploy public --project-name=parama
bun run pages:deploy   # same as deploy
bun run preview        # wrangler pages dev public
```
