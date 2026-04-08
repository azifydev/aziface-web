'use client';

import Script from 'next/script';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useUser } from '@/hooks';
import { Login } from './login';
import { Home } from './home';
import { Unless, When } from 'react-if';

const queryClient = new QueryClient();

export default function Page() {
  const { tokenBiometric, token } = useUser();
  const isAuth = !!token && !!tokenBiometric;
  return (
    <QueryClientProvider client={queryClient}>
      <Script src={`/core/facetec/FaceTecSDK.js`} strategy='beforeInteractive' />
      <When condition={isAuth}>
        <Home />
      </When>
      <Unless condition={isAuth}>
        <Login />
      </Unless>
    </QueryClientProvider>
  );
}
