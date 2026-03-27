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
} from './module/aziface';

export type {
  DisposeCallback,
  Initialize,
  InitializeCallback,
  InitializeCodeError,
  InitializeError,
  InitializeHeaders,
  InitializeParams,
  InitializeResponse,
  Locale,
  SessionCode,
  Style,
} from './types/aziface';

export { SessionError } from './errors/errors';
