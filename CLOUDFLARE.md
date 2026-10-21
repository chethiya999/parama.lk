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
  "name": "parama",
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

## Gallery admin (`/admin/`)

The site now ships with a Worker ([`worker/index.js`](worker/index.js)) that serves `public/` and adds a small gallery API backed by the R2 bucket `web`. Because of that it must be deployed with **`npx wrangler deploy`** (Workers), not `wrangler pages deploy` — Pages ignores `main` and the API would return 404 (the gallery then falls back to `gallery/gallery-data.js`).

| Setting | Value |
|---------|-------|
| **Build command** | `node scripts/workers-ci-build.mjs` |
| **Deploy command** | `npx wrangler deploy` |

One-time setup:

```bash
npx wrangler secret put ADMIN_USERNAME   # login username for /admin/
npx wrangler secret put ADMIN_PASSWORD   # login password for /admin/
```

- Gallery list is stored in R2 at `gallery/gallery.json`; uploads go to `gallery/uploads/`.
- On the first admin sign-in the existing `gallery-data.js` items are imported automatically.
- Deleting an image removes it from the list and deletes its file from R2.
- Local dev: put `ADMIN_USERNAME=...` and `ADMIN_PASSWORD=...` in `.dev.vars` (git-ignored) and run `bun run preview`.
