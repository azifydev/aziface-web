'use client';
import Script from 'next/script';
import LoginPage from './login';
import HomePage from './home';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useUser } from './hooks';
const queryClient = new QueryClient();
export default function Page() {
  const { tokenBiometric, token } = useUser();
  const isAuth = !!token && !!tokenBiometric;
  return (
    <QueryClientProvider client={queryClient}>
      <div className='wrapping-box-container'>
        <Script src='/core/facetec/FaceTecSDK.js' strategy='beforeInteractive' />
        {isAuth ? <HomePage /> : <LoginPage />}
      </div>
    </QueryClientProvider>
  );
}
