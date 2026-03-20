import { Style } from '@/types/aziface.types';
import { FaceTecSDK as FaceTecSDKType } from '../../public/core/facetec/FaceTecSDK';

declare const FaceTecSDK: typeof FaceTecSDKType;

function retrieveConfigurationWizardCustomization(theme?: Style) {
  const sdkImageDirectory = '/core/images/';
  // For Color Customization
  const outerBackgroundColor = theme?.backgroundColor || '#FFFFFF';
  const frameColor = theme?.frameColor || '#FFFFFF';
  const borderColor = theme?.borderColor || '#026FF4';
  const ovalColor = theme?.ovalColor || '#026FF4';
  const dualSpinnerColor = theme?.dualSpinnerColor || '#026FF4';
  const textColor = theme?.textColor || '#026FF4';
  const buttonAndFeedbackBarColor =
    theme?.buttonAndFeedbackBarColor || '#026FF4';
  const buttonAndFeedbackBarTextColor =
    theme?.buttonAndFeedbackBarTextColor || '#FFFFFF';
  const buttonColorHighlight = theme?.buttonColorHighlight || '#0264DC';
  const buttonColorDisabled = theme?.buttonColorDisabled || '#B3D4FC';

  // For Frame Corner Radius Customization
  const frameCornerRadius = theme?.frameCornerRadius || '20px';

  // For Cancel Button Customization
  const cancelButtonImage =
    sdkImageDirectory + (theme?.cancelImage || 'FaceTec_cancel.png');
  const cancelButtonLocation = FaceTecSDK.FaceTecCancelButtonLocation.TopLeft;

  // For Image Customization
  const yourAppLogoImage =
    sdkImageDirectory + (theme?.brandingImage || 'FaceTec_your_app_logo.png');
  const securityWatermarkImage =
    FaceTecSDK.FaceTecSecurityWatermarkImage.FaceTec;

  // Set a Default Customization
  const defaultCustomization = new FaceTecSDK.FaceTecCustomization();

  // Set Frame Customization
  defaultCustomization.frameCustomization.borderCornerRadius =
    frameCornerRadius;
  defaultCustomization.frameCustomization.backgroundColor = frameColor;
  defaultCustomization.frameCustomization.borderColor = borderColor;

  // Set Overlay Customization
  defaultCustomization.overlayCustomization.brandingImage = yourAppLogoImage;
  defaultCustomization.overlayCustomization.backgroundColor =
    outerBackgroundColor;

  // Set Guidance Customization
  defaultCustomization.guidanceCustomization.backgroundColors = frameColor;
  defaultCustomization.guidanceCustomization.foregroundColor = textColor;
  defaultCustomization.guidanceCustomization.buttonBackgroundNormalColor =
    buttonAndFeedbackBarColor;
  defaultCustomization.guidanceCustomization.buttonBackgroundDisabledColor =
    buttonColorDisabled;
  defaultCustomization.guidanceCustomization.buttonBackgroundHighlightColor =
    buttonColorHighlight;
  defaultCustomization.guidanceCustomization.buttonTextNormalColor =
    buttonAndFeedbackBarTextColor;
  defaultCustomization.guidanceCustomization.buttonTextDisabledColor =
    buttonAndFeedbackBarTextColor;
  defaultCustomization.guidanceCustomization.buttonTextHighlightColor =
    buttonAndFeedbackBarTextColor;
  defaultCustomization.guidanceCustomization.retryScreenImageBorderColor =
    borderColor;
  defaultCustomization.guidanceCustomization.retryScreenOvalStrokeColor =
    borderColor;

  // Set Oval Customization
  defaultCustomization.ovalCustomization.strokeColor = ovalColor;
  defaultCustomization.ovalCustomization.progressColor1 = dualSpinnerColor;
  defaultCustomization.ovalCustomization.progressColor2 = dualSpinnerColor;

  // Set Feedback Customization
  defaultCustomization.feedbackCustomization.backgroundColor =
    buttonAndFeedbackBarColor;
  defaultCustomization.feedbackCustomization.textColor =
    buttonAndFeedbackBarTextColor;

  // Set Cancel Customization
  defaultCustomization.cancelButtonCustomization.customImage =
    cancelButtonImage;
  defaultCustomization.cancelButtonCustomization.location =
    cancelButtonLocation;

  // Set Security Watermark Customization
  defaultCustomization.securityWatermarkCustomization.setSecurityWatermarkImage(
    securityWatermarkImage,
  );

  // Set Result Screen Customization
  defaultCustomization.resultScreenCustomization.backgroundColors = frameColor;
  defaultCustomization.resultScreenCustomization.foregroundColor = textColor;
  defaultCustomization.resultScreenCustomization.activityIndicatorColor =
    buttonAndFeedbackBarColor;
  defaultCustomization.resultScreenCustomization.resultAnimationBackgroundColor =
    buttonAndFeedbackBarColor;
  defaultCustomization.resultScreenCustomization.resultAnimationForegroundColor =
    buttonAndFeedbackBarTextColor;
  defaultCustomization.resultScreenCustomization.uploadProgressFillColor =
    buttonAndFeedbackBarColor;

  // Set ID Scan Customization
  defaultCustomization.idScanCustomization.selectionScreenBackgroundColors =
    frameColor;
  defaultCustomization.idScanCustomization.selectionScreenForegroundColor =
    textColor;
  defaultCustomization.idScanCustomization.reviewScreenBackgroundColors =
    frameColor;
  defaultCustomization.idScanCustomization.reviewScreenForegroundColor =
    buttonAndFeedbackBarTextColor;
  defaultCustomization.idScanCustomization.reviewScreenTextBackgroundColor =
    buttonAndFeedbackBarColor;
  defaultCustomization.idScanCustomization.captureScreenForegroundColor =
    buttonAndFeedbackBarTextColor;
  defaultCustomization.idScanCustomization.captureScreenTextBackgroundColor =
    buttonAndFeedbackBarColor;
  defaultCustomization.idScanCustomization.buttonBackgroundNormalColor =
    buttonAndFeedbackBarColor;
  defaultCustomization.idScanCustomization.buttonBackgroundDisabledColor =
    buttonColorDisabled;
  defaultCustomization.idScanCustomization.buttonBackgroundHighlightColor =
    buttonColorHighlight;
  defaultCustomization.idScanCustomization.buttonTextNormalColor =
    buttonAndFeedbackBarTextColor;
  defaultCustomization.idScanCustomization.buttonTextDisabledColor =
    buttonAndFeedbackBarTextColor;
  defaultCustomization.idScanCustomization.buttonTextHighlightColor =
    buttonAndFeedbackBarTextColor;
  defaultCustomization.idScanCustomization.captureScreenBackgroundColor =
    frameColor;
  defaultCustomization.idScanCustomization.captureFrameStrokeColor =
    borderColor;

  // Set Initial Loading Customization
  defaultCustomization.initialLoadingAnimationCustomization.backgroundColor =
    buttonAndFeedbackBarTextColor;
  defaultCustomization.initialLoadingAnimationCustomization.foregroundColor =
    buttonAndFeedbackBarColor;

  return defaultCustomization;
}

export function applyTheme(theme?: Style): void {
  const currentCustomization = retrieveConfigurationWizardCustomization(theme);

  FaceTecSDK.setCustomization(currentCustomization);
  FaceTecSDK.setLowLightCustomization(currentCustomization);
  FaceTecSDK.setDynamicDimmingCustomization(currentCustomization);
}
