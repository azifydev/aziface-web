import {
  FaceTecInitializationError,
  FaceTecSessionStatus,
} from '@/public/core/facetec/FaceTecPublicApi';

export type InitializeCodeError = FaceTecInitializationError;

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

export type SessionCodeError = FaceTecSessionStatus | MethodError;

export interface InitializeParams {
  deviceKeyIdentifier: string;
  baseUrl: string;
  isDevelopment?: boolean;
}

export interface InitializeHeaders {
  'x-token-bearer': string;
  [key: string]: string | null | undefined;
}

export interface Initialize {
  params: InitializeParams;
  headers: InitializeHeaders;
}

export interface InitializeResponse {
  isSuccess: boolean;
  error?: {
    code: InitializeCodeError;
    cause: string;
  };
}

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

export interface InitializeCallback {
  (initialized: InitializeResponse): void;
}

export interface DisposeCallback {
  (disposed: boolean): void;
}

export interface Controller {
  initialize: (init: Initialize, callback: InitializeCallback) => void;
  dispose: (callback: DisposeCallback) => void;
  enroll: () => void;
  authenticate: () => void;
  liveness: () => void;
  photoScan: () => void;
  photoMatch: () => void;
  withTheme: (overrides?: Style) => void;
}
