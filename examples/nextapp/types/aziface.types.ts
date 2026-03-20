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
}
