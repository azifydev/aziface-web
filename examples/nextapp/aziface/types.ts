import {
  FaceTecInitializationError as InitializeCodeError,
  FaceTecSessionStatus as SessionCode,
} from '@/public/core/facetec/FaceTecPublicApi';

/**
 * @enum MethodError
 *
 * @description An enum that defines custom error codes for method errors that
 * can occur within the Aziface SDK.
 */
export enum MethodError {
  /**
   * This error code indicates that the SDK has not been initialized.
   * Please call the `initialize()` method before attempting to call this method.
   */
  NotInitialized = 9,

  /**
   * No user enrolled. Please enroll a user before attempting to authenticate.
   */
  NoUserEnrolled = 10,
}

/**
 * @interface InitializeParams
 *
 * @description An object that defines the parameters required to initialize the
 * Aziface SDK, including the device key identifier, base URL for API calls, and
 * an optional flag indicating whether the SDK is being initialized in a
 * development environment.
 */
export interface InitializeParams {
  /**
   * @description A unique identifier for the device, used by the Aziface SDK to
   * identify the device and manage sessions.
   */
  deviceKeyIdentifier: string;

  /**
   * @description The base URL for API calls made by the Aziface SDK. This
   * should be the URL of your server that will handle the API requests from the
   * SDK.
   */
  baseUrl: string;

  /**
   * @description An optional flag indicating whether the SDK is being
   * initialized in a development environment. This can be used to enable
   * additional logging or debugging features in the SDK.
   *
   * @default false
   */
  isDevelopment?: boolean;
}
/**
 * @interface InitializeHeaders
 *
 * @description An object that defines the structure of the headers object
 * required to initialize the Aziface SDK. This object includes a required
 * 'x-token-bearer' header and allows for any number of additional headers to be
 * included as needed.
 */
export interface InitializeHeaders {
  /**
   * @description A required header that must be included in the headers object
   * when initializing the Aziface SDK. The value of this header should be a token
   * that your server can use to authenticate the request and validate the
   * application.
   */
  'x-token-bearer': string;

  /**
   * @description Additional headers that may be needed for authentication or other
   * purposes when initializing the Aziface SDK. This is an index signature that
   * allows for any number of additional headers to be included in the headers
   * object, with string keys and string, null, or undefined values.
   */
  [key: string]: string | null | undefined;
}

/**
 * @interface Initialize
 *
 * @description An object that defines the parameters and headers required to
 * initialize the Aziface SDK.
 */
export interface Initialize {
  /**
   * @description An object containing the parameters needed to initialize the
   * Aziface SDK, including the device key identifier, base URL for API calls,
   * and an optional flag indicating whether the SDK is being initialized in a
   * development environment.
   */
  params: InitializeParams;

  /**
   * @description An object containing the headers needed to initialize the
   * Aziface SDK, including a required 'x-token-bearer' header and any
   * additional headers that may be needed for authentication or other purposes.
   */
  headers: InitializeHeaders;
}

/**
 * @interface InitializeError
 *
 * @description An object that defines the structure of the error object returned
 * in the callback function of the `initialize()` method when the initialization
 * operation is not successful.
 */
export interface InitializeError {
  /**
   * @description An error code indicating the reason for the initialization
   * failure.
   */
  code: InitializeCodeError;

  /**
   * @description A string providing more details about the cause of the
   * initialization failure.
   */
  cause: string;
}

/**
 * @interface InitializeResponse
 *
 * @description The response object returned in the callback function of the
 * `initialize()` method.
 */
export interface InitializeResponse {
  /**
   * @description A boolean value indicating whether the initialization
   * operation was successful.
   */
  isSuccess: boolean;

  /**
   * @description An object containing error information if the initialization
   * operation was not successful. This property is optional and will be
   * `undefined` if the initialization operation was successful.
   */
  error?: InitializeError;
}

/**
 * @interface Style
 *
 * @description An object that defines the customizable styling options for the
 * Aziface UI.
 */
export interface Style {
  /**
   * @description The background color of the Aziface UI.
   *
   * @default '#FFFFFF'
   */
  backgroundColor?: string;

