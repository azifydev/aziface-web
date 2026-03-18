/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-ts-comment */
'use client';
import { Config } from './Config';
import { Theme } from './Theme';
import {
  FaceTecInitializationError,
  FaceTecSessionResult,
  type FaceTecSDKInstance,
} from '../public/core/facetec/FaceTecPublicApi';
import { Messages } from './Messages';
import { Processor } from './Processor';
import { Sound } from './Sound';
import ocrLocalizationJSON from '../public/ocr/FaceTec_OCR_Customization.json';
import { InitializeRequest } from '@/types/aziface.types';

const FaceTecSDK = typeof window !== 'undefined' ? (window as any).FaceTecSDK : undefined;
export class Controller {
  private Theme: Theme = new Theme();
  public static baseURL: string = '';
  public static deviceKeyIdentifier: string = '';
  public static apiKey: string = '';
  private faceTecSDK!: FaceTecSDKInstance;
  public static latestOfficialIDPhoto: string = '';
  public static demonstrationExternalDatabaseRefID: string = '';

  public initialize = (params: InitializeRequest): boolean => {
    FaceTecSDK.setResourceDirectory('/core/facetec/resources');
    FaceTecSDK.setImagesDirectory('/core/images');
    Controller.deviceKeyIdentifier = params.params.deviceKeyIdentifier;
    Controller.baseURL = params.params.baseUrl;
    Controller.apiKey = params.headers?.['x-token-bearer'] || '';
    FaceTecSDK.initializeWithSessionRequest(params.params.deviceKeyIdentifier, new Processor(), {
      onSuccess: (fc: FaceTecSDKInstance) => {
        this.faceTecSDK = fc;
        this.onFaceTecSDKInitializationSuccess();
        return true;
      },
      onError: (init: FaceTecInitializationError) => {
        this.onFaceTecSDKInitializationFailure(init);
        return false;
      },
    });
    return true;
  };
  public static setVocalGuidanceSoundFiles(): void {
    const soundFileUtilities: Sound = new Sound();
    Config.currentCustomization = soundFileUtilities.setVocalGuidanceSoundFiles(Config.currentCustomization);
    FaceTecSDK.setCustomization(Config.currentCustomization);
  }

  public static setOCRLocalization(): void {
    FaceTecSDK.configureOCRLocalization(ocrLocalizationJSON);
  }

  private onFaceTecSDKInitializationSuccess = (): void => {
    this.Theme.setAppTheme(this.Theme.getCurrentTheme());
    // Utils.setVocalGuidanceSoundFiles();
    // Utils.setOCRLocalization();
    Messages.logAndDisplayMessage('Initialized Successfully.');
  };

  private onFaceTecSDKInitializationFailure = (initializationError: FaceTecInitializationError): void => {
    Messages.logInitializationErrorResult(initializationError);
  };

  public liveness = (): void => {
    Controller.demonstrationExternalDatabaseRefID = '';
    this.faceTecSDK.start3DLiveness(new Processor());
  };

  public enroll = (): void => {
    Controller.demonstrationExternalDatabaseRefID = this.generateExternalDatabaseRefID();
    this.faceTecSDK.start3DLiveness(new Processor());
  };

  public onVerifyUserPressed = (): void => {
    if (Controller.demonstrationExternalDatabaseRefID.length === 0) {
      Messages.logAndDisplayMessage('Please enroll first before trying verification.');
    } else {
      this.faceTecSDK.start3DLivenessThen3DFaceMatch(new Processor());
    }
  };

  public photoIDMatch = (): void => {
    Controller.demonstrationExternalDatabaseRefID = this.generateExternalDatabaseRefID();
    this.faceTecSDK.start3DLivenessThen3D2DPhotoIDMatch(new Processor());
  };

  public photoIDScanOnly = (): void => {
    Controller.demonstrationExternalDatabaseRefID = this.generateExternalDatabaseRefID();
    this.faceTecSDK.startIDScanOnly(new Processor());
  };

  public onContinueOfficialIDPhotoPressed = (): void => {
    Controller.demonstrationExternalDatabaseRefID = this.generateExternalDatabaseRefID();
    this.faceTecSDK.startSecureOfficialIDPhotoCapture(new Processor());
  };

  public onCancelOfficialIDPhotoPressed = (): void => {
    Controller.demonstrationExternalDatabaseRefID = '';
    Controller.latestOfficialIDPhoto = '';
  };

  public onDownloadOfficialIDPhotoPressed = (): void => {
    const dateTimeNow: Date = new Date();
    const dateTimeNowArray: string[] = new Date(dateTimeNow.getTime() - dateTimeNow.getTimezoneOffset() * 60 * 1000)
      .toISOString()
      .split('T');
    const formattedDate: string = `${dateTimeNowArray[0]}`;
    const downloadLink: HTMLAnchorElement = document.createElement('a');
    downloadLink.href = `data:image/jpeg;base64, ${Controller.latestOfficialIDPhoto}`;
    downloadLink.download = `FaceTec_Generated_Official_ID_Photo_${formattedDate}_${crypto.randomUUID().substring(0, 8)}.jpg`;
    downloadLink.click();
  };

  public onDesignShowcasePressed(): void {
    this.Theme.showNewTheme();
  }

  public generateUUId(): string {
    // @ts-ignore
    return ('' + [1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c) => {
      // @ts-ignore
      return (c ^ (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))).toString(16);
    });
  }
  private generateExternalDatabaseRefID = (): string => {
    return 'aziface_web_' + this.generateUUId();
    // return 'aziface_web_001';
  };

  public static demonstrateHandlingFaceTecExit = (FaceTecSessionResult: FaceTecSessionResult): void => {
    Messages.logSessionStatusOnFaceTecExit(FaceTecSessionResult.status);
    if (!FaceTecSDK) return;
    if (FaceTecSessionResult.status === FaceTecSDK.FaceTecSessionStatus.SessionCompleted) {
      if (Controller.latestOfficialIDPhoto.length > 0) {
        return;
      }
    } else {
      Controller.demonstrationExternalDatabaseRefID = '';
      Controller.latestOfficialIDPhoto = '';
    }
  };
}
