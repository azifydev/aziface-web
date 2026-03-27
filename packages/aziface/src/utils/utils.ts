import { FaceTecInitializationError } from '../types/FaceTecPublicApi';
import { FaceTecSDK as FaceTecSDKType } from '../types/FaceTecSDK';
import { MethodError, SessionCode } from '../types/aziface';

declare const FaceTecSDK: typeof FaceTecSDKType;

export function getInitializationErrorCauseByCode(value: FaceTecInitializationError): string {
  switch (value) {
    case FaceTecSDK.FaceTecInitializationError.RejectedByServer:
      return 'The Aziface SDK Server could not validate this application.';
    case FaceTecSDK.FaceTecInitializationError.RequestAborted:
      return 'The provided FaceTecSessionRequestProcessor called abortOnCatastrophicError() and the application could not be validated.';
    case FaceTecSDK.FaceTecInitializationError.DeviceNotSupported:
      return 'This device/platform/browser/version combination is not supported by the Aziface Browser SDK.';
    case FaceTecSDK.FaceTecInitializationError.ResourcesCouldNotBeLoadedOnLastInit:
      return 'Aziface SDK could not load resources.';
    case FaceTecSDK.FaceTecInitializationError.GetUserMediaRemoteHTTPNotSupported:
      return 'Browser Camera APIs are only supported on localhost or https.';
    case FaceTecSDK.FaceTecInitializationError.UnknownInternalError:
      return 'An unknown and unexpected error occurred.';
    default:
      return 'An unknown and unexpected error occurred.';
  }
}

export function getSessionStatusCauseByCode(value: SessionCode): string {
  switch (value) {
    case FaceTecSDK.FaceTecSessionStatus.SessionCompleted:
      return 'The session was performed successfully.';
    case FaceTecSDK.FaceTecSessionStatus.RequestAborted:
      return 'The application called abortOnCatastrophicError().';
    case FaceTecSDK.FaceTecSessionStatus.UserCancelledFaceScan:
      return 'The user cancelled before performing enough Scans to Succeed.';
    case FaceTecSDK.FaceTecSessionStatus.UserCancelledIDScan:
      return 'The user cancelled before performing enough Scans to Complete.';
    case FaceTecSDK.FaceTecSessionStatus.LockedOut:
      return 'Aziface Browser SDK is in a lockout state.';
    case FaceTecSDK.FaceTecSessionStatus.CameraError:
      return 'Session cancelled because selected camera is not active.';
    case FaceTecSDK.FaceTecSessionStatus.CameraPermissionsDenied:
      return 'The user did not enable the camera after prompting for camera permissions or camera permissions were previously denied.';
    case FaceTecSDK.FaceTecSessionStatus.IFrameNotAllowedWithoutPermission:
      return 'The session was cancelled because you do not have permission to run the Aziface Browser SDK in an iFrame. Please contact Aziface to request the needed code';
    case FaceTecSDK.FaceTecSessionStatus.UnknownInternalError:
      return 'The session was cancelled because of an Unknown Error.';
    case MethodError.NotInitialized:
      return 'The SDK has not been initialized. Please initialize before attempting to call this method.';
    case MethodError.NoUserEnrolled:
      return 'No user enrolled. Please enroll a user before attempting to authenticate.';
    default:
      return 'The session was cancelled because of an Unknown Error.';
  }
}
