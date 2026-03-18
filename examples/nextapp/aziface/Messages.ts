/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { FaceTecInitializationError, FaceTecSessionStatus } from '../public/core/facetec/FaceTecPublicApi';
import { Status } from './Status';
const FaceTecSDK = typeof window !== 'undefined' ? (window as any).FaceTecSDK : undefined;

export class Messages {
  public static LOG_PREFIX: string = 'Aziface Web SDK:';
  public static displayMessage = (message: string): void => {
    console.log(`${this.LOG_PREFIX} ${message}`);
  };

  public static logMessage = (message: string): void => {
    console.log(`${this.LOG_PREFIX} ${message}`);
  };

  public static logAndDisplayMessage = (message: string): void => {
    this.displayMessage(message);
    this.logMessage(message);
  };

  public static logInitializationErrorResult = (enumValue: FaceTecInitializationError): void => {
    const displayMessage: string = Status.descriptionForInitializationError(enumValue);
    const logMessage: string = `AzifaceInitializationError: ${enumValue} "${displayMessage}"`;
    this.displayMessage(displayMessage);
    this.logMessage(logMessage);
  };

  public static logSessionStatusOnFaceTecExit = (sessionStatus: FaceTecSessionStatus): void => {
    let displayMessage: string = 'See logs for details';
    let logMessage: string = 'Unable to parse status message';

    if (sessionStatus != null) {
      if (sessionStatus === FaceTecSDK.FaceTecSessionStatus.LockedOut) {
        displayMessage = 'The device is locked out of FaceTec Browser SDK.';
      }

      logMessage = `AzifaceSessionResult.status: ${sessionStatus} - "${Status.descriptionForSessionStatus(sessionStatus)}"`;
    }

    this.displayMessage(displayMessage);
    this.logMessage(logMessage);
  };
}
