import {
  FaceTecProcessor,
  FaceTecSessionResult,
  type FaceTecProcessorCallback,
} from '../public/core/facetec/FaceTecPublicApi';
import { Controller } from './Controller';
import { Networking } from './Networking';

export class Processor implements FaceTecProcessor {
  public onSessionRequest = (sessionRequestBlob: string, sessionRequestCallback: FaceTecProcessorCallback): void => {
    Networking.send(this, sessionRequestBlob, sessionRequestCallback);
  };

  public onResponseBlobReceived = (responseBlob: string, sessionRequestCallback: FaceTecProcessorCallback): void => {
    sessionRequestCallback.processResponse(responseBlob);
  };

  public onUploadProgress = (progress: number, sessionRequestCallback: FaceTecProcessorCallback): void => {
    sessionRequestCallback.updateProgress(progress);
  };

  public onCatastrophicNetworkError = (sessionRequestCallback: FaceTecProcessorCallback): void => {
    sessionRequestCallback.abortOnCatastrophicError();
  };

  public onFaceTecExit = (faceTecSessionResult: FaceTecSessionResult): void => {
    Controller.demonstrateHandlingFaceTecExit(faceTecSessionResult);
  };
}
