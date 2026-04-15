import { useState } from 'react';
import { useBiometricConfigs } from '../services';
import { useUser } from '../hooks';
import {
  authenticate,
  dispose,
  enroll,
  initialize,
  liveness,
  photoMatch,
  photoScan,
  setLocale,
  SessionError,
  type InitializeParams,
  type InitializeHeaders,
  type Locale,
} from '@azify/aziface-web';
import { type FaceType } from '../types/services.types';
import { LOCALES } from '../constants';
import '@azify/aziface-web/dist/aziface.css';

export function Home() {
  const [isInitialized, setIsInitialized] = useState(false);
  const [i18n, setI18n] = useState<Locale>('en');

  const { data: configs } = useBiometricConfigs();
  const { tokenBiometric, logout } = useUser();

  const onInitialize = (): void => {
    const params: InitializeParams = {
      baseUrl: import.meta.env.VITE_PUBLIC_API_URL_AZTECH || '',
      deviceKeyIdentifier: configs?.device || '',
      isDevelopment: true,
    };

    const headers: InitializeHeaders = {
      'x-token-bearer': tokenBiometric || '',
      'x-only-raw-analysis': '1',
    };

    initialize({ params, headers }, (initialized) => {
      const error = initialized.error;

      setIsInitialized(initialized.isSuccess);
      if (error) {
        alert(`(${error.code}) - ${error.cause}`);
      } else {
        setLocale(i18n);
      }
    });
  };

  const onDispose = (): void => {
    dispose((disposed) => {
      setIsInitialized(!disposed);

      if (!disposed) {
        alert('Failed to dispose SDK.');
      }
    });
  };

  const onLocale = async (): Promise<void> => {
    const locales = LOCALES.filter((loc) => loc !== i18n);
    const newLocale = locales[Math.floor(Math.random() * locales.length)];

    setI18n(newLocale);
    await setLocale(newLocale);
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
          alert(`Invalid face scan type: ${type}`);
          break;
      }
    } catch (error) {
      const sessionError = error as SessionError;
      alert(sessionError.message);
    }
  };

  return (
    <div className='min-h-screen flex items-center justify-center bg-gray-50'>
      <div className='w-full p-5 sm:bg-white sm:border sm:border-gray-200 sm:rounded-xl sm:p-8 sm:max-w-sm sm:shadow-sm'>
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
            onClick={onLocale}
            disabled={!isInitialized}
            className='w-full py-3 disabled:hover:bg-gray-100 disabled:active:scale-100 disabled:opacity-50 disabled:cursor-not-allowed bg-gray-100 hover:bg-gray-200 border border-gray-200 rounded-lg text-sm font-medium text-gray-900 transition active:scale-[0.98]'
          >
            Locale: {i18n}
          </button>

          <button
            onClick={onDispose}
            disabled={!isInitialized}
            className='w-full py-3 disabled:hover:bg-gray-100 disabled:active:scale-100 disabled:opacity-50 disabled:cursor-not-allowed bg-gray-100 hover:bg-gray-200 border border-gray-200 rounded-lg text-sm font-medium text-gray-900 transition active:scale-[0.98]'
          >
            Dispose
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
