import React from 'react';
import { ModalIcon } from '../atoms/ModalIcon';
import { ModalContentProps } from '@/src/types/modal';

export function ModalContent({ type, title, message }: ModalContentProps) {
  return (
    <div className="p-4 sm:p-10 text-center overflow-y-auto">
      <ModalIcon type={type} />
      <h3 className="mb-2 text-xl font-bold text-gray-800 dark:text-neutral-200">{title}</h3>
      <p className="text-gray-500 dark:text-neutral-500">{message}</p>
    </div>
  );
}
