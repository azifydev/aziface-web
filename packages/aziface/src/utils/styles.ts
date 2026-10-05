import { CancelLocation, VocalGuidanceMode } from '../types/aziface';
import type { FaceTecCancelButtonLocation } from '../types/FaceTecCustomization';

const CANCEL_BUTTON_LOCATION = {
  Disabled: 0 as FaceTecCancelButtonLocation,
  TopLeft: 1 as FaceTecCancelButtonLocation,
  TopRight: 2 as FaceTecCancelButtonLocation,
} as const;

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

export function resolveVocalGuidanceMode(mode?: VocalGuidanceMode): number {
  const modes: Record<VocalGuidanceMode, number> = {
    MINIMAL: 0,
    FULL: 1,
    OFF: 2,
  };

  // Return OFF (2) if mode is not specified
  return mode ? modes[mode] : 2;
}
