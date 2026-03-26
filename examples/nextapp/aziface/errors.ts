import { MethodError, SessionCode } from './types';
import { getSessionStatusCauseByCode } from './utils';

export class SessionError extends Error {
  constructor(public code: SessionCode | MethodError) {
    super(getSessionStatusCauseByCode(code));
    this.code = code;
    this.name = 'SessionError';
    this.message = getSessionStatusCauseByCode(code);
  }
}
