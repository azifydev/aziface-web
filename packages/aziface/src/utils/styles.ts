import { CancelLocation } from '../types/aziface';
import type { FaceTecCancelButtonLocation } from '../types/FaceTecCustomization';

const PREFIX = 'DOM_FT_';
const SAFE_MARGIN = 48;
const CANCEL_BUTTON_LOCATION = {
  Disabled: 0 as FaceTecCancelButtonLocation,
  TopLeft: 1 as FaceTecCancelButtonLocation,
  TopRight: 2 as FaceTecCancelButtonLocation,
} as const;

function getElementById(id: string): HTMLElement | null {
  return document.getElementById(id);
}

function getStyle(id: string): string {
  const element = getElementById(id);
  return element ? element.getAttribute('style') || '' : '';
}

function setStyle(id: string, style: string): void {
  const element = getElementById(id);
  if (element) element.setAttribute('style', style);
}

function isMobile(): boolean {
  return window.innerWidth <= 768;
}

function isRequestingPermission(): boolean {
  const id = `${PREFIX}cameraPermissionsScreen`;
  const currentStyle = getStyle(id);
  return currentStyle.includes('display: flex;');
}

function adjustFrameContainer(): void {
  if (!isMobile()) return;

  const id = `${PREFIX}frameContainer`;
  if (!!getElementById(id)) {
    const currentStyle = getStyle(id);
    const newStyle = 'top: 0px !important; left: 0px !important;';
    const isRequesting = isRequestingPermission();
    const hasStyle = currentStyle.includes(newStyle);

    if (!hasStyle && !isRequesting) {
      setStyle(id, `${currentStyle} ${newStyle}`);
    } else if (hasStyle && isRequesting) {
      const replatedStyle = currentStyle.replace(
        newStyle,
        'top: -2px !important; left: -2px !important;',
      );
      setStyle(id, replatedStyle);
    }
  }
}

function adjustCancelButtonElementBase(id: string, style: string): void {
  if (!isMobile() || !getElementById(id)) return;

  if (isRequestingPermission()) {
    setStyle(id, style);
  } else {
    const left = window.innerWidth > 400 ? '20%' : '22%';
    const newStyle = `left: ${left} !important;`;
    const currentStyle = getStyle(id);
    if (!currentStyle.includes(newStyle)) {
      setStyle(id, `${currentStyle} ${newStyle}`);
    }
  }
}

function adjustCancelButtonElement(): void {
  adjustCancelButtonElementBase(
    `${PREFIX}cancelButtonElement`,
    'left: 0px !important; height: 16px; width: 16px; padding: 15px; margin: 0px; opacity: 1; display: block; transition: opacity 500ms;',
  );
  adjustCancelButtonElementBase(
    `${PREFIX}idScanCancelButtonElement`,
    'height: 16px; width: 16px; padding: 8px; margin: 8px; top: 0px; left: 0px; opacity: 1; display: flex; transition: opacity 2000ms;',
  );
}

function adjustIdScanMask(): void {
  if (!isMobile()) return;

  const startY = '12px';
  const mask = getElementById(`${PREFIX}idScanCaptureFrameMask`);
  if (mask) {
    const [, rect] = mask.children;
    rect.setAttribute('style', '');
    rect.setAttribute('y', startY);
  }

  const rectId = `${PREFIX}idScanCaptureFrameRect`;
  const rect = getElementById(rectId);
  if (rect) {
    setStyle(rectId, '');
    rect.setAttribute('y', startY);
  }
}

function adjustOCRFormContainer(): void {
  if (!isMobile()) return;

  const id = `${PREFIX}ocrFormContainer`;
  const element = getElementById(id);
  if (element) {
    const [form] = element.children;

    for (const child of form.children) {
      if (child.tagName === 'SECTION') {
        for (const sectionChild of child.children) {
          if (sectionChild.tagName === 'DIV') {
            const width = window.innerWidth - SAFE_MARGIN;
            const currentStyle = sectionChild.getAttribute('style') || '';
            const newStyle = `margin: 0px auto; display: block; width: ${width}px;`;
            if (!currentStyle.includes(newStyle)) {
              sectionChild.setAttribute('style', newStyle);
            }
          }
        }
      }
    }
  }
}

function generateDPath(): string | null {
  if (!isMobile()) return null;

  const VIEW_BOX = 640;
  const OVAL = 158;
  const displacement = OVAL.toFixed(1);
  const rx = (79).toFixed(1);
  const ry = (116).toFixed(1);
  const width = (VIEW_BOX / 2 - OVAL / 2).toFixed(1);

  return `m${width} 180 a${rx} ${ry} 0 1 0 ${displacement} 0 a${rx} ${ry} 0 1 0 -${displacement} 0`;
}

function removeElementById(id: string): void {
  if (!isMobile()) return;

  const element = getElementById(id);
  if (element) element.remove();
}

function setDPath(id: string): void {
  const element = getElementById(id);
  const d = generateDPath();
  if (element && d) element.setAttribute('d', d);
}

export function applyResponsiveStyles(): void {
  removeElementById(`${PREFIX}ovalSpinner1`);
  removeElementById(`${PREFIX}ovalSpinner2`);

  adjustCancelButtonElement();
  adjustFrameContainer();
  adjustIdScanMask();
  adjustOCRFormContainer();

  setDPath(`${PREFIX}frameGetReadyOvalPath`);
  setDPath(`${PREFIX}frameOvalPath`);
}

export function resolveCancelLocation(
  location?: CancelLocation,
): FaceTecCancelButtonLocation {
  const defaultLocation = CANCEL_BUTTON_LOCATION.TopLeft;
  const locations: Record<CancelLocation, FaceTecCancelButtonLocation> = {
    'top-left': defaultLocation,
    'top-right': CANCEL_BUTTON_LOCATION.TopRight,
    none: CANCEL_BUTTON_LOCATION.Disabled,
  };

  return location ? locations[location] : defaultLocation;
}
