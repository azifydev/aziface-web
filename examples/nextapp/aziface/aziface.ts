import {
  FaceTecInitializationError,
  FaceTecSDKInstance,
  FaceTecSessionStatus,
} from '@/public/core/facetec/FaceTecPublicApi';
import { FaceTecSDK as FaceTecSDKType } from '@/public/core/facetec/FaceTecSDK';
import { SessionError } from './errors';
import { SessionRequestProcessor } from './request-processor';
import { applyTheme, getBackgroundColor } from './theme';
import { getInitializationErrorCauseByCode } from './utils';
import {
  Controller,
  DisposeCallback,
  Initialize,
  InitializeCallback,
  InitializeHeaders,
  MethodError,
  Style,
} from './types';

declare const FaceTecSDK: typeof FaceTecSDKType;

export class AzifaceController implements Controller {
  public static isInitialized: boolean = false;
  public static isDevelopment: boolean = false;
  private static latestExternalDatabaseRefID: string = '';
  public static deviceKeyIdentifier: string = '';
  public static baseUrl: string = '';
  public static headers: InitializeHeaders = {} as InitializeHeaders;
  private faceTecSDKInstance: FaceTecSDKInstance | null = null;

  public initialize = (
    init: Initialize,
    callback: InitializeCallback,
  ): void => {
    this.setupController(init);

    FaceTecSDK.setImagesDirectory('/core/images');
    FaceTecSDK.setResourceDirectory('/core/facetec/resources');

    applyTheme();

    if (AzifaceController.isInitialized) {
      callback({
        isSuccess: true,
        error: undefined,
      });
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
          this.onInitializationSuccess(newFaceTecSdkInstance);
          callback({
            isSuccess: true,
            error: undefined,
          });
        },
        onError: (initializationError: FaceTecInitializationError) => {
          this.onInitializationError();
          callback({
            isSuccess: false,
            error: {
              code: initializationError,
              cause: getInitializationErrorCauseByCode(initializationError),
            },
          });
        },
      },
    );
  };

  public dispose = (callback: DisposeCallback): void => {
    if (AzifaceController.isInitialized) {
      try {
        this.cleanup();
        FaceTecSDK.deinitialize(() => callback(true));
      } catch {
        AzifaceController.isInitialized = true;
        callback(false);
      }
    } else {
      AzifaceController.isInitialized = false;
      callback(true);
    }
  };

  public authenticate = (): void => {
    if (!AzifaceController.isInitialized || !this.faceTecSDKInstance) {
      throw new SessionError(MethodError.NotInitialized);
    }

    if (AzifaceController.latestExternalDatabaseRefID.length === 0) {
      throw new SessionError(MethodError.NoUserEnrolled);
    } else {
      const processor = this.makeSessionRequestProcessor();
      this.faceTecSDKInstance.start3DLivenessThen3DFaceMatch(processor);
      this.onAttach();
    }
  };

  public enroll = (): void => {
    if (!AzifaceController.isInitialized || !this.faceTecSDKInstance) {
      throw new SessionError(MethodError.NotInitialized);
    }

    AzifaceController.latestExternalDatabaseRefID =
      this.generateExternalDatabaseRefID();

    const processor = this.makeSessionRequestProcessor();
    this.faceTecSDKInstance.start3DLiveness(processor);
    this.onAttach();
  };

  public liveness = (): void => {
    if (!AzifaceController.isInitialized || !this.faceTecSDKInstance) {
      throw new SessionError(MethodError.NotInitialized);
    }

    AzifaceController.latestExternalDatabaseRefID = '';

    const processor = this.makeSessionRequestProcessor();
    this.faceTecSDKInstance.start3DLiveness(processor);
    this.onAttach();
  };

  public photoMatch = (): void => {
    if (!AzifaceController.isInitialized || !this.faceTecSDKInstance) {
      throw new SessionError(MethodError.NotInitialized);
    }

    AzifaceController.latestExternalDatabaseRefID =
      this.generateExternalDatabaseRefID();

    const processor = this.makeSessionRequestProcessor();
    this.faceTecSDKInstance.start3DLivenessThen3D2DPhotoIDMatch(processor);
    this.onAttach();
  };

  public photoScan = (): void => {
    if (!AzifaceController.isInitialized || !this.faceTecSDKInstance) {
      throw new SessionError(MethodError.NotInitialized);
    }

    AzifaceController.latestExternalDatabaseRefID =
      this.generateExternalDatabaseRefID();

    const processor = this.makeSessionRequestProcessor();
    this.faceTecSDKInstance.startIDScanOnly(processor);
    this.onAttach();
  };

  public withTheme = (overrides?: Style): void => applyTheme(overrides);

  private makeSessionRequestProcessor = (): SessionRequestProcessor =>
    new SessionRequestProcessor(
      AzifaceController.latestExternalDatabaseRefID,
      this.onComplete,
    );

  private setupController = (init: Initialize): void => {
    AzifaceController.deviceKeyIdentifier =
      init?.params?.deviceKeyIdentifier || '';
    AzifaceController.baseUrl = init?.params?.baseUrl || '';
    AzifaceController.isDevelopment = init?.params?.isDevelopment || false;
    AzifaceController.headers = init?.headers;
  };

  private cleanup = (): void => {
    AzifaceController.isInitialized = false;
    AzifaceController.isDevelopment = false;
    AzifaceController.latestExternalDatabaseRefID = '';
    AzifaceController.deviceKeyIdentifier = '';
    AzifaceController.baseUrl = '';
    AzifaceController.headers = {} as InitializeHeaders;

    this.withTheme();
  };

  private generateExternalDatabaseRefID = (): string =>
    'aziface_web_' + crypto.randomUUID();

  private onInitializationSuccess = (
    newFaceTecSdkInstance: FaceTecSDKInstance,
  ): void => {
    this.faceTecSDKInstance = newFaceTecSdkInstance;
    AzifaceController.isInitialized = true;
  };

  private onInitializationError = (): void => this.cleanup();

  private onComplete = (faceTecSessionStatus: FaceTecSessionStatus): void => {
    const isError =
      faceTecSessionStatus !== FaceTecSDK.FaceTecSessionStatus.SessionCompleted;
    if (isError) {
      throw new SessionError(faceTecSessionStatus);
    }
  };

  private onAttach = () => {
    const container = document.getElementById(
      'DOM_FT_PRIMARY_TOPLEVEL_mainContainer',
    );

    if (container) {
      container.style.backgroundColor = getBackgroundColor();
    } else {
      throw new SessionError(MethodError.NotInitialized);
    }
  };
}

const controller = new AzifaceController();

export function initialize(
  init: Initialize,
  callback: InitializeCallback,
): void {
  controller.initialize(init, callback);
}

export function dispose(callback: DisposeCallback): void {
  controller.dispose(callback);
}

export function enroll(): void {
  controller.enroll();
}

export function authenticate(): void {
  controller.authenticate();
}

export function liveness(): void {
  controller.liveness();
}

export function photoMatch(): void {
  controller.photoMatch();
}

export function photoScan(): void {
  controller.photoScan();
}

export function withTheme(overrides?: Style): void {
  controller.withTheme(overrides);
}

export function resetTheme(): void {
  controller.withTheme();
}
