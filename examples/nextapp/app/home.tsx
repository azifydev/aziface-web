'use client';

import { useBiometricConfigs } from '@/services';
import { useUser } from './hooks';
import { useState } from 'react';
import { useController } from '@/hooks/useController';

export default function HomePage() {
  const [isInitialized, setIsInitialized] = useState(false);

  const { current: controller } = useController();
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

    controller.initialize({ params, headers }, initialized => {
      setIsInitialized(initialized);
      console.log(
        'Initialization callback received with success:',
        initialized,
      );
    });
  };

  const onDeinitialize = (): void => {
    controller.dispose(disposed => {
      setIsInitialized(!disposed);
      console.log('Dispose callback received with success:', disposed);
    });
  };

  return (
    <div className='min-h-screen flex items-center justify-center bg-gray-50'>
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
            onClick={controller.enroll}
            disabled={!isInitialized}
            className='w-full py-3 disabled:hover:bg-gray-100 disabled:active:scale-100 disabled:opacity-50 disabled:cursor-not-allowed bg-gray-100 hover:bg-gray-200 border border-gray-200 rounded-lg text-sm font-medium text-gray-900 transition active:scale-[0.98]'
          >
            Enroll
          </button>

          <button
            onClick={controller.liveness}
            disabled={!isInitialized}
            className='w-full py-3 disabled:hover:bg-gray-100 disabled:active:scale-100 disabled:opacity-50 disabled:cursor-not-allowed bg-gray-100 hover:bg-gray-200 border border-gray-200 rounded-lg text-sm font-medium text-gray-900 transition active:scale-[0.98]'
          >
            Liveness
          </button>

          <button
            onClick={controller.authenticate}
            disabled={!isInitialized}
            className='w-full py-3 disabled:hover:bg-gray-100 disabled:active:scale-100 disabled:opacity-50 disabled:cursor-not-allowed bg-gray-100 hover:bg-gray-200 border border-gray-200 rounded-lg text-sm font-medium text-gray-900 transition active:scale-[0.98]'
          >
            Authenticate
          </button>

          <button
            onClick={controller.photoMatch}
            disabled={!isInitialized}
            className='w-full py-3 disabled:hover:bg-gray-100 disabled:active:scale-100 disabled:opacity-50 disabled:cursor-not-allowed bg-gray-100 hover:bg-gray-200 border border-gray-200 rounded-lg text-sm font-medium text-gray-900 transition active:scale-[0.98]'
          >
            Photo Match
          </button>

          <button
            onClick={controller.photoScan}
            disabled={!isInitialized}
            className='w-full py-3 disabled:hover:bg-gray-100 disabled:active:scale-100 disabled:opacity-50 disabled:cursor-not-allowed bg-gray-100 hover:bg-gray-200 border border-gray-200 rounded-lg text-sm font-medium text-gray-900 transition active:scale-[0.98]'
          >
            Photo Scan
          </button>

          <button
            onClick={onDeinitialize}
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
