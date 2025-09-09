import { ModalIconProps } from '@/src/types/modal';
import React from 'react';

export function ModalIcon({ type }: ModalIconProps) {
  const iconColors = {
    success: 'border-green-50 bg-green-100 text-green-500 dark:bg-green-700 dark:border-green-600 dark:text-green-100',
    error: 'border-red-50 bg-red-100 text-red-500 dark:bg-red-700 dark:border-red-600 dark:text-red-100',
    info: 'border-blue-50 bg-blue-100 text-blue-500 dark:bg-blue-700 dark:border-blue-600 dark:text-blue-100',
  };

  const iconSvg = {
    success: (
      <svg className="shrink-0 size-5" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
        <path d="M11.251.068a.5.5 0 0 1 .227.58L9.677 6.5H13a.5.5 0 0 1 .364.843l-8 8.5a.5.5 0 0 1-.842-.49L6.323 9.5H3a.5.5 0 0 1-.364-.843l8-8.5a.5.5 0 0 1 .615-.09z" />
      </svg>
    ),
    error: (
      <svg className="shrink-0 size-5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <path d="m15 9-6 6" />
        <path d="m9 9 6 6" />
      </svg>
    ),
    info: (
      <svg className="shrink-0 size-5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <path d="M12 16v-4" />
        <path d="M12 8h.01" />
      </svg>
    ),
  };

  return (
    <span className={`mb-4 inline-flex justify-center items-center size-11 rounded-full border-4 ${iconColors[type]}`}>
      {iconSvg[type]}
    </span>
  );
}
