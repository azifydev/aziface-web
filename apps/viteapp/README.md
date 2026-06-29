# ViteApp

Vite + React reference application for [`@azify/aziface-web`](../../packages/aziface).

Use this app to validate SDK changes in a Vite environment before publishing.

## Requirements

- Node.js 22+
- FaceTec assets under `public/core/` (see [SDK static assets](../../packages/aziface/README.md#static-assets))
## Environment variables

| Variable | App | Description |
| --- | --- | --- |
| `VITE_PUBLIC_API_URL_AZTECH` | ViteApp | Aziface API base URL |
| `VITE_PUBLIC_API_CLIENT_API` | ViteApp | Client API base URL |
| `VITE_PUBLIC_X_API_KEY` | ViteApp | API key header |

Create a `.env` file in this directory with the values above (ask the team for staging credentials).

## Scripts

From the **repository root**:

```bash
npm run vite:dev      # http://localhost:5173
npm run vite:build    # production build
```

From this directory:

```bash
npm run dev
npm run build
npm run preview
npm run lint
```

## Project layout

| Path | Description |
| --- | --- |
| `src/screens/` | App screens (`login`, `home`) |
| `src/services/` | API client and biometric config |
| `public/core/facetec/` | FaceTec SDK script and resources |
| `public/core/images/` | Theme images for `withTheme` |

## SDK integration

The FaceTec script is loaded in `index.html`:

```html
<script src="/core/facetec/FaceTecSDK.js"></script>
```

Biometric flows are implemented in `src/screens/home.tsx` using `@azify/aziface-web`.

## Documentation

- [SDK API & types](../../packages/aziface/README.md)
- [Monorepo guide](../../README.md)
