'use client';

import { useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { useBiometricSession, useLogin } from '@/services';

export function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { mutateAsync: login, isPending: isPendingLogin } = useLogin();
  const { mutateAsync: createSession, isPending: isPendingSession } =
    useBiometricSession();

  const handleLogin = async () => {
    try {
      await login({ username, password });
      await createSession();
    } catch {
      toast.error('Login failed. Please check your credentials and try again.');
    }
  };
  const isPending = isPendingSession || isPendingLogin;
  const isLoading = isPending || !password || !username;

  return (
    <div className='min-h-screen flex items-center justify-center bg-gray-50'>
      <Toaster position='bottom-right' />

      <div className='bg-white border border-gray-200 rounded-xl p-8 w-full max-w-sm shadow-sm'>
        <h1 className='text-2xl font-semibold text-gray-900 mb-1'>Entrar</h1>
        <p className='text-sm text-gray-500 mb-6'>Acesse sua conta</p>

        <div className='mb-4'>
          <label className='block text-sm text-gray-600 mb-1'>Usuário</label>
          <input
            type='text'
            value={username}
            onChange={e => setUsername(e.target.value)}
            placeholder='seu.usuario'
            className='w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 placeholder-gray-400 outline-none focus:ring-2 focus:ring-gray-300'
          />
        </div>

        <div className='mb-6'>
          <label className='block text-sm text-gray-600 mb-1'>Senha</label>
          <input
            type='password'
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder='••••••••'
            className='w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 placeholder-gray-400 outline-none focus:ring-2 focus:ring-gray-300'
          />
        </div>

        <button
          onClick={handleLogin}
          disabled={isLoading || !username || !password}
          className='w-full bg-gray-900 text-white text-sm font-medium py-2.5 rounded-lg hover:bg-gray-800 active:scale-[0.98] transition disabled:opacity-40 disabled:cursor-not-allowed'
        >
          Entrar
        </button>
      </div>
    </div>
  );
}
