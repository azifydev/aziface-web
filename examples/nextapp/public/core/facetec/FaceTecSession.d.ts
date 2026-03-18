import { FaceTecSDKInstance, FaceTecProcessor } from './FaceTecPublicApi';
export declare class FaceTecSDKInstanceImpl implements FaceTecSDKInstance {
  start3DLiveness(Processor: FaceTecProcessor): void;
  start3DLivenessThen3DFaceMatch(Processor: FaceTecProcessor): void;
  startIDScanOnly(Processor: FaceTecProcessor): void;
  startIDScanThen3D2DMatch(Processor: FaceTecProcessor): void;
  start3DLivenessThen3D2DPhotoIDMatch(Processor: FaceTecProcessor): void;
  startSecureOfficialIDPhotoCapture(Processor: FaceTecProcessor): void;
  private static startSession;
}
//# sourceMappingURL=FaceTecSession.d.ts.map
