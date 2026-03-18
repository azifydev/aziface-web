'use client';
/* eslint-disable @typescript-eslint/no-explicit-any */
// browser guard
if (typeof window === 'undefined') {
  (globalThis as any).window = globalThis;
}
export * from './Controller';
export * from './Config';
