'use client';

import Script from 'next/script';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import LoginPage from './login';
import HomePage from './home';
import { useUser } from './hooks';

const queryClient = new QueryClient();

export default function Page() {
  const { tokenBiometric, token } = useUser();
  const isAuth = !!token && !!tokenBiometric;

  return (
    <QueryClientProvider client={queryClient}>
      <Script src='/core/facetec/FaceTecSDK.js' strategy='beforeInteractive' />

      <div className='wrapping-box-container'>
        {isAuth ? <HomePage /> : <LoginPage />}
      </div>
    </QueryClientProvider>
  );
}
