/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { FaceTecProcessorCallback } from '../public/core/facetec/FaceTecPublicApi';
import { Controller } from './Controller';
import { Processor } from './Processor';
import { Messages } from './Messages';
import { InitializeRequest } from '@/types/aziface.types';
const FaceTecSDK = typeof window !== 'undefined' ? (window as any).FaceTecSDK : undefined;

export class Networking {
  private static readonly MAX_ERRORS_ALLOWED = 2;

  public static send = (
    referencingProcessor: Processor,
    sessionRequestBlob: string,
    sessionRequestCallback: FaceTecProcessorCallback,
  ): void => {
    Messages.logMessage(sessionRequestBlob);
    const sessionRequestCallPayload: { requestBlob: string; externalDatabaseRefID?: string } = {
      requestBlob: sessionRequestBlob,
    };

    if (Controller.demonstrationExternalDatabaseRefID !== '') {
      sessionRequestCallPayload.externalDatabaseRefID = Controller.demonstrationExternalDatabaseRefID;
    }

    const request: XMLHttpRequest = new XMLHttpRequest();
    request.timeout = 2 * 60 * 1000;

    function openAndSendRequest() {
      request.open('POST', Controller.baseURL);
      request.setRequestHeader('Content-Type', 'application/json');
      request.setRequestHeader('X-Device-Key', Controller.deviceKeyIdentifier);
      // request.setRequestHeader('X-Testing-API-Header', FaceTecSDK.getTestingAPIHeader());
      request.setRequestHeader('x-token-bearer', Controller.apiKey);
      request.send(JSON.stringify(sessionRequestCallPayload));
    }

    let errorCount = 0;

    request.onload = (): void => {
      const responseBlob: string | null = this.getResponseBlobOrHandleError(request);
      if (responseBlob !== null) {
        referencingProcessor.onResponseBlobReceived(responseBlob, sessionRequestCallback);
      } else {
        referencingProcessor.onCatastrophicNetworkError(sessionRequestCallback);
      }
    };

    request.onerror = (ev: ProgressEvent): void => {
      if (errorCount < Networking.MAX_ERRORS_ALLOWED) {
        errorCount++;
        setTimeout(openAndSendRequest, errorCount * 1000);
        return;
      }

      Messages.logMessage(`Networking >> request.onerror >> Catastrophic error: ${ev}`);
      referencingProcessor.onCatastrophicNetworkError(sessionRequestCallback);
    };

    request.upload.onprogress = (ev: ProgressEvent): void => {
      referencingProcessor.onUploadProgress(ev.loaded / ev.total, sessionRequestCallback);
    };

    openAndSendRequest();
  };

  private static getResponseBlobOrHandleError = (request: XMLHttpRequest): string | null => {
    if (request.status === 200) {
      try {
        const parsedResponse: { responseBlob: string; result?: { [key: string]: string | undefined } } = JSON.parse(
          request.responseText,
        );
        this.storeOfficialIDPhotoIfApplicable(parsedResponse);

        return parsedResponse.responseBlob;
      } catch (e) {
        Messages.logMessage(`Networking >> request.onload >> Failed to parse responseText: ${e}`);
      }
    } else {
      Messages.logMessage(`Networking >> request.onload >> Server Status: ${request.status}`);
    }

    return null;
  };

  private static storeOfficialIDPhotoIfApplicable = (parsedResponse: {
    responseBlob: string;
    result?: { [key: string]: string | undefined };
  }): void => {
    if (
      parsedResponse.result !== undefined &&
      typeof parsedResponse.result.officialIDPhotoImage === 'string' &&
      parsedResponse.result.officialIDPhotoImage !== ''
    ) {
      Controller.latestOfficialIDPhoto = parsedResponse.result.officialIDPhotoImage;
    }
  };
}
