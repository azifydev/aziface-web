# @azify/aziface-web

[![npm version](https://img.shields.io/npm/v/@azify/aziface-web.svg)](https://www.npmjs.com/package/@azify/aziface-web)

Web SDK adapter for React — face enrollment, authentication, liveness, and document verification powered by FaceTec.

## Summary

- [Requirements](#requirements)
- [Installation](#installation)
- [Static assets](#static-assets)
- [Setup](#setup)
  - [Next.js](#nextjs)
  - [Vite](#vite)
- [Usage](#usage)
- [API](#api)
  - [`initialize`](#initialize)
    - [`Properties`](#properties)
  - [`dispose`](#dispose)
    - [`Properties`](#properties-1)
  - [`withTheme`](#withtheme)
    - [`Properties`](#properties-2)
    - [`Custom images`](#custom-images)
      - [`Example`](#example)
  - [`resetTheme`](#resettheme)
  - [`setLocale`](#setlocale)
    - [`Properties`](#properties-3)
- [Hooks](#hooks)
  - [`useAziface`](#useaziface)
    - [`Properties`](#properties-4)
      - [`enroll`](#enroll)
      - [`authenticate`](#authenticate)
      - [`liveness`](#liveness)
      - [`photoScan`](#photoscan)
      - [`photoMatch`](#photomatch)
- [Styles](#styles)
- [Responsiveness](#responsiveness)
- [Types](#types)
  - [`Initialize`](#initialize-1)
    - [`InitializeParams`](#initializeparams)
    - [`InitializeHeaders`](#initializeheaders)
  - [`InitializeCallback`](#initializecallback)
    - [`InitializeResponse`](#initializeresponse)
      - [`InitializeError`](#initializeerror)
        - [`InitializeCodeError`](#initializecodeerror)
  - [`DisposeCallback`](#disposecallback)
  - [`SessionCode`](#sessioncode)
  - [`Style`](#style)
    - [`CancelLocation`](#cancellocation)
  - [`Locale`](#locale)
- [Classes](#classes)
  - [`SessionError`](#sessionerror)
    - [`constructor`](#constructor)

<hr/>

## Requirements

- **React** 18 or 19
- **HTTPS** or **localhost** — camera APIs are blocked on remote HTTP ([`GetUserMediaRemoteHTTPNotSupported`](#initializecodeerror))
- **FaceTec static assets** hosted by your application (not bundled in the npm package)
- Valid Aziface credentials: `deviceKeyIdentifier`, `baseUrl`, and `x-token-bearer`

<hr/>

## Installation

```bash
npm i @azify/aziface-web
```

<hr/>

## Static assets

The SDK expects FaceTec resources to be available at runtime. Host the following paths in your app's public directory:

| Path                          | Purpose                                                           |
| ----------------------------- | ----------------------------------------------------------------- |
| `/core/facetec/FaceTecSDK.js` | FaceTec browser SDK (loaded via `<script>`)                       |
| `/core/facetec/resources/`    | FaceTec resource bundle                                           |
| `/core/images/`               | Branding and cancel button images (optional; used by `withTheme`) |

Reference implementations live in this monorepo:

- [Next.js demo](../../apps/nextapp)
- [Vite demo](../../apps/viteapp)

> Obtain FaceTec asset files from your Azify integration contact. They are not included in the npm package.

<hr/>

## Setup

Add the configuration below according to the environment you are using:

### Next.js

In your `app/page.tsx`, add the following script:

```tsx
'use client';

import Script from 'next/script';
// ...

export default function Page() {
  // ...

  return (
    <>
      <Script
        src={`/core/facetec/FaceTecSDK.js`}
        strategy='beforeInteractive'
      />

      {/* ... */}
    </>
  );
}
```

Your Next.js environment is now configured!

### Vite

In your `index.html`, add the following script:

```html
<!doctype html>
<html lang="en">
  <!-- ... -->
  <body>
    <div id="root"></div>
    <!-- Add this line -->
    <script src="/core/facetec/FaceTecSDK.js"></script>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

Your Vite environment is now configured!

<hr/>

## Lifecycle

Typical integration flow:

1. Load `FaceTecSDK.js` in the page (see [Setup](#setup))
2. Import SDK methods and styles (`@azify/aziface-web/dist/aziface.css`)
3. Call `initialize()` once with credentials and headers
4. Optionally call `setLocale()` and `withTheme()` after a successful init
5. Use `useAziface()` to access session methods: `enroll`, `authenticate`, `liveness`, `photoScan`, and `photoMatch`
6. Call `dispose()` when the SDK is no longer needed

Session methods resolve as soon as the session **starts**. They reject with [`SessionError`](#sessionerror) only when the session can't start (e.g. `NotInitialized`, `NoUserEnrolled`), so wrap them in `try/catch`. The session **result** (success or failure) is delivered through the reactive `data` and `error` values returned by [`useAziface`](#useaziface).

<hr/>

## Usage

```tsx
import { useEffect, useState } from 'react';
import {
  dispose,
  initialize,
  setLocale,
  useAziface,
  SessionError,
  type InitializeHeaders,
  type InitializeParams,
} from '@azify/aziface-web';
import '@azify/aziface-web/dist/aziface.css';

type FaceScanType =
  | 'enroll'
  | 'authenticate'
  | 'liveness'
  | 'photoMatch'
  | 'photoScan';

const FACE_SCANS: { type: FaceScanType; label: string }[] = [
  { type: 'enroll', label: 'Enroll' },
  { type: 'liveness', label: 'Liveness' },
  { type: 'authenticate', label: 'Authenticate' },
  { type: 'photoMatch', label: 'Photo Match' },
  { type: 'photoScan', label: 'Photo Scan' },
];

export function MyPage() {
  const [isInitialized, setIsInitialized] = useState(false);
  const { data, error, authenticate, enroll, liveness, photoMatch, photoScan } =
    useAziface();

  const sessions: Record<FaceScanType, () => Promise<boolean>> = {
    enroll,
    authenticate,
    liveness,
    photoMatch,
    photoScan,
  };

  const onInitialize = (): void => {
    const params: InitializeParams = {
      baseUrl: 'YOUR_BASE_URL',
      deviceKeyIdentifier: 'YOUR_DEVICE_KEY_IDENTIFIER',
      isDevelopment: true,
    };

    const headers: InitializeHeaders = {
      'x-token-bearer': 'YOUR_X_TOKEN_BEARER',
      'x-only-raw-analysis': '1',
    };

    initialize({ params, headers }, initialized => {
      const error = initialized.error;

      setIsInitialized(initialized.isSuccess);
      if (error) {
        console.error(`${error.cause} - (${error.code})`);
      } else {
        setLocale('en');
      }
    });
  };

  const onDispose = (): void => {
    dispose(disposed => {
      setIsInitialized(!disposed);

      if (!disposed) {
        console.error('Failed to dispose SDK.');
      }
    });
  };

  const onFaceScan = async (type: FaceScanType): Promise<void> => {
    try {
      await sessions[type]();
    } catch (error) {
      // Only thrown when the session can't start (e.g. NotInitialized, NoUserEnrolled).
      if (error instanceof SessionError) {
        console.error(`${error.message} - (${error.code})`);
      }
    }
  };

  // Session results are delivered here. `SessionCompleted` is `0`, so compare with `undefined`.
  useEffect(() => {
    if (data !== undefined) console.log(`Session completed - (${data})`);
    if (error) console.error(error.message);
  }, [data, error]);

  return (
    <div>
      <button onClick={onInitialize}>Initialize</button>

      {FACE_SCANS.map(({ type, label }) => (
        <button
          key={type}
          onClick={() => onFaceScan(type)}
          disabled={!isInitialized}
        >
          {label}
        </button>
      ))}

      <button onClick={onDispose} disabled={!isInitialized}>
        Dispose
      </button>
    </div>
  );
}
```

<hr/>

## API

| Methods        | Return type        | Access                        |
| -------------- | ------------------ | ----------------------------- |
| `initialize`   | `void`             | Package export                |
| `dispose`      | `void`             | Package export                |
| `enroll`       | `Promise<boolean>` | [`useAziface()`](#useaziface) |
| `authenticate` | `Promise<boolean>` | [`useAziface()`](#useaziface) |
| `liveness`     | `Promise<boolean>` | [`useAziface()`](#useaziface) |
| `photoScan`    | `Promise<boolean>` | [`useAziface()`](#useaziface) |
| `photoMatch`   | `Promise<boolean>` | [`useAziface()`](#useaziface) |
| `withTheme`    | `void`             | Package export                |
| `resetTheme`   | `void`             | Package export                |
| `setLocale`    | `void`             | Package export                |

### `initialize`

The `initialize` method configures and prepares the Aziface SDK before any face capture, liveness, authentication, or identity verification session can begin.

During initialization, the application provides the SDK with the required configuration data, such as the device key identifier, base URL, and `x-token-bearer`. The SDK validates these parameters, performs internal setup, and prepares the necessary resources for secure camera access, biometric processing, and user interface rendering.

A successful initialization confirms that the SDK is correctly licensed, properly configured for the target environment, and ready to start user sessions. If initialization fails due to invalid keys, network issues, or unsupported device conditions, the SDK returns an `InitializeResponse` object with `isSuccess` and error details so the application can handle the failure gracefully and prevent session startup.

Initialization is a mandatory step and must be completed once during the application lifecycle (or as required by the platform) before invoking any Aziface SDK workflows.

```ts
initialize(
  {
    params: {
      baseUrl: 'YOUR_BASE_URL',
      deviceKeyIdentifier: 'YOUR_DEVICE_KEY_IDENTIFIER',
      isDevelopment: true,
    },
    headers: {
      'x-token-bearer': 'YOUR_X_TOKEN_BEARER',
      'x-only-raw-analysis': '1',
    },
  },
  initialized => {
    const error = initialized.error;

    if (error) {
      console.error(`${error.cause} - (${error.code})`);
    } else {
      console.log('SDK initialized!!!');
    }
  },
);
```

#### Properties

| Property   | Type                                        | Required |
| ---------- | ------------------------------------------- | -------- |
| `init`     | [`Initialize`](#initialize-1)               | ✅       |
| `callback` | [`InitializeCallback`](#initializecallback) | ✅       |

### `dispose`

The `dispose` method in the Aziface SDK is used to properly release resources and clean up the SDK when it is no longer needed.

When called, the SDK shuts down any active processes, releases camera and memory resources, and clears internal states associated with previous sessions. This helps prevent memory leaks, ensures system stability, and prepares the application for a safe shutdown or potential reinitialization.

Dispose is typically used when the application is terminating, when the SDK will no longer be used, or when a full reset of the SDK state is required. It should be called only after all active sessions have been completed or canceled.

If dispose is performed while a session is still in progress, the SDK may return an error or forcefully terminate the session, depending on the platform implementation.

```ts
dispose(disposed => {
  if (disposed) {
    console.log('SDK disposed successfully!');
  } else {
    console.error('Failed to dispose SDK.');
  }
});
```

#### Properties

| Property   | Type                                  | Required |
| ---------- | ------------------------------------- | -------- |
| `callback` | [`DisposeCallback`](#disposecallback) | ✅       |

### `withTheme`

This method customizes your SDK theme during a session. The Aziface SDK must be successfully initialized **before calling** this API.

```ts
initialize(
  {
    // ...
  },
  initialized => {
    const error = initialized.error;

    if (error) {
      console.error(`${error.cause} - (${error.code})`);
    } else {
      withTheme({
        backgroundColor: '#FFFFFF',
      });
    }
  },
);
```

#### Properties

| Property    | Type              | Required | Default     |
| ----------- | ----------------- | -------- | ----------- |
| `overrides` | [`Style`](#style) | ❌       | `undefined` |

#### Custom images

The `brandingImage` and `cancelImage` properties represents your branding and icon of the button cancel. Default are [Azify](https://azify.com/) images, and `.png` format. If the image is not found, it will not be displayed during the session.

Go to your project's `public/core/images` directory and add your custom images there.

##### Example

Import the `withTheme` method and add image name (with extension), in image property (`brandingImage` or `cancelImage`). Check the code example below:

```ts
initialize(
  {
    // ...
  },
  initialized => {
    if (initialized.error) {
      // ...
    } else {
      withTheme({
        brandingImage: 'branding.png',
        cancelImage: 'cancel.png',
      });
    }
  },
);
```

**Note**: Images via HTTPS link **aren't** supported by SDK.

### `resetTheme`

The `resetTheme` method restores the default theme.

```ts
resetTheme();
```

### `setLocale`

The `setLocale` method in the Aziface SDK is used to define the language and locale used by the SDK’s user interface and vocal guidance during verification sessions. The Aziface SDK must be successfully initialized **before calling** this API.

By calling this method, the application specifies which language the SDK should use for on-screen text, voice prompts, and user instructions. This allows the SDK to present a localized experience that matches the user’s preferred or device language.

The selected language applies to all Aziface SDK workflows, including enrollment, authentication, liveness checks, photo scan, and photo match verification. The language must be set before starting a session to ensure consistent localization throughout the user interaction.

If an unsupported or invalid language code is provided, the SDK falls back to a default language (en) and returns appropriate status or error information, depending on the platform implementation.

```ts
initialize(
  {
    // ...
  },
  initialized => {
    if (initialized.error) {
      // ...
    } else {
      setLocale('pt-BR');
    }
  },
);
```

#### Properties

| Property | Type                | Required | Default     |
| -------- | ------------------- | -------- | ----------- |
| `locale` | [`Locale`](#locale) | ✅       | `undefined` |

<hr/>

## Hooks

### `useAziface`

The `useAziface` hook centralizes the session methods and exposes reactive `data` and `error` values.

```ts
const { data, error, enroll, authenticate, liveness, photoMatch, photoScan } =
  useAziface();
```

#### Properties

| Property                        | Return Type                |
| ------------------------------- | -------------------------- |
| `data`                          | `SessionCode \| undefined` |
| `error`                         | `Error \| undefined`       |
| [`enroll`](#enroll)             | `Promise<boolean>`         |
| [`authenticate`](#authenticate) | `Promise<boolean>`         |
| [`liveness`](#liveness)         | `Promise<boolean>`         |
| [`photoMatch`](#photomatch)     | `Promise<boolean>`         |
| [`photoScan`](#photoscan)       | `Promise<boolean>`         |

> [!NOTE]
> `data` holds `SessionCompleted` (`0`) on success, which is falsy. Check it with `data !== undefined` instead of `if (data)`.

##### `enroll`

The `enroll` method (returned by `useAziface()`) is responsible for registering a user’s face for the first time and creating a secure biometric identity. During enrollment, the SDK guides the user through a liveness detection process to ensure that a real person is present and not a photo, video, or spoofing attempt.

While the user follows on-screen instructions (such as positioning their face within the oval and performing natural movements), the SDK captures a set of facial data and generates a secure face scan. This face scan is then encrypted and sent to the backend for processing and storage.

The result of a successful enrollment is a trusted biometric template associated with the user’s identity, which can later be used for authentication, verification, or ongoing identity checks. If the enrollment fails due to poor lighting, incorrect positioning, or liveness issues, the SDK returns detailed status and error information so the application can handle retries or user feedback appropriately.

##### `authenticate`

The `authenticate` method (returned by `useAziface()`) verifies a user's identity by comparing a newly captured face scan against a previously enrolled biometric template. This process confirms that the person attempting to access the system is the same individual who completed enrollment.

During authentication, the SDK performs an active liveness check while guiding the user through simple on-screen instructions. A fresh face scan is captured, encrypted, and securely transmitted to the backend, where it is matched against the stored enrollment data.

If the comparison is successful and the liveness checks pass, the authentication is approved and the user is granted access. If the process fails due to a mismatch, spoofing attempt, or poor capture conditions, the SDK returns detailed result and error codes so the application can handle denial, retries, or alternative verification flows.

##### `liveness`

The `liveness` method (returned by `useAziface()`) is designed to determine whether the face presented to the camera belongs to a real, live person at the time of capture, without necessarily verifying their identity against a stored template.

In this flow, the SDK guides the user through a short interaction to capture facial movements and depth cues that are difficult to replicate with photos, videos, or masks. The resulting face scan is encrypted and sent to the backend, where advanced liveness detection algorithms analyze it for signs of spoofing or fraud.

A successful liveness result confirms real human presence and can be used as a standalone security check or as part of broader workflows such as authentication, onboarding, or high-risk transactions. If the liveness check fails, the SDK provides detailed feedback to allow the application to respond appropriately.

##### `photoMatch`

The `photoMatch` method (returned by `useAziface()`) is used to verify a user’s identity by analyzing a government-issued identity document and comparing it with the user’s live facial biometric data.

In this flow, the SDK first guides the user to capture high-quality images of their identity document. Then, a face scan is collected through a liveness-enabled facial capture. Both the document images and the face scan are encrypted and securely transmitted to the backend.

A successful result provides strong identity assurance, combining document authenticity and biometric verification. This flow is commonly used in regulated onboarding, KYC, and high-security access scenarios. If any step fails, the SDK returns detailed results and error information to support retries or alternative verification paths.

##### `photoScan`

The `photoScan` method (returned by `useAziface()`) is used to verify the authenticity and validity of a government-issued identity document without performing facial biometric verification.

In this flow, the SDK guides the user to capture images of the identity document, ensuring proper framing, focus, and lighting. The captured document images are encrypted and securely sent to the backend for analysis.

A successful document-only verification is suitable for lower-risk scenarios or cases where biometric capture is not required. If the verification fails due to image quality issues, unsupported documents, or suspected tampering, the SDK provides detailed feedback for proper error handling and user guidance.

<hr/>

## Styles

Aziface Web recommends importing our predefined styles for the best user experience.

Simply import them onto the screen where you are using Aziface methods.

```tsx
// ...
import { dispose, initialize, useAziface } from '@azify/aziface-web';
import '@azify/aziface-web/dist/aziface.css'; // <-- Add this import
```

<hr/>

## Responsiveness

**The Aziface Web SDK is responsive out of the box. You don't need to write any code to adapt the session layout to different screen sizes.**

The SDK automatically adjusts the session interface (frame, oval, buttons, feedback bar, and texts) to the device's viewport and orientation, on both desktop and mobile browsers.

> [!IMPORTANT]
> Do **not** implement manual responsiveness logic, such as:
>
> - Functions that recalculate sizes based on `window.innerWidth` or `window.innerHeight`.
> - `resize` or `orientationchange` listeners that call `withTheme` again.
> - Custom CSS overriding the SDK container's dimensions.
>
> This approach was used in the past and proved to be unnecessary, the SDK already handles it. Manual adjustments may conflict with the SDK's internal layout and cause visual inconsistencies.

To customize the appearance, use only [`withTheme`](#withtheme) and the [predefined styles](#styles). The layout adaptation will continue to be managed by the SDK.

<hr/>

## Types

### `Initialize`

The `Initialize` object is required to initialize the SDK.

| Property  | Type                                      | Required |
| --------- | ----------------------------------------- | -------- |
| `params`  | [`InitializeParams`](#initializeparams)   | ✅       |
| `headers` | [`InitializeHeaders`](#initializeheaders) | ✅       |

#### `InitializeParams`

It contains the parameters used to initialize and start the SDK.

| Property              | Type      | Required |
| --------------------- | --------- | -------- |
| `deviceKeyIdentifier` | `string`  | ✅       |
| `baseUrl`             | `string`  | ✅       |
| `isDevelopment`       | `boolean` | ❌       |

#### `InitializeHeaders`

It establishes communication between the SDK and the external service.

| Property         | Type                          | Required |
| ---------------- | ----------------------------- | -------- |
| `x-token-bearer` | `string`                      | ✅       |
| `[key: string]`  | `string \| null \| undefined` | ❌       |

### `InitializeCallback`

Use `InitializeCallback` to receive the initialization response.

| Callback      | Type                                        | Required |
| ------------- | ------------------------------------------- | -------- |
| `initialized` | [`InitializeResponse`](#initializeresponse) | ❌       |

#### `InitializeResponse`

The initialization object of the SDK when initialize is called.

| Property    | Type                                  | Required |
| ----------- | ------------------------------------- | -------- |
| `isSuccess` | `boolean`                             | ✅       |
| `error`     | [`InitializeError`](#initializeerror) | ❌       |

##### `InitializeError`

The initialize method return an `InitializeError` object when some error occurs.

| Property | Type                                          | Required |
| -------- | --------------------------------------------- | -------- |
| `code`   | [`InitializeCodeError`](#initializecodeerror) | ✅       |
| `cause`  | `string`                                      | ✅       |

###### `InitializeCodeError`

The initialize code error is a type identifier of the error in the SDK.

| Code                                  | Description                                                                           | Identifier |
| ------------------------------------- | ------------------------------------------------------------------------------------- | ---------- |
| `RejectedByServer`                    | The Aziface Server could not validate this application.                               | `0`        |
| `RequestAborted`                      | When request has catastrophic error and the application could not be validated.       | `1`        |
| `DeviceNotSupported`                  | This device/platform/browser/version combination is not supported by the Aziface SDK. | `2`        |
| `UnknownInternalError`                | An unknown and unexpected error occurred.                                             | `3`        |
| `ResourcesCouldNotBeLoadedOnLastInit` | Aziface SDK could not load resources.                                                 | `4`        |
| `GetUserMediaRemoteHTTPNotSupported`  | Browser Camera APIs are only supported on localhost or https.                         | `5`        |

###### `SessionCode`

The session code is a type identifier of the session when a method fails or it has success.

| Code                                | Description                                                                                                                                                  | Identifier |
| ----------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ | ---------- |
| `SessionCompleted`                  | The Session was completed.                                                                                                                                   | `0`        |
| `RequestAborted`                    | When session has catastrophic error and the application could not be validated.                                                                              | `1`        |
| `UserCancelledFaceScan`             | The user cancelled before performing enough scans to succeed.                                                                                                | `2`        |
| `UserCancelledIDScan`               | The user cancelled before completing all of the steps in the ID Scan Process.                                                                                | `3`        |
| `LockedOut`                         | The session was cancelled because the user was in a locked out state.                                                                                        | `4`        |
| `CameraError`                       | The session was cancelled because Aziface SDK was unable to start the camera on this device, or an unexpected error occurred with the camera during runtime. | `5`        |
| `CameraPermissionsDenied`           | The session was cancelled because camera permissions were not enabled.                                                                                       | `6`        |
| `UnknownInternalError`              | An unknown and unexpected error occurred.                                                                                                                    | `7`        |
| `IFrameNotAllowedWithoutPermission` | The session was cancelled because the Aziface SDK was opened in an iframe without permission.                                                                | `8`        |
| `NotInitialized`                    | This error code indicates that the Aziface SDK has not been initialized.                                                                                     | `9`        |

### `DisposeCallback`

Use `DisposeCallback` to receive the dispose response.

| Callback   | Type      | Required |
| ---------- | --------- | -------- |
| `disposed` | `boolean` | ❌       |

### `Style`

Customize your Aziface SDK using `Style` object.

| Property                        | Type                                | Required | Default     |
| ------------------------------- | ----------------------------------- | -------- | ----------- |
| `backgroundColor`               | `string`                            | ❌       | `#FFFFFF`   |
| `frameColor`                    | `string`                            | ❌       | `#FFFFFF`   |
| `borderColor`                   | `string`                            | ❌       | `#026FF4`   |
| `ovalColor`                     | `string`                            | ❌       | `#026FF4`   |
| `dualSpinnerColor`              | `string`                            | ❌       | `#026FF4`   |
| `textColor`                     | `string`                            | ❌       | `#026FF4`   |
| `buttonAndFeedbackBarColor`     | `string`                            | ❌       | `#026FF4`   |
| `buttonAndFeedbackBarTextColor` | `string`                            | ❌       | `#FFFFFF`   |
| `buttonColorHighlight`          | `string`                            | ❌       | `#0264DC`   |
| `buttonColorDisabled`           | `string`                            | ❌       | `#B3D4FC`   |
| `frameCornerRadius`             | `string`                            | ❌       | `20px`      |
| `cancelImage`                   | `string`                            | ❌       | `undefined` |
| `cancelLocation`                | [`CancelLocation`](#cancellocation) | ❌       | `top-left`  |
| `brandingImage`                 | `string`                            | ❌       | `undefined` |
| `showBranding`                  | `boolean`                           | ❌       | `true`      |

#### `CancelLocation`

The `CancelLocation` type defines where the cancel button will be shown.

| type        | Description                          |
| ----------- | ------------------------------------ |
| `top-left`  | Displays cancel button in top-left.  |
| `top-right` | Displays cancel button in top-right. |
| `none`      | Hides the cancel button.             |

### Locale

The `Locale` type uses the [ISO 639](https://en.wikipedia.org/wiki/List_of_ISO_639_language_codes) language codes pattern.

| type    | Description                     |
| ------- | ------------------------------- |
| `af`    | Afrikaans language.             |
| `ar`    | Arabic language.                |
| `de`    | German language.                |
| `el`    | Greek language.                 |
| `en`    | English language.               |
| `es`    | Spanish and Castilian language. |
| `fr`    | French language.                |
| `ja`    | Japanese language.              |
| `kk`    | Kazakh language.                |
| `no`    | Norwegian Bokmål language.      |
| `pt-BR` | Portuguese Brazilian language.  |
| `ru`    | Russian language.               |
| `vi`    | Vietnamese language.            |
| `zh`    | Chinese language.               |

<hr/>

## Classes

### `SessionError`

A `SessionError` is thrown when an error occurs in the Aziface SDK.

| Property  | Type                          | Required |
| --------- | ----------------------------- | -------- |
| `code`    | [`SessionCode`](#sessioncode) | ✅       |
| `name`    | `string`                      | ✅       |
| `message` | `string`                      | ✅       |
| `cause`   | `string`                      | ❌       |
| `stack`   | `string`                      | ❌       |

#### `constructor`

The `constructor` receives `code` as an argument.

| Property | Type                          | Required |
| -------- | ----------------------------- | -------- |
| `code`   | [`SessionCode`](#sessioncode) | ✅       |

<hr/>

## Changelog

See [CHANGELOG.md](./CHANGELOG.md) for release history.

<hr/>

## License

MIT
