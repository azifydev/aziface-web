import { FaceTecSDK as FaceTecSDKType } from '../types/FaceTecSDK';
import type { FaceTecSessionRequestProcessorCallback } from '../types/FaceTecPublicApi';

declare const FaceTecSDK: typeof FaceTecSDKType;

import { AzifaceController } from '../module/aziface';

// Sample class for handling networking calls needed in order for FaceTec to function correctly.
// In Your App, please use the networking constructs and protocols that meet your security requirements.
//
// Notes:
// - Adding additional logic to this code is not allowed.  Do not add any additional logic outside of what is demonstrated in this Sample.
// - Adding additional asynchronous calls to this code is not allowed.  Only make your own additional asynchronous calls once the FaceTec UI is closed.
// - Adding code that modifies any App UI (Yours or FaceTec's) is not allowed.  Only add code that modifies your own App UI once the FaceTec UI is closed.
export class FaceTecTestingAPINetworkingRequest {
  public TESTING_API_ENDPOINT: string = '/process-request';
  protected request!: XMLHttpRequest;
  protected requestTypeString: string = 'POST';

  public constructor() {
    this.request = new XMLHttpRequest();
  }

  //
  // Step 1: Construct the payload.
  //
  // - The payload contains the Session Request Blob
  // - Please see the notes below about correctly handling externalDatabaseRefID for certain call types.
  //
  public send = (
    faceTecTestingAPIPayload: {
      requestBlob: string;
      externalDatabaseRefID: string;
    },
    requestCallback: FaceTecSessionRequestProcessorCallback,
  ): void => {
    //
    // Step 2: Set up the networking request.
    //
    // - This Sample App demonstrates making calls to the FaceTec Testing API by default.
    // - In Your App, please use the webservice endpoint you have set up that accepts networking requests from Your App.
    // - In Your Webservice, build an endpoint that takes incoming requests, and forwards them to FaceTec Server.
    // - This code should never call your server directly. It should contact middleware you have created that forwards requests to your server.
    //
    this.request.open(this.requestTypeString, AzifaceController.baseUrl);
    this.request.setRequestHeader('Content-Type', 'application/json');

    // Developer Note: This is ONLY needed for calls to the FaceTec Testing API.
    // You should remove this when using Your App connected to Your Webservice + FaceTec Server
    this.request.setRequestHeader('X-Device-Key', AzifaceController.deviceKeyIdentifier);
    // Developer Note: This is ONLY needed for calls to the FaceTec Testing API.
    // You should remove this when using Your App connected to Your Webservice + FaceTec Server
    if (AzifaceController.isDevelopment) {
      this.request.setRequestHeader('X-Testing-API-Header', FaceTecSDK.getTestingAPIHeader());
    }

    Object.entries(AzifaceController.headers).forEach(([key, value]) => {
      if (value) {
        this.request.setRequestHeader(key, value);
      }
    });

    //
    // Step 3: Make the API Call, and handle the response.
    //
    // - Unless there is a networking error, or an error in your webservice or infrastructure, the Response Blob is retrieved and passed back into processResponse.
    // - For error cases, abortOnCatastrophicError is called as this would indicate a networking issue on the User device or network, or an error in Your Webservice.
    //
    this.request.onload = (): void => {
      //
      // Step 4:  Get the Response Blob and call processResponse on the Session Request Callback.
      //
      // - Call a convenience function that either gets a valid Response Blob, or handles the error and returns null.
      // - Checks for null, indicating an error was detected and handled.
      //
      switch (this.request.status) {
        case 200:
          try {
            this.processResponse(requestCallback.processResponse);
          } catch {
            // You may want to implement some sort of retry logic here
            // This should never be called except when a hard server error occurs. For example the user loses network connectivity.
            requestCallback.abortOnCatastrophicError();
          }

          break;

        // Handle other network status codes here as appropriate

        default:
          // You may want to implement some sort of retry logic here
          // This should never be called except when a hard server error occurs. For example the user loses network connectivity.

          requestCallback.abortOnCatastrophicError();
      }
    };

    // On catastrophic error call the onCatastrophicNetworkError handler
    // This should never be called except when a hard server error occurs. For example the user loses network connectivity.
    // You may want to implement some sort of retry logic here
    this.request.onerror = (): void => {
      requestCallback.abortOnCatastrophicError();
    };

    this.request.upload.onprogress = (ev: ProgressEvent): void => {
      // Developer Note: With the Sample Networking library in this Sample App,
      // this code demonstrates getting the networking request progress and making
      // the appropriate call in the FaceTec Device SDK to update the upload progress.
      // This is how the FaceTec Upload Progress Bar gets changed.
      requestCallback.updateProgress(ev.loaded / ev.total);
    };

    // Send the payload
    if (typeof faceTecTestingAPIPayload === 'object' && Object.keys(faceTecTestingAPIPayload).length > 0) {
      const faceTecTestingAPIPayloadJSON = JSON.parse(JSON.stringify(faceTecTestingAPIPayload));

      if (faceTecTestingAPIPayload.externalDatabaseRefID.length === 0) {
        delete faceTecTestingAPIPayloadJSON.externalDatabaseRefID;
      }

      this.request.send(JSON.stringify(faceTecTestingAPIPayloadJSON));
    } else {
      this.request.send();
    }
  };

  public processResponse = (onResponseBlobReceived: (responseBlob: string) => void): void => {
    const parsedResponse: {
      responseBlob: string;
      result?: { [key: string]: string | undefined };
    } = JSON.parse(this.request.responseText);

    const responseBlob: string = parsedResponse.responseBlob;
    onResponseBlobReceived(responseBlob);
  };
}
