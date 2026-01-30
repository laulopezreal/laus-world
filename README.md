# Laura's World

A read-only Obsidian vault reader styled to match the Laura portfolio vibe.

## Quick start

```bash
npm install
npm run build:index
npm run dev
```

## Add your vault

1. Replace the contents of `vault/` with your Obsidian markdown files (nested folders are supported).
2. Run `npm run build:index` to generate the note index JSON.

> The indexer reads frontmatter fields: `title`, `tags`, `created`, `updated`, `cover`.

## Build & preview

```bash
npm run build
npm run preview
```

## Deployment

### Vercel / Netlify / Cloudflare Pages

- Build command: `npm run build`
- Output directory: `dist`

## Screenshots (Playwright)

```bash
PORTFOLIO_URL=https://lauureal.one LAURAS_WORLD_URL=http://localhost:5173 npm run screenshots
```

Screenshots are saved to `docs/screenshots`.

## Notes

- Markdown rendering is sanitized by default.
- Slugs are stable and based on the file path.
- If the portfolio repo source becomes available, replace the theme tokens in `src/styles/tokens.css` and update `docs/vibe-report.md` accordingly.
- `npm install` requires access to the npm registry; configure an internal proxy or mirror if outbound installs are restricted.
