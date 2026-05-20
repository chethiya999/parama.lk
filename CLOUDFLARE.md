# Cloudflare deployment (parama.lk)

Static HTML/CSS/JS is built into `public/` and deployed to **Cloudflare Pages**. Images and logos are loaded from **Cloudflare R2** (`pub-df1f9faee3d94aabbd406007fa5bfcca.r2.dev`) — there is no local `images/` directory and none is required for deploy.

## Cloudflare Pages (dashboard)

**Action required:** If deploy logs show `npx wrangler deploy` or *Missing entry-point*, update the settings below in the dashboard (repo changes alone do not change dashboard commands).

In **Workers & Pages → parama → Settings → Builds**:

| Setting | Value |
|---------|-------|
| **Build command** | `node scripts/workers-ci-build.mjs` |
| **Build output directory** | `public` |
| **Deploy command** | `npx wrangler pages deploy public --project-name=parama` |

(`bun install` runs automatically before the build command in CI.)

**Alternative (single deploy step):** leave **Build command** empty and set **Deploy command** to `bun run cf:ci` (build + deploy via [`package.json`](package.json)).

Do **not** use `npx wrangler deploy` — that targets a Worker and fails with *"Missing entry-point to Worker script or to assets directory"* when no `main` or `assets.directory` is configured.

### Why not `wrangler deploy`?

| Command | Use for |
|---------|---------|
| `npx wrangler deploy` | Workers (needs `main` or `assets.directory`) |
| `npx wrangler pages deploy public --project-name=parama` | Static Pages site in `public/` |

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
bun run deploy             # build + pages deploy
bun run cf:ci              # same as Cloudflare CI (build + pages deploy)
npx wrangler pages deploy public --project-name=parama
bun run preview            # npx wrangler pages dev public
```
