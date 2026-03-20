'use client';

import { useBiometricConfigs } from '@/services';
import { useUser } from '@/hooks';
import { useState } from 'react';
import {
  authenticate,
  dispose,
  enroll,
  initialize,
  liveness,
  photoMatch,
  photoScan,
  withTheme,
} from '@/lib/aziface/aziface';
import { FaceType } from '@/types/services.types';
import toast, { Toaster } from 'react-hot-toast';
import { SessionError } from '@/lib/aziface/errors';

export default function HomePage() {
  const [isInitialized, setIsInitialized] = useState(false);

  const { data: configs } = useBiometricConfigs();
  const { tokenBiometric, logout } = useUser();

  const onInitialize = (): void => {
    const params = {
      baseUrl: process.env.NEXT_PUBLIC_API_URL_AZTECH || '',
      deviceKeyIdentifier: configs?.device || '',
      isDevelopment: true,
    };

    const headers = {
      'x-token-bearer': tokenBiometric || '',
      'x-only-raw-analysis': '1',
    };

    initialize({ params, headers }, initialized => {
      const error = initialized.error;

      setIsInitialized(initialized.isSuccess);
      if (error) {
        toast.error(`${error.cause} - (${error.code})`);
      } else {
        withTheme({
          brandingImage: 'custom_branding.png',
          cancelImage: 'custom_cancel.png',
        });
      }
    });
  };

  const onDispose = (): void => {
    dispose(disposed => {
      setIsInitialized(!disposed);

      if (!disposed) {
        toast.error('Failed to dispose SDK.');
      }
    });
  };

  const onFaceScan = (type: FaceType): void => {
    try {
      switch (type) {
        case 'enroll':
          enroll();
          break;
        case 'authenticate':
          authenticate();
          break;
        case 'liveness':
          liveness();
          break;
        case 'photoMatch':
          photoMatch();
          break;
        case 'photoScan':
          photoScan();
          break;
        default:
          toast.error(`Invalid face scan type: ${type}`);
          break;
      }
    } catch (error) {
      const sessionError = error as SessionError;
      toast.error(sessionError.message);
    }
  };

  return (
    <div className='min-h-screen flex items-center justify-center bg-gray-50'>
      <Toaster position='bottom-right' />

      <div className='bg-white border border-gray-200 rounded-xl p-8 w-full max-w-sm shadow-sm'>
        <h1 className='text-2xl font-semibold text-gray-900 mb-1'>Home</h1>
        <p className='text-sm text-gray-500 mb-6'>Selecione uma ação</p>

        <div className='flex flex-col gap-3'>
          <button
            onClick={onInitialize}
            className='w-full py-3 bg-gray-100 hover:bg-gray-200 border border-gray-200 rounded-lg text-sm font-medium text-gray-900 transition active:scale-[0.98]'
          >
            Initialize
          </button>

          <button
            onClick={() => onFaceScan('enroll')}
            disabled={!isInitialized}
            className='w-full py-3 disabled:hover:bg-gray-100 disabled:active:scale-100 disabled:opacity-50 disabled:cursor-not-allowed bg-gray-100 hover:bg-gray-200 border border-gray-200 rounded-lg text-sm font-medium text-gray-900 transition active:scale-[0.98]'
          >
            Enroll
          </button>

          <button
            onClick={() => onFaceScan('liveness')}
            disabled={!isInitialized}
            className='w-full py-3 disabled:hover:bg-gray-100 disabled:active:scale-100 disabled:opacity-50 disabled:cursor-not-allowed bg-gray-100 hover:bg-gray-200 border border-gray-200 rounded-lg text-sm font-medium text-gray-900 transition active:scale-[0.98]'
          >
            Liveness
          </button>

          <button
            onClick={() => onFaceScan('authenticate')}
            disabled={!isInitialized}
            className='w-full py-3 disabled:hover:bg-gray-100 disabled:active:scale-100 disabled:opacity-50 disabled:cursor-not-allowed bg-gray-100 hover:bg-gray-200 border border-gray-200 rounded-lg text-sm font-medium text-gray-900 transition active:scale-[0.98]'
          >
            Authenticate
          </button>

          <button
            onClick={() => onFaceScan('photoMatch')}
            disabled={!isInitialized}
            className='w-full py-3 disabled:hover:bg-gray-100 disabled:active:scale-100 disabled:opacity-50 disabled:cursor-not-allowed bg-gray-100 hover:bg-gray-200 border border-gray-200 rounded-lg text-sm font-medium text-gray-900 transition active:scale-[0.98]'
          >
            Photo Match
          </button>

          <button
            onClick={() => onFaceScan('photoScan')}
            disabled={!isInitialized}
            className='w-full py-3 disabled:hover:bg-gray-100 disabled:active:scale-100 disabled:opacity-50 disabled:cursor-not-allowed bg-gray-100 hover:bg-gray-200 border border-gray-200 rounded-lg text-sm font-medium text-gray-900 transition active:scale-[0.98]'
          >
            Photo Scan
          </button>

          <button
            onClick={onDispose}
            disabled={!isInitialized}
            className='w-full py-3 disabled:hover:bg-gray-100 disabled:active:scale-100 disabled:opacity-50 disabled:cursor-not-allowed bg-gray-100 hover:bg-gray-200 border border-gray-200 rounded-lg text-sm font-medium text-gray-900 transition active:scale-[0.98]'
          >
            Deinitialize
          </button>

          <button
            onClick={logout}
            className='w-full py-3 bg-red-50 hover:bg-red-100 border border-red-200 rounded-lg text-sm font-medium text-red-600 transition active:scale-[0.98] mt-1'
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}
