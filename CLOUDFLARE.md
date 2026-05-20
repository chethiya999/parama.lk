# Cloudflare Pages deployment

## Dashboard settings (Workers & Pages → parama → Settings → Builds)

| Setting | Value |
|---------|-------|
| Build command | `bun run build` |
| Build output directory | `public` |
| Deploy command | `npx wrangler pages deploy` |
| Root directory | `/` |

Do **not** use `npx wrangler deploy` or a typo deploy command.

If only a single deploy field is available:

```
bun run build && npx wrangler pages deploy
```

Ensure the **V2 build system** is enabled.

## Local commands

```bash
bun install
bun run build      # creates public/
bun run deploy     # build + wrangler pages deploy (requires Cloudflare auth)
bun run preview    # wrangler pages dev public
```
