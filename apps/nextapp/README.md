# NextApp

Next.js reference application for [`@azify/aziface-web`](../../packages/aziface).

Use this app to validate SDK changes in a Next.js environment before publishing.

## Requirements

- Node.js 22+
- FaceTec assets under `public/core/` (see [SDK static assets](../../packages/aziface/README.md#static-assets))
## Environment variables

| Variable | App | Description |
| --- | --- | --- |
| `NEXT_PUBLIC_API_URL_AZTECH` | NextApp | Aziface API base URL |
| `NEXT_PUBLIC_API_CLIENT_API` | NextApp | Client API base URL |
| `NEXT_PUBLIC_X_API_KEY` | NextApp | API key header |

Create a `.env.local` file in this directory with the values above (ask the team for staging credentials).

## Scripts

From the **repository root**:

```bash
npm run next:dev      # http://localhost:3000
npm run next:build    # production build
```

From this directory:

```bash
npm run dev
npm run build
npm run lint
```

## Project layout

| Path | Description |
| --- | --- |
| `app/` | Next.js App Router pages (`login`, `home`) |
| `public/core/facetec/` | FaceTec SDK script and resources |
| `public/core/images/` | Theme images for `withTheme` |
| `services/` | API client and biometric config hooks |
| `stores/` | Zustand state |

## SDK integration

The FaceTec script is loaded in `app/page.tsx`:

```tsx
<Script src="/core/facetec/FaceTecSDK.js" strategy="beforeInteractive" />
```

Biometric flows are implemented in `app/home.tsx` using `@azify/aziface-web`.

## Documentation

- [SDK API & types](../../packages/aziface/README.md)
- [Monorepo guide](../../README.md)
