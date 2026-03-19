import {
  FaceTecSessionRequestProcessorCallback,
  FaceTecSessionResult,
  FaceTecSessionStatus,
} from '../../public/core/facetec/FaceTecPublicApi';
import { FaceTecTestingAPINetworkingRequest } from './networking-request';

export class SessionRequestProcessor {
  // Save the FaceTec SDK request callback so it can be accessed in the helper methods
  public requestCallback!: FaceTecSessionRequestProcessorCallback;
  // Save the onCompleteCallback
  public onCompleteCallback: (
    faceTecSessionStatus: FaceTecSessionStatus,
  ) => void;
  public onOfficialIDPhotoCallback?: (image: string) => void;
  // ** Important Note: **
  // The API parameter demonstrationExternalDatabaseRefID is developer-defined and created and set by you using your own business logic.
  // The FaceTec Sample App demonstrates generating the demonstrationExternalDatabaseRefID for demonstration purposes.
  // In production, you should be generating and managing demonstrationExternalDatabaseRefID in your server-side code.
  // To Re-Verify Users, demonstrationExternalDatabaseRefID should be fetched with backend logic and used as a parameter for matching.
  // If you expose demonstrationExternalDatabaseRefIDs in your front-end code, you will potentially allow for attacks where demonstrationExternalDatabaseRefID can be
  // sniffed and/or guessed and allow potential attackers to attempt Sessions against demonstrationExternalDatabaseRefIDs that they can attempt to guess.
  //
  // Save the demonstrationExternalDatabaseRefID for the sessionRequest
  public demonstrationExternalDatabaseRefID: string;

  public constructor(
    demonstrationExternalDatabaseRefID: string,
    onCompleteCallback: (faceTecSessionStatus: FaceTecSessionStatus) => void,
    onOfficialIDPhotoCallback?: (image: string) => void,
  ) {
    this.demonstrationExternalDatabaseRefID =
      demonstrationExternalDatabaseRefID;
    this.onCompleteCallback = onCompleteCallback;
    this.onOfficialIDPhotoCallback = onOfficialIDPhotoCallback;
  }

  // This method gets called from inside the FaceTecSDK when some server side process is needed to continue processing
  public onSessionRequest = (
    requestBlob: string,
    requestCallback: FaceTecSessionRequestProcessorCallback,
  ): void => {
    // Create the simple payload to send to the networking class
    const sessionRequestProcessorPayload: {
      requestBlob: string;
      externalDatabaseRefID: string;
    } = {
      requestBlob: requestBlob,
      externalDatabaseRefID: this.demonstrationExternalDatabaseRefID,
    };

    // Here you will call your implementation of networking that communicates through your middleware that contacts your server code
    // Send the payload to the FaceTecTestingAPI for processing
    new FaceTecTestingAPINetworkingRequest().send(
      sessionRequestProcessorPayload,
      requestCallback,
    );
  };

  // Session is completely done
  public onFaceTecExit = (sessionResult: FaceTecSessionResult): void => {
    this.onCompleteCallback(sessionResult.status);
  };
}
