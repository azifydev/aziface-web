import {
  FaceTecInitializationError,
  FaceTecSDKInstance,
  FaceTecSessionRequestProcessor,
  FaceTecSessionStatus,
} from '../../public/core/facetec/FaceTecPublicApi';
import { FaceTecSDK as FaceTecSDKType } from '../../public/core/facetec/FaceTecSDK';
import {
  Controller,
  Initialize,
  Headers,
  InitializeCallback,
  DisposeCallback,
} from '../../types/aziface.types';
import { SessionRequestProcessor } from './request-processor';

declare const FaceTecSDK: typeof FaceTecSDKType;

export class AzifaceController implements Controller {
  private static latestExternalDatabaseRefID: string = '';
  public static isInitialized: boolean = false;
  public static isDevelopment: boolean = false;
  public static deviceKeyIdentifier: string = '';
  public static baseUrl: string = '';
  public static headers: Headers = {} as Headers;
  private faceTecSDKInstance: FaceTecSDKInstance | null = null;

  public initialize = (
    init: Initialize,
    callback: InitializeCallback,
  ): void => {
    this.setupController(init);

    FaceTecSDK.setImagesDirectory('/core/images');
    FaceTecSDK.setResourceDirectory('/core/facetec/resources');

    if (AzifaceController.isInitialized) {
      callback(true);
      return;
    }

    const sessionRequestProcessor: SessionRequestProcessor =
      new SessionRequestProcessor(
        this.generateExternalDatabaseRefID(),
        this.onComplete,
      );

    FaceTecSDK.initializeWithSessionRequest(
      AzifaceController.deviceKeyIdentifier,
      sessionRequestProcessor,
      {
        onSuccess: (newFaceTecSdkInstance: FaceTecSDKInstance) => {
          this.faceTecSDKInstance = newFaceTecSdkInstance;
          console.log('Initialized Successfully.');
          AzifaceController.isInitialized = true;
          callback(true);
        },
        onError: (initializationError: FaceTecInitializationError) => {
          if (
            initializationError ===
            FaceTecSDK.FaceTecInitializationError.RequestAborted
          ) {
            console.log('Initialization request was aborted.');
          }

          console.log(`Initialization Error: ${initializationError}`);
          AzifaceController.isInitialized = false;
          callback(false);
        },
      },
    );
  };

  public dispose = (callback: DisposeCallback): void => {
    if (AzifaceController.isInitialized) {
      try {
        AzifaceController.isInitialized = false;
        FaceTecSDK.deinitialize(() => callback(true));
      } catch (error) {
        AzifaceController.isInitialized = true;
        console.error('Error during FaceTec SDK dispose:', error);
        callback(false);
      }
    } else {
      AzifaceController.isInitialized = false;
      console.warn('FaceTec SDK is not initialized. No need to dispose.');
      callback(true);
    }
  };

  public authenticate = (): void => {
    if (!AzifaceController.isInitialized) {
      console.error(
        'FaceTec SDK is not initialized. Please initialize before attempting to authenticate.',
      );
      return;
    }

    if (AzifaceController.latestExternalDatabaseRefID.length === 0) {
      console.error(
        'No user enrolled. Please enroll a user before attempting to authenticate.',
      );
      return;
    } else {
      const sessionRequestProcessor: FaceTecSessionRequestProcessor =
        new SessionRequestProcessor(
          AzifaceController.latestExternalDatabaseRefID,
          this.onComplete,
        );
      this.faceTecSDKInstance?.start3DLivenessThen3DFaceMatch(
        sessionRequestProcessor,
      );
    }
  };

  public enroll = (): void => {
    if (!AzifaceController.isInitialized) {
      console.error(
        'FaceTec SDK is not initialized. Please initialize before attempting to enroll.',
      );
      return;
    }

    AzifaceController.latestExternalDatabaseRefID =
      this.generateExternalDatabaseRefID();

    const sessionRequestProcessor: FaceTecSessionRequestProcessor =
      new SessionRequestProcessor(
        AzifaceController.latestExternalDatabaseRefID,
        this.onComplete,
      );
    this.faceTecSDKInstance?.start3DLiveness(sessionRequestProcessor);
  };

  public liveness = (): void => {
    if (!AzifaceController.isInitialized) {
      console.error(
        'FaceTec SDK is not initialized. Please initialize before attempting to authenticate.',
      );
      return;
    }

    AzifaceController.latestExternalDatabaseRefID = '';

    const sessionRequestProcessor: FaceTecSessionRequestProcessor =
      new SessionRequestProcessor(
        AzifaceController.latestExternalDatabaseRefID,
        this.onComplete,
      );
    this.faceTecSDKInstance?.start3DLiveness(sessionRequestProcessor);
  };

  public photoMatch = (): void => {
    if (!AzifaceController.isInitialized) {
      console.error(
        'FaceTec SDK is not initialized. Please initialize before attempting to authenticate.',
      );
      return;
    }

    AzifaceController.latestExternalDatabaseRefID =
      this.generateExternalDatabaseRefID();

    const sessionRequestProcessor: FaceTecSessionRequestProcessor =
      new SessionRequestProcessor(
        AzifaceController.latestExternalDatabaseRefID,
        this.onComplete,
      );
    if (this.faceTecSDKInstance) {
      this.faceTecSDKInstance.start3DLivenessThen3D2DPhotoIDMatch(
        sessionRequestProcessor,
      );
    }
  };

  public photoScan = (): void => {
    if (!AzifaceController.isInitialized) {
      console.error(
        'FaceTec SDK is not initialized. Please initialize before attempting to authenticate.',
      );
      return;
    }

    AzifaceController.latestExternalDatabaseRefID =
      this.generateExternalDatabaseRefID();

    const sessionRequestProcessor: FaceTecSessionRequestProcessor =
      new SessionRequestProcessor(
        AzifaceController.latestExternalDatabaseRefID,
        this.onComplete,
      );
    this.faceTecSDKInstance?.startIDScanOnly(sessionRequestProcessor);
  };

  private setupController = (init: Initialize): void => {
    AzifaceController.deviceKeyIdentifier =
      init?.params?.deviceKeyIdentifier || '';
    AzifaceController.baseUrl = init?.params?.baseUrl || '';
    AzifaceController.isDevelopment = init?.params?.isDevelopment || false;
    AzifaceController.headers = init?.headers;
  };

  private generateExternalDatabaseRefID = (): string =>
    'aziface_web_' + crypto.randomUUID();

  private onComplete = (faceTecSessionStatus: FaceTecSessionStatus): void => {
    if (
      faceTecSessionStatus === FaceTecSDK.FaceTecSessionStatus.SessionCompleted
    ) {
      console.log('Session was performed successfully.');
    } else {
      console.log('Session status:', faceTecSessionStatus);
    }
  };
}
