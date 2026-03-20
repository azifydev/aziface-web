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
  Style,
} from './types';

export { SessionError } from './errors';
