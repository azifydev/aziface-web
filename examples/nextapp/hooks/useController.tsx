import { useRef } from 'react';
import { AzifaceController } from '../lib/aziface/aziface';

export function useController() {
  const controller = useRef<AzifaceController>(new AzifaceController());

  return controller;
}
