import {
  FaceTecInitializationError,
  FaceTecSDKInstance,
  FaceTecSessionStatus,
} from '../types/FaceTecPublicApi';
import { FaceTecSDK as FaceTecSDKType } from '../types/FaceTecSDK';
import { SessionError } from '../errors/errors';
import { SessionRequestProcessor } from '../services/request-processor';
import { applyTheme, getBackgroundColor } from '../styles/theme';
import { getInitializationErrorCauseByCode } from '../utils';
import {
  Controller,
  DisposeCallback,
  Initialize,
  InitializeCallback,
  InitializeHeaders,
  Locale,
  MethodError,
  Style,
} from '../types/aziface';
import { i18n } from '../i18n';

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

    FaceTecSDK.setImagesDirectory(`/core/images`);
    FaceTecSDK.setResourceDirectory(`/core/facetec/resources`);

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

  public authenticate = async (): Promise<boolean> => {
    return await this.decoratorAsync(instance => {
      if (AzifaceController.latestExternalDatabaseRefID.length === 0) {
        throw new SessionError(MethodError.NoUserEnrolled);
      } else {
        const processor = this.makeSessionRequestProcessor();
        instance.start3DLivenessThen3DFaceMatch(processor);
        this.onAttach();
      }
    });
  };

  public enroll = async (): Promise<boolean> => {
    return await this.decoratorAsync(instance => {
      AzifaceController.latestExternalDatabaseRefID =
        this.generateExternalDatabaseRefID();

      const processor = this.makeSessionRequestProcessor();
      instance.start3DLiveness(processor);
      this.onAttach();
    });
  };

  public liveness = async (): Promise<boolean> => {
    return await this.decoratorAsync(instance => {
      AzifaceController.latestExternalDatabaseRefID = '';

      const processor = this.makeSessionRequestProcessor();
      instance.start3DLiveness(processor);
      this.onAttach();
    });
  };

  public photoMatch = async (): Promise<boolean> => {
    return await this.decoratorAsync(instance => {
      AzifaceController.latestExternalDatabaseRefID =
        this.generateExternalDatabaseRefID();

      const processor = this.makeSessionRequestProcessor();
      instance.start3DLivenessThen3D2DPhotoIDMatch(processor);
      this.onAttach();
    });
  };

  public photoScan = async (): Promise<boolean> => {
    return await this.decoratorAsync(instance => {
      AzifaceController.latestExternalDatabaseRefID =
        this.generateExternalDatabaseRefID();

      const processor = this.makeSessionRequestProcessor();
      instance.startIDScanOnly(processor);
      this.onAttach();
    });
  };

  public withTheme = (overrides?: Style): void => applyTheme(overrides);

  public setLocale = (locale: Locale): void =>
    this.decoratorSync(() => FaceTecSDK.configureLocalization(i18n[locale]));

  private decoratorSync = (
    callback: (instance: FaceTecSDKInstance) => void,
  ): void => {
    if (!AzifaceController.isInitialized || !this.faceTecSDKInstance) {
      throw new SessionError(MethodError.NotInitialized);
    } else {
      callback(this.faceTecSDKInstance);
    }
  };

  private decoratorAsync = (
    callback: (instance: FaceTecSDKInstance) => void,
  ): Promise<boolean> => {
    return new Promise((resolve, reject) => {
      try {
        this.decoratorSync(callback);
        resolve(true);
      } catch (error) {
        reject(error);
      }
    });
  };

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
    `aziface_web_${crypto.randomUUID()}`;

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

export async function enroll(): Promise<boolean> {
  return await controller.enroll();
}

export async function authenticate(): Promise<boolean> {
  return await controller.authenticate();
}

export async function liveness(): Promise<boolean> {
  return await controller.liveness();
}

export async function photoMatch(): Promise<boolean> {
  return await controller.photoMatch();
}

export async function photoScan(): Promise<boolean> {
  return await controller.photoScan();
}

export function withTheme(overrides?: Style): void {
  controller.withTheme(overrides);
}

export function resetTheme(): void {
  controller.withTheme();
}

export function setLocale(locale: Locale): void {
  controller.setLocale(locale);
}
