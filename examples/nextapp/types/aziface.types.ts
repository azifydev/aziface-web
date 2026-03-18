export interface Params {
  deviceKeyIdentifier: string;
  baseUrl: string;
  isDevelopment?: boolean;
}

export interface Headers {
  'x-token-bearer': string;
  [key: string]: string | null | undefined;
}

export interface InitializeRequest {
  params: Params;
  headers?: Headers;
}

export interface Aziface {
  initialize: (params: InitializeRequest) => boolean;
  liveness: () => boolean;
  enroll: () => boolean;
}
