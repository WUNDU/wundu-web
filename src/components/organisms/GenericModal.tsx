"use client";

import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useUiStore } from '../../store/uiStore';
import { CloseButton } from '../atoms/CloseButton';
import { ModalContent } from '../molecules/ModalConten';
export function GenericModal() {
  const { isOpen, type, title, message, closeModal, onClose } = useUiStore();
  const [isMounted, setIsMounted] = useState(false);
  const [isOverlayOpen, setIsOverlayOpen] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  useEffect(() => {
    if (isOpen) {
      setIsOverlayOpen(true);
    } else {
      const timeout = setTimeout(() => setIsOverlayOpen(false), 300); // tempo da animação
      return () => clearTimeout(timeout);
    }
  }, [isOpen]);

  if (!isMounted || !isOverlayOpen) {
    return null;
  }

  const handleClose = () => {
    closeModal();
    onClose();
  };

  return createPortal(
    <div
      className={`
        fixed inset-0 z-50 transition-all duration-300
        ${isOpen ? 'bg-black bg-opacity-50' : 'bg-transparent'}
        flex items-center justify-center
      `}
      onClick={handleClose}
    >
      <div
        className={`
          relative flex flex-col bg-white shadow-lg rounded-xl dark:bg-neutral-900
          transition-all duration-500 ease-out transform
          m-3 sm:max-w-lg sm:w-full sm:mx-auto
          ${isOpen ? 'mt-7 opacity-100' : 'mt-0 opacity-0'}
        `}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="absolute top-2 end-2">
          <CloseButton onClick={handleClose} />
        </div>
        {type && <ModalContent type={type} title={title} message={message} />}
      </div>
    </div>,
    document.body
  );
}
