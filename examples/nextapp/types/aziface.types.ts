export interface Params {
  deviceKeyIdentifier: string;
  baseUrl: string;
  isDevelopment?: boolean;
}

export interface Headers {
  'x-token-bearer': string;
  [key: string]: string | null | undefined;
}

export interface Initialize {
  params: Params;
  headers: Headers;
}

export interface InitializeCallback {
  (initialized: boolean): void;
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
