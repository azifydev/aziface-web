import { useSyncExternalStore } from 'react';
import { AzifaceController, controller } from '../module/aziface';
import { SnapshotProps } from '../types/aziface';

export function useAziface() {
  const state = useSyncExternalStore<SnapshotProps>(
    AzifaceController.subscribe,
    AzifaceController.getSnapshot,
    AzifaceController.getSnapshot,
  );

  async function enroll(): Promise<boolean> {
    return await controller.enroll();
  }

  async function authenticate(): Promise<boolean> {
    return await controller.authenticate();
  }

  async function liveness(): Promise<boolean> {
    return await controller.liveness();
  }

  async function photoMatch(): Promise<boolean> {
    return await controller.photoMatch();
  }

  async function photoScan(): Promise<boolean> {
    return await controller.photoScan();
  }

  return {
    enroll,
    authenticate,
    liveness,
    photoMatch,
    photoScan,
    ...state,
  };
}
