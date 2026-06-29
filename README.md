# aziface-web

Monorepo for the **Aziface Web SDK** (`@azify/aziface-web`) and reference demo applications.

## Packages & apps

| Path | Description |
| --- | --- |
| [`packages/aziface`](./packages/aziface) | Publishable SDK — biometric flows for React (enroll, authenticate, liveness, document scan) |
| [`apps/nextapp`](./apps/nextapp) | Next.js demo app |
| [`apps/viteapp`](./apps/viteapp) | Vite + React demo app |

**SDK documentation (installation, API, types):** [packages/aziface/README.md](./packages/aziface/README.md)

## Requirements

- **Node.js** 22+
- **npm** 10+
- FaceTec static assets served from your app (see [Static assets](./packages/aziface/README.md#static-assets) in the SDK docs)

## Getting started

```bash
git clone https://github.com/azifydev/aziface-web.git
cd aziface-web
npm ci
```

### Development

| Command | Description |
| --- | --- |
| `npm run dev` | Start all workspaces that expose a `dev` script |
| `npm run next:dev` | Next.js demo at `http://localhost:3000` |
| `npm run vite:dev` | Vite demo at `http://localhost:5173` |
| `npm run build` | Build all workspaces |
| `npm run next:build` | Build Next.js demo only |
| `npm run vite:build` | Build Vite demo only |
| `npm run clean` | Remove build artifacts |

### SDK package only

```bash
npm run build -w @azify/aziface-web
npm run dev -w @azify/aziface-web   # watch mode (tsup)
```

When developing the SDK alongside a demo app, link the local package or bump the workspace dependency in the app `package.json`.

## Repository structure

```
aziface-web/
├── packages/aziface/     # @azify/aziface-web (npm package)
├── apps/nextapp/         # Next.js reference implementation
├── apps/viteapp/         # Vite reference implementation
├── .github/workflows/    # CI and release pipelines
└── .releaserc.js         # semantic-release configuration
```

## Contributing

### Pull requests

1. Branch from `main`
2. Follow [Conventional Commits](https://www.conventionalcommits.org/) — PR titles are validated in CI
3. Fill in [`.github/PULL_REQUEST_TEMPLATE.md`](./.github/PULL_REQUEST_TEMPLATE.md)
4. Test changes in **NextApp**, **ViteApp**, and/or the **SDK package** as applicable

**Commit → release mapping** (configured in `.releaserc.js`):

| Commit type | Version bump |
| --- | --- |
| `feat`, `chore` | minor |
| `fix`, `perf`, `style` | patch |
| `BREAKING CHANGE` in body | major (default analyzer behavior) |

### CI

On every pull request to `main`:

- Semantic PR title check
- `npm ci` + `npm run build` across workspaces

## Release

Releases are automated with [semantic-release](https://semantic-release.gitbook.io/) when commits are pushed to `main`.

**Flow:**

1. Build `@azify/aziface-web`
2. Analyze commits since the last git tag
3. Publish to [npm](https://www.npmjs.com/package/@azify/aziface-web)
4. Create GitHub release and tag (`vX.Y.Z`)
5. Commit `package.json` + `CHANGELOG.md` with `[skip ci]`

**Manual release (maintainers):**

```bash
npm run release
```

Requires `GH_TOKEN` and `NPM_TOKEN` with publish access to the `@azify` scope.

### GitHub Actions secrets

| Secret | Purpose |
| --- | --- |
| `GH_TOKEN_V2` | Push release commits, create GitHub releases |
| `NPM_TOKEN_V2` | Publish `@azify/aziface-web` to npm (Automation token with **Read and Write** on `@azify`) |
| `AZIFACE_ASSETS_URL` | FaceTec assets (CI/internal use) |

## License

MIT — see [LICENSE](./LICENSE) if present, or package metadata.
