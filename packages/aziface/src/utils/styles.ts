import { CancelLocation } from '../types/aziface';
import type { FaceTecCancelButtonLocation } from '../types/FaceTecCustomization';

const PREFIX = 'DOM_FT_';
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

function isRequestingPermission(): boolean {
  const ID = `${PREFIX}cameraPermissionsScreen`;
  const currentStyle = getStyle(ID);
  return currentStyle.includes('display: flex;');
}

function adjustFrameContainer(): void {
  const { innerWidth } = window;
  if (innerWidth > 768) return;

  const ID = `${PREFIX}frameContainer`;
  if (!!getElementById(ID)) {
    const currentStyle = getStyle(ID);
    const newStyle = 'top: 0px !important; left: 0px !important;';
    const isRequesting = isRequestingPermission();
    const hasStyle = currentStyle.includes(newStyle);

    if (!hasStyle && !isRequesting) setStyle(ID, `${currentStyle} ${newStyle}`);
    else if (hasStyle && isRequesting) {
      const replatedStyle = currentStyle.replace(
        newStyle,
        'top: -2px !important; left: -2px !important;',
      );
      setStyle(ID, replatedStyle);
    }
  }
}

function adjustCancelButtonElement(): void {
  const { innerWidth } = window;
  if (innerWidth > 768) return;

  const ID = `${PREFIX}cancelButtonElement`;
  if (!!getElementById(ID)) {
    if (isRequestingPermission()) {
      const style =
        'left: 0px !important; height: 16px; width: 16px; padding: 15px; margin: 0px; opacity: 1; display: block; transition: opacity 500ms;';
      setStyle(ID, style);
    } else {
      const left = innerWidth > 400 ? '20%' : '22%';
      const newStyle = `left: ${left} !important;`;
      const currentStyle = getStyle(ID);
      if (!currentStyle.includes(newStyle)) {
        setStyle(ID, `${currentStyle} ${newStyle}`);
      }
    }
  }
}

function generateDPath(): string | null {
  const { innerWidth } = window;
  if (innerWidth > 768) return null;

  const VIEW_BOX = 640;
  const OVAL = 158;
  const displacement = OVAL.toFixed(1);
  const rx = (79).toFixed(1);
  const ry = (116).toFixed(1);
  const width = (VIEW_BOX / 2 - OVAL / 2).toFixed(1);

  return `m${width} 180 a${rx} ${ry} 0 1 0 ${displacement} 0 a${rx} ${ry} 0 1 0 -${displacement} 0`;
}

function removeElementById(id: string): void {
  if (window.innerWidth > 768) return;

  const element = getElementById(id);
  if (element) element.remove();
}

function setDPath(id: string): void {
  const element = getElementById(id);
  const d = generateDPath();
  if (element && d) element.setAttribute('d', d);
}

export function styleObserver(): void {
  removeElementById(`${PREFIX}ovalSpinner1`);
  removeElementById(`${PREFIX}ovalSpinner2`);

  adjustCancelButtonElement();
  adjustFrameContainer();

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
