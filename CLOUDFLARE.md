# Cloudflare deployment (parama.lk)

Static HTML/CSS/JS is built into `public/` and deployed to **Cloudflare Pages**. Images and logos are loaded from **Cloudflare R2** (`pub-df1f9faee3d94aabbd406007fa5bfcca.r2.dev`) — there is no local `images/` directory and none is required for deploy.

## Cloudflare Pages (dashboard)

In **Workers & Pages → parama → Settings → Builds**:

| Setting | Value |
|---------|-------|
| **Build command** | `bun install && node scripts/workers-ci-build.mjs` |
| **Build output directory** | `public` |
| **Deploy command** | `npx wrangler pages deploy public` |

Do **not** use `npx wrangler deploy` — that targets a Worker and fails with *"Missing entry-point to Worker script or to assets directory"* when no `main` or `assets.directory` is configured.

### Why not `wrangler deploy`?

| Command | Use for |
|---------|---------|
| `npx wrangler deploy` | Workers (needs `main` or `assets.directory`) |
| `npx wrangler pages deploy public` | Static Pages site in `public/` |

## `wrangler.jsonc`

Pages-only config — no `main`, no `assets`, no Worker script:

```jsonc
{
  "pages_build_output_dir": "public"
}
```

## Routing

Multi-page static HTML (links use `*.html` paths). No `_redirects` file.

## Local commands

```bash
bun install
bun run build              # or: node scripts/workers-ci-build.mjs
bun run deploy             # build + npx wrangler pages deploy public --project-name=parama
npx wrangler pages deploy public --project-name=parama
bun run preview            # npx wrangler pages dev public
```
