'use client';
/* eslint-disable @typescript-eslint/no-explicit-any */
export const Config = (function () {
  function retrieveConfigurationWizardCustomization(FaceTecSDK: any) {
    const sdkImageDirectory = '/core/images/';
    // For Color Customization
    const outerBackgroundColor = '#ffffff';
    const frameColor = '#ffffff';
    const borderColor = '#417FB2';
    const ovalColor = '#417FB2';
    const dualSpinnerColor = '#417FB2';
    const textColor = '#417FB2';
    const buttonAndFeedbackBarColor = '#417FB2';
    const buttonAndFeedbackBarTextColor = '#ffffff';
    const buttonColorHighlight = '#396E99';
    const buttonColorDisabled = '#B9CCDE';

    // For Frame Corner Radius Customization
    const frameCornerRadius = '20px';

    // For Cancel Button Customization
    const cancelButtonImage = sdkImageDirectory + 'FaceTec_cancel.png';
    const cancelButtonLocation = FaceTecSDK.FaceTecCancelButtonLocation.TopLeft;

    // For Image Customization
    const yourAppLogoImage = sdkImageDirectory + 'FaceTec_your_app_logo.png';
    const securityWatermarkImage = FaceTecSDK.FaceTecSecurityWatermarkImage.FaceTec;

    // Set a Default Customization
    const defaultCustomization = new FaceTecSDK.FaceTecCustomization();

    // Set Frame Customization
    defaultCustomization.frameCustomization.borderCornerRadius = frameCornerRadius;
    defaultCustomization.frameCustomization.backgroundColor = frameColor;
    defaultCustomization.frameCustomization.borderColor = borderColor;

    // Set Overlay Customization
    defaultCustomization.overlayCustomization.brandingImage = yourAppLogoImage;
    defaultCustomization.overlayCustomization.backgroundColor = outerBackgroundColor;

    // Set Guidance Customization
    defaultCustomization.guidanceCustomization.backgroundColors = frameColor;
    defaultCustomization.guidanceCustomization.foregroundColor = textColor;
    defaultCustomization.guidanceCustomization.buttonBackgroundNormalColor = buttonAndFeedbackBarColor;
    defaultCustomization.guidanceCustomization.buttonBackgroundDisabledColor = buttonColorDisabled;
    defaultCustomization.guidanceCustomization.buttonBackgroundHighlightColor = buttonColorHighlight;
    defaultCustomization.guidanceCustomization.buttonTextNormalColor = buttonAndFeedbackBarTextColor;
    defaultCustomization.guidanceCustomization.buttonTextDisabledColor = buttonAndFeedbackBarTextColor;
    defaultCustomization.guidanceCustomization.buttonTextHighlightColor = buttonAndFeedbackBarTextColor;
    defaultCustomization.guidanceCustomization.retryScreenImageBorderColor = borderColor;
    defaultCustomization.guidanceCustomization.retryScreenOvalStrokeColor = borderColor;

    // Set Oval Customization
    defaultCustomization.ovalCustomization.strokeColor = ovalColor;
    defaultCustomization.ovalCustomization.progressColor1 = dualSpinnerColor;
    defaultCustomization.ovalCustomization.progressColor2 = dualSpinnerColor;

    // Set Feedback Customization
    defaultCustomization.feedbackCustomization.backgroundColor = buttonAndFeedbackBarColor;
    defaultCustomization.feedbackCustomization.textColor = buttonAndFeedbackBarTextColor;

    // Set Cancel Customization
    defaultCustomization.cancelButtonCustomization.customImage = cancelButtonImage;
    defaultCustomization.cancelButtonCustomization.location = cancelButtonLocation;

    // Set Security Watermark Customization
    defaultCustomization.securityWatermarkCustomization.setSecurityWatermarkImage(securityWatermarkImage);

    // Set Result Screen Customization
    defaultCustomization.resultScreenCustomization.backgroundColors = frameColor;
    defaultCustomization.resultScreenCustomization.foregroundColor = textColor;
    defaultCustomization.resultScreenCustomization.activityIndicatorColor = buttonAndFeedbackBarColor;
    defaultCustomization.resultScreenCustomization.resultAnimationBackgroundColor = buttonAndFeedbackBarColor;
    defaultCustomization.resultScreenCustomization.resultAnimationForegroundColor = buttonAndFeedbackBarTextColor;
    defaultCustomization.resultScreenCustomization.uploadProgressFillColor = buttonAndFeedbackBarColor;

    // Set ID Scan Customization
    defaultCustomization.idScanCustomization.selectionScreenBackgroundColors = frameColor;
    defaultCustomization.idScanCustomization.selectionScreenForegroundColor = textColor;
    defaultCustomization.idScanCustomization.reviewScreenBackgroundColors = frameColor;
    defaultCustomization.idScanCustomization.reviewScreenForegroundColor = buttonAndFeedbackBarTextColor;
    defaultCustomization.idScanCustomization.reviewScreenTextBackgroundColor = buttonAndFeedbackBarColor;
    defaultCustomization.idScanCustomization.captureScreenForegroundColor = buttonAndFeedbackBarTextColor;
    defaultCustomization.idScanCustomization.captureScreenTextBackgroundColor = buttonAndFeedbackBarColor;
    defaultCustomization.idScanCustomization.buttonBackgroundNormalColor = buttonAndFeedbackBarColor;
    defaultCustomization.idScanCustomization.buttonBackgroundDisabledColor = buttonColorDisabled;
    defaultCustomization.idScanCustomization.buttonBackgroundHighlightColor = buttonColorHighlight;
    defaultCustomization.idScanCustomization.buttonTextNormalColor = buttonAndFeedbackBarTextColor;
    defaultCustomization.idScanCustomization.buttonTextDisabledColor = buttonAndFeedbackBarTextColor;
    defaultCustomization.idScanCustomization.buttonTextHighlightColor = buttonAndFeedbackBarTextColor;
    defaultCustomization.idScanCustomization.captureScreenBackgroundColor = frameColor;
    defaultCustomization.idScanCustomization.captureFrameStrokeColor = borderColor;

    // Set Initial Loading Customization
    defaultCustomization.initialLoadingAnimationCustomization.backgroundColor = buttonAndFeedbackBarTextColor;
    defaultCustomization.initialLoadingAnimationCustomization.foregroundColor = buttonAndFeedbackBarColor;

    return defaultCustomization;
  }

  function retrieveLowLightConfigurationWizardCustomization(FaceTecSDK: any) {
    const defaultCustomization = retrieveConfigurationWizardCustomization(FaceTecSDK);
    currentLowLightCustomization = defaultCustomization;
    return defaultCustomization;
  }

  function retrieveDynamicDimmingConfigurationWizardCustomization(FaceTecSDK: any) {
    const defaultCustomization = retrieveConfigurationWizardCustomization(FaceTecSDK);
    currentDynamicDimmingCustomization = defaultCustomization;
    return defaultCustomization;
  }

  let currentCustomization: any;
  let currentLowLightCustomization: any;
  let currentDynamicDimmingCustomization: any;

  return {
    currentCustomization,
    currentLowLightCustomization,
    currentDynamicDimmingCustomization,
    retrieveConfigurationWizardCustomization,
    retrieveLowLightConfigurationWizardCustomization,
    retrieveDynamicDimmingConfigurationWizardCustomization,
  };
})();
