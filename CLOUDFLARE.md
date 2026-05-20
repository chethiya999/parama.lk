# Cloudflare deployment (parama.lk)

Static HTML/CSS/JS is built into `public/` and deployed to Cloudflare. Large media (logos, product photos) are served from **R2** (`pub-df1f9faee3d94aabbd406007fa5bfcca.r2.dev`) and are not copied into `public/`.

## Workers Builds (current CI — fix for `wrangler deploy` error)

In **Workers & Pages → parama → Settings → Builds**:

| Setting | Value |
|---------|-------|
| Build command | `bun run build` |
| Deploy command | `npx wrangler deploy` |
| Root directory | `/` |

Do **not** use `npx wrangler pages deploy` on Workers Builds unless this project is switched to Pages-only hosting.

`wrangler.jsonc` sets `assets.directory` to `./public` so `wrangler deploy` uploads the built site. If the build command is left empty, `postinstall` still runs `public/` generation on Cloudflare CI (`WORKERS_CI` / `CI`).

## Cloudflare Pages (optional)

If you use **Pages** instead of Workers Builds:

| Setting | Value |
|---------|-------|
| Build command | `bun run build` |
| Build output directory | `public` |
| Deploy command | `npx wrangler pages deploy` |

Or a single command: `bun run build && npx wrangler pages deploy`

## Local commands

```bash
bun install
bun run build       # creates public/
bun run deploy      # build + wrangler deploy (Workers)
bun run pages:deploy  # build + wrangler pages deploy (Pages)
bun run preview     # wrangler pages dev public
```