  /**
   * @description The color of the frame around the Aziface UI.
   *
   * @default '#FFFFFF'
   */
  frameColor?: string;

  /**
   * @description The color of the border around the Aziface UI.
   *
   * @default '#026FF4'
   */
  borderColor?: string;

  /**
   * @description The color of the oval in the Aziface UI.
   *
   * @default '#026FF4'
   */
  ovalColor?: string;

  /**
   * @description The color of the dual spinner in the Aziface UI.
   *
   * @default '#026FF4'
   */
  dualSpinnerColor?: string;

  /**
   * @description The color of the text in the Aziface UI.
   *
   * @default '#026FF4'
   */
  textColor?: string;

  /**
   * @description The color of the buttons and feedback bar in the Aziface UI.
   *
   * @default '#026FF4'
   */
  buttonAndFeedbackBarColor?: string;

  /**
   * @description The color of the text on the buttons and feedback bar in the
   * Aziface UI.
   *
   * @default '#FFFFFF'
   */
  buttonAndFeedbackBarTextColor?: string;

  /**
   * @description The color of the buttons in the Aziface UI when they are
   * highlighted.
   *
   * @default '#0264DC'
   */
  buttonColorHighlight?: string;

  /**
   * @description The color of the buttons in the Aziface UI when they are
   * disabled.
   *
   * @default '#B3D4FC'
   */
  buttonColorDisabled?: string;

  /**
   * @description The corner radius of the frame in the Aziface UI.
   *
   * @default '20px'
   */
  frameCornerRadius?: string;

  /**
   * @description The image to use for the cancel button in the Aziface UI. Uses
   * the default cancel button image provided by the SDK if not specified.
   *
   * @default undefined
   */
  cancelImage?: string;

  /**
   * @description The location of the cancel button in the Aziface UI. Uses the
   * default branding image provided by the SDK if not specified.
   *
   * @default undefined
   */
  brandingImage?: string;
}

/**
 * @description A callback function that is called when the `initialize()`
 * method is called. The callback function receives a boolean value indicating
 * whether the initialization operation was successful.
 *
 * @param initialized - A boolean value indicating whether the initialization
 * operation was successful.
 *
 * @returns void
 */
export interface InitializeCallback {
  (initialized: InitializeResponse): void;
}

/**
 * @description A callback function that is called when the `dispose()` method is
 * called. The callback function receives a boolean value indicating whether the
 * dispose operation was successful.
 *
 * @param disposed - A boolean value indicating whether the dispose operation was
 * successful.
 *
 * @returns void
 */
export interface DisposeCallback {
  (disposed: boolean): void;
}

/**
 * @type Locale
 *
 * @description A type that represents the supported locale options for the
 * Aziface SDK. This type includes a list of language codes that can be used to
 * set the locale of the SDK.
 */
export type Locale =
  | 'af'
  | 'ar'
  | 'de'
  | 'el'
  | 'en'
  | 'es'
  | 'fr'
  | 'ja'
  | 'kk'
  | 'no'
  | 'pt-BR'
  | 'ru'
  | 'vi'
  | 'zh';

export interface Controller {
  initialize: (init: Initialize, callback: InitializeCallback) => void;
  dispose: (callback: DisposeCallback) => void;
  enroll: () => void;
  authenticate: () => void;
  liveness: () => void;
  photoScan: () => void;
  photoMatch: () => void;
  withTheme: (overrides?: Style) => void;
  setLocale: (locale: Locale) => void;
}

export {
  /**
   * @enum InitializeCodeError
   *
   * @description A type that represents the possible status codes that can be
   * returned from the `initialize()` method, including both the status codes
   * defined by the Aziface SDK and custom method error codes defined in this
   * application.
   */
  InitializeCodeError,

  /**
   * @enum SessionCode
   *
   * @description A type that represents the possible status codes that can be
   * returned from a session, including both the status codes defined by the
   * Aziface SDK and custom method error codes defined in this application.
   */
  SessionCode,
};
