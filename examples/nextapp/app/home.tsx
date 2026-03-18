'use client';

import { Controller } from '@/aziface';
import { useBiometricConfigs } from '@/services';
import { useUser } from './hooks';

export default function HomePage() {
  const controller = new Controller();
  const { data: configs } = useBiometricConfigs();
  const { tokenBiometric, logout } = useUser();
  const handleInitialize = () => {
    try {
      const initialized = controller.initialize({
        params: { baseUrl: process.env.NEXT_PUBLIC_API_URL_AZTECH || '', deviceKeyIdentifier: configs?.device || '' },
        headers: { 'x-token-bearer': tokenBiometric, 'x-only-raw-analysis': '1' },
      });
      console.log('isInitialized', initialized);
    } catch (error) {
      console.error('Initialize', error);
    }
  };
  const handleEnroll = async () => controller.enroll();

  return (
    <div className='min-h-screen flex items-center justify-center bg-gray-50'>
      <div className='bg-white border border-gray-200 rounded-xl p-8 w-full max-w-sm shadow-sm'>
        <h1 className='text-2xl font-semibold text-gray-900 mb-1'>Home</h1>
        <p className='text-sm text-gray-500 mb-6'>Selecione uma ação</p>

        <div className='flex flex-col gap-3'>
          <button
            onClick={handleInitialize}
            className='w-full py-3 bg-gray-100 hover:bg-gray-200 border border-gray-200 rounded-lg text-sm font-medium text-gray-900 transition active:scale-[0.98]'
          >
            Initialize
          </button>

          <button
            onClick={handleEnroll}
            className='w-full py-3 bg-gray-100 hover:bg-gray-200 border border-gray-200 rounded-lg text-sm font-medium text-gray-900 transition active:scale-[0.98]'
          >
            Enroll
          </button>

          <button
            onClick={() => console.log('Liveness')}
            className='w-full py-3 bg-gray-100 hover:bg-gray-200 border border-gray-200 rounded-lg text-sm font-medium text-gray-900 transition active:scale-[0.98]'
          >
            Liveness
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
