export {
  authenticate,
  dispose,
  enroll,
  initialize,
  liveness,
  photoMatch,
  photoScan,
  resetTheme,
  withTheme,
  setLocale,
} from './aziface';

export type {
  DisposeCallback,
  Initialize,
  InitializeCallback,
  InitializeCodeError,
  InitializeError,
  InitializeHeaders,
  InitializeParams,
  InitializeResponse,
  MethodError,
  SessionCode,
  Locale,
  Style,
} from './types';

export { SessionError } from './errors';
