# @azify/aziface-web 🖥️

Web SDK adapter for React.

## Summary

- [Installation](#installation)
- [Usage](#usage)
- [API](#api)
  - [`initialize`](#initialize)
    - [`Properties`](#properties)
  - [`dispose`](#dispose)
    - [`Properties`](#properties-1)
  - [`enroll`](#enroll)
  - [`authenticate`](#authenticate)
  - [`liveness`](#liveness)
  - [`photoScan`](#photoscan)
  - [`photoMatch`](#photomatch)
  - [`withTheme`](#withtheme)
    - [`Properties`](#properties-2)
    - [`Custom images`](#custom-images)
      - [`Example`](#example)
  - [`resetTheme`](#resettheme)
  - [`setLocale`](#setlocale)
    - [`Properties`](#properties-3)
- [Types](#types)
  - [`Initialize`](#initialize-1)
    - [`InitializeParams`](#initializeparams)
    - [`InitializeHeaders`](#initializeheaders)
  - [`InitializeCallback`](#initializecallback)
    - [`InitializeResponse`](#initializeresponse)
      - [`InitializeError`](#initializeerror)
  - [`DisposeCallback`](#disposecallback)
  - [`Style`](#style)
  - [`Locale`](#locale)
- [Enums](#enums)
  - [`InitializeCodeError`](#initializecodeerror)
  - [`SessionCode`](#sessioncodeerror)
- [Classes](#classes)
  - [`SessionError`](#sessionerror)
    - [`constructor`](#constructor)

<hr/>

## Installation

Add the SDK to your project:

```bash
npm i @azify/aziface-web
```

<hr/>

## Usage

```tsx
// ...
import {
  authenticate,
  dispose,
  enroll,
  initialize,
  liveness,
  photoMatch,
  photoScan,
  withTheme,
  type Initialize,
  type InitializeCallback,
  type InitializeHeaders,
  type InitializeParams,
} from '@azify/aziface-web';

export function MyPage() {
  // ...
  const [isInitialized, setIsInitialized] = useState(false);

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

  const onFaceScan = (type: string): void => {
    try {
      switch (type) {
        case 'enroll':
          enroll();
          break;
        case 'authenticate':
          authenticate();
          break;
        case 'liveness':
          liveness();
          break;
        case 'photoMatch':
          photoMatch();
          break;
        case 'photoScan':
          photoScan();
          break;
        default:
          console.error(`Invalid face scan type: ${type}`);
          break;
      }
    } catch (error) {
      const sessionError = error as SessionError;
      console.error(sessionError.message);
    }
  };
  // ...

  return (
    <div className='min-h-screen flex items-center justify-center bg-gray-50'>
      <div className='bg-white border border-gray-200 rounded-xl p-8 w-full max-w-sm shadow-sm'>
        <div className='flex flex-col gap-3'>
          <button
            onClick={onInitialize}
            className='w-full py-3 bg-gray-100 hover:bg-gray-200 border border-gray-200 rounded-lg text-sm font-medium text-gray-900 transition active:scale-[0.98]'
          >
            Initialize
          </button>

          <button
            onClick={() => onFaceScan('enroll')}
            disabled={!isInitialized}
            className='w-full py-3 disabled:hover:bg-gray-100 disabled:active:scale-100 disabled:opacity-50 disabled:cursor-not-allowed bg-gray-100 hover:bg-gray-200 border border-gray-200 rounded-lg text-sm font-medium text-gray-900 transition active:scale-[0.98]'
          >
            Enroll
          </button>

          <button
            onClick={() => onFaceScan('liveness')}
            disabled={!isInitialized}
            className='w-full py-3 disabled:hover:bg-gray-100 disabled:active:scale-100 disabled:opacity-50 disabled:cursor-not-allowed bg-gray-100 hover:bg-gray-200 border border-gray-200 rounded-lg text-sm font-medium text-gray-900 transition active:scale-[0.98]'
          >
            Liveness
          </button>

          <button
            onClick={() => onFaceScan('authenticate')}
            disabled={!isInitialized}
            className='w-full py-3 disabled:hover:bg-gray-100 disabled:active:scale-100 disabled:opacity-50 disabled:cursor-not-allowed bg-gray-100 hover:bg-gray-200 border border-gray-200 rounded-lg text-sm font-medium text-gray-900 transition active:scale-[0.98]'
          >
            Authenticate
          </button>

          <button
            onClick={() => onFaceScan('photoMatch')}
            disabled={!isInitialized}
            className='w-full py-3 disabled:hover:bg-gray-100 disabled:active:scale-100 disabled:opacity-50 disabled:cursor-not-allowed bg-gray-100 hover:bg-gray-200 border border-gray-200 rounded-lg text-sm font-medium text-gray-900 transition active:scale-[0.98]'
          >
            Photo Match
          </button>

          <button
            onClick={() => onFaceScan('photoScan')}
            disabled={!isInitialized}
            className='w-full py-3 disabled:hover:bg-gray-100 disabled:active:scale-100 disabled:opacity-50 disabled:cursor-not-allowed bg-gray-100 hover:bg-gray-200 border border-gray-200 rounded-lg text-sm font-medium text-gray-900 transition active:scale-[0.98]'
          >
            Photo Scan
          </button>

          <button
            onClick={onDispose}
            disabled={!isInitialized}
            className='w-full py-3 disabled:hover:bg-gray-100 disabled:active:scale-100 disabled:opacity-50 disabled:cursor-not-allowed bg-gray-100 hover:bg-gray-200 border border-gray-200 rounded-lg text-sm font-medium text-gray-900 transition active:scale-[0.98]'
          >
            Dispose
          </button>
        </div>
      </div>
    </div>
  );
}
```

<hr/>

## API

| Methods        | Return type |
| -------------- | ----------- |
| `initialize`   | `void`      |
| `dispose`      | `void`      |
| `enroll`       | `void`      |
| `authenticate` | `void`      |
| `liveness`     | `void`      |
| `photoScan`    | `void`      |
| `photoMatch`   | `void`      |
| `withTheme`    | `void`      |
| `resetTheme`   | `void`      |
| `setLocale`    | `void`      |

### `initialize`

The `initialize` of the Aziface SDK is the process of configuring and preparing the SDK for use before any face capture, liveness, authentication, or identity verification sessions can begin.

During initialization, the application provides the SDK with the required configuration data, such as the device key identifier, base URL, and `x-token-bearer`. The SDK validates these parameters, performs internal setup, and prepares the necessary resources for secure camera access, biometric processing, and user interface rendering.

A successful initialization confirms that the SDK is correctly licensed, properly configured for the target environment, and ready to start user sessions. If initialization fails due to invalid keys, network issues, or unsupported device conditions, the SDK returns boolean information (true or false) so the application can handle the failure gracefully and prevent session startup.

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
    console.log('SDK disposed with successful!!!');
  } else {
    console.error('Failed to dispose SDK.');
  }
});
```

#### Properties

| Property   | Type                                  | Required |
| ---------- | ------------------------------------- | -------- |
| `callback` | [`DisposeCallback`](#disposecallback) | ✅       |

### `enroll`

The `enroll` method in the Aziface SDK is responsible for registering a user’s face for the first time and creating a secure biometric identity. During enrollment, the SDK guides the user through a liveness detection process to ensure that a real person is present and not a photo, video, or spoofing attempt.

While the user follows on-screen instructions (such as positioning their face within the oval and performing natural movements), the SDK captures a set of facial data and generates a secure face scan. This face scan is then encrypted and sent to the backend for processing and storage.

The result of a successful enrollment is a trusted biometric template associated with the user’s identity, which can later be used for authentication, verification, or ongoing identity checks. If the enrollment fails due to poor lighting, incorrect positioning, or liveness issues, the SDK returns detailed status and error information so the application can handle retries or user feedback appropriately.

### `authenticate`

The authentication method in the Aziface SDK is used to verify a user’s identity by comparing a newly captured face scan against a previously enrolled biometric template. This process confirms that the person attempting to access the system is the same individual who completed the enrollment.

During authentication, the SDK performs an active liveness check while guiding the user through simple on-screen instructions. A fresh face scan is captured, encrypted, and securely transmitted to the backend, where it is matched against the stored enrollment data.

If the comparison is successful and the liveness checks pass, the authentication is approved and the user is granted access. If the process fails due to a mismatch, spoofing attempt, or poor capture conditions, the SDK returns detailed result and error codes so the application can handle denial, retries, or alternative verification flows.

### `liveness`

The `liveness` method in the Aziface SDK is designed to determine whether the face presented to the camera belongs to a real, live person at the time of capture, without necessarily verifying their identity against a stored template.

In this flow, the SDK guides the user through a short interaction to capture facial movements and depth cues that are difficult to replicate with photos, videos, or masks. The resulting face scan is encrypted and sent to the backend, where advanced liveness detection algorithms analyze it for signs of spoofing or fraud.

A successful liveness result confirms real human presence and can be used as a standalone security check or as part of broader workflows such as authentication, onboarding, or high-risk transactions. If the liveness check fails, the SDK provides detailed feedback to allow the application to respond appropriately.

### `photoMatch`

The `photoMatch` method in the Aziface SDK is used to verify a user’s identity by analyzing a government-issued identity document and comparing it with the user’s live facial biometric data.

In this flow, the SDK first guides the user to capture high-quality images of their identity document. Then, a face scan is collected through a liveness-enabled facial capture. Both the document images and the face scan are encrypted and securely transmitted to the backend.

A successful result provides strong identity assurance, combining document authenticity and biometric verification. This flow is commonly used in regulated onboarding, KYC, and high-security access scenarios. If any step fails, the SDK returns detailed results and error information to support retries or alternative verification paths.

### `photoScan`

The `photoScan` method in the Aziface SDK is used to verify the authenticity and validity of a government-issued identity document without performing facial biometric verification.

In this flow, the SDK guides the user to capture images of the identity document, ensuring proper framing, focus, and lighting. The captured document images are encrypted and securely sent to the backend for analysis.

A successful document-only verification is suitable for lower-risk scenarios or cases where biometric capture is not required. If the verification fails due to image quality issues, unsupported documents, or suspected tampering, the SDK provides detailed feedback for proper error handling and user guidance.

### `withTheme`

This method customize your SDK theme during session. The Aziface SDK must be successfully initialized **before calling** this API.

```ts
initialize(
  {
    // ...
  },
  initialized => {
    const error = initialized.error;

    if (error && !initialized.isSuccess) {
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

You must go to your project's `public/core/images` directory. Inside the `public/core/images` folder, you must put your images.

##### Example

Import the `withTheme` method and add image name (with extension), in image property (`brandingImage` or `cancelImage`). Check the code example below:

```ts
initialize(
  {
    // ...
  },
  initialized => {
    if (initialized.error && !initialized.isSuccess) {
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

### `resetTheme`

The `resetTheme` is a fallback method to return default theme.

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
    if (initialized.error && !initialized.isSuccess) {
      // ...
    } else {
      setLocale('pt-br');
    }
  },
);
```

#### Properties

| Property | Type                | Required | Default     |
| -------- | ------------------- | -------- | ----------- |
| `locale` | [`Locale`](#locale) | ✅       | `undefined` |

<hr/>

## Types

### `Initialize`

The `Initialize` object is required to initialize the SDK.

| Property  | Type                                      | Required |
| --------- | ----------------------------------------- | -------- |
| `params`  | [`InitializeParams`](#initializeparams)   | ✅       |
| `headers` | [`InitializeHeaders`](#initializeheaders) | ✅       |

#### `InitializeParams`

It initializes, and it starts SDK.

| Property              | Type      | Required |
| --------------------- | --------- | -------- |
| `deviceKeyIdentifier` | `string`  | ✅       |
| `baseUrl`             | `string`  | ✅       |
| `isDevelopment`       | `boolean` | ❌       |

#### `InitializeHeaders`

It establishes communication between the SDK and the external service.

| Property         | Type     | Required |
| ---------------- | -------- | -------- |
| `x-token-bearer` | `string` | ✅       |
| `[key: string]`  | `string` | ❌       |

### `InitializeCallback`

Get initialization response using the `InitializeCallback`.

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

### `DisposeCallback`

Get dispose response using the `DisposeCallback`.

| Callback   | Type      | Required |
| ---------- | --------- | -------- |
| `disposed` | `boolean` | ❌       |

### `Style`

Customize your Aziface SDK using `Style` object.

| Property                        | Type     | Required | Default     |
| ------------------------------- | -------- | -------- | ----------- |
| `backgroundColor`               | `string` | ❌       | `#FFFFFF`   |
| `frameColor`                    | `string` | ❌       | `#FFFFFF`   |
| `borderColor`                   | `string` | ❌       | `#026FF4`   |
| `ovalColor`                     | `string` | ❌       | `#026FF4`   |
| `dualSpinnerColor`              | `string` | ❌       | `#026FF4`   |
| `textColor`                     | `string` | ❌       | `#026FF4`   |
| `buttonAndFeedbackBarColor`     | `string` | ❌       | `#026FF4`   |
| `buttonAndFeedbackBarTextColor` | `string` | ❌       | `#FFFFFF`   |
| `buttonColorHighlight`          | `string` | ❌       | `#0264DC`   |
| `buttonColorDisabled`           | `string` | ❌       | `#B3D4FC`   |
| `frameCornerRadius`             | `string` | ❌       | `20px`      |
| `cancelImage`                   | `string` | ❌       | `undefined` |
| `brandingImage`                 | `string` | ❌       | `undefined` |

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

## Enums

### `InitializeCodeError`

The initialize code error is a type identifier of the error in the SDK.

| Code                                  | Description                                                                           | Identifier |
| ------------------------------------- | ------------------------------------------------------------------------------------- | ---------- |
| `RejectedByServer`                    | The Aziface Server could not validate this application.                               | `0`        |
| `RequestAborted`                      | When request has catastrophic error and the application could not be validated.       | `1`        |
| `DeviceNotSupported`                  | This device/platform/browser/version combination is not supported by the Aziface SDK. | `2`        |
| `UnknownInternalError`                | An unknown and unexpected error occurred.                                             | `3`        |
| `ResourcesCouldNotBeLoadedOnLastInit` | Aziface SDK could not load resources.                                                 | `4`        |
| `GetUserMediaRemoteHTTPNotSupported`  | Browser Camera APIs are only supported on localhost or https.                         | `5`        |

### `SessionCode`

The session code is a type identifier of the session when a method fails or it has success.

| Code                                | Description                                                                                                                                                  | Identifier |
| ----------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ | ---------- |
| `SessionCompleted`                  | The Session was completed.                                                                                                                                   | `0`        |
| `RequestAborted`                    | When session has catastrophic error and the application could not be validated.                                                                              | `1`        |
| `UserCancelledFaceScan`             | The user cancelled before performing enough scans to cucceed.                                                                                                | `2`        |
| `UserCancelledIDScan`               | The user cancelled before completing all of the steps in the ID Scan Process.                                                                                | `3`        |
| `LockedOut`                         | The session was cancelled because the user was in a locked out state.                                                                                        | `4`        |
| `CameraError`                       | The session was cancelled because Aziface SDK was unable to start the camera on this device, or an unexpected error occurred with the camera during runtime. | `5`        |
| `CameraPermissionsDenied`           | The session was cancelled because camera permissions were not enabled.                                                                                       | `6`        |
| `UnknownInternalError`              | An unknown and unexpected error occurred.                                                                                                                    | `7`        |
| `IFrameNotAllowedWithoutPermission` | The session was cancelled, the Aziface SDK was opened in an Iframe without permission.                                                                       | `8`        |
| `NotInitialized`                    | This error code indicates that the Aziface SDK has not been initialized.                                                                                     | `9`        |
| `NoUserEnrolled`                    | No user enrolled. Please enroll a user before attempting to authenticate.                                                                                    | `10`       |

<hr/>

## Classes

### `SessionError`

A `SessionError` class is returned when an error is thrown by the Aziface SDK.

| Property  | Type                          | Required |
| --------- | ----------------------------- | -------- |
| `code`    | [`SessionCode`](#sessioncode) | ✅       |
| `name`    | `string`                      | ✅       |
| `message` | `string`                      | ✅       |
| `cause`   | `string`                      | ✅       |
| `stack`   | `string`                      | ❌       |

#### `constructor`

The `constructor` receives `code` as an argument.

| Property | Type                          | Required |
| -------- | ----------------------------- | -------- |
| `code`   | [`SessionCode`](#sessioncode) | ✅       |
