import { SessionCodeError } from '@/types/aziface.types';
import { getSessionStatusCauseByCode } from './utils';

export class SessionError extends Error {
  constructor(public code: SessionCodeError) {
    super(getSessionStatusCauseByCode(code));
    this.code = code;
    this.name = 'SessionError';
    this.cause = getSessionStatusCauseByCode(code);
  }
}
