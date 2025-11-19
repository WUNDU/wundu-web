"use client";

import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Button } from "@/ui/atoms";
import { useUiStore } from "@/store/uiStore";
import { ModalContent } from "@/ui/molecules/ModalConten";
import { CloseIcon } from "@/constants/icons";

export function NotificationToast() {
  const { notification, closeNotification } = useUiStore();
  const [isMounted, setIsMounted] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  useEffect(() => {
    let timeout: NodeJS.Timeout;

    if (notification) {
      setIsAnimating(true);
    } else {
      timeout = setTimeout(() => {
        setIsAnimating(false);
      }, 500);
    }

    return () => clearTimeout(timeout);
  }, [notification]);

  if (!isMounted || (!isAnimating && !notification)) {
    return null;
  }

  const handleClose = () => {
    closeNotification();
  };

  if (!notification) return null;

  return createPortal(
    <div
      className={`
        fixed inset-0 z-50 flex items-center justify-center p-4
        transition-all duration-500 ease-in-out
        ${notification ? "bg-black/50" : "bg-transparent"}
        ${!notification && "pointer-events-none"}
      `}
      onClick={handleClose}
    >
      <div
        className={`
          relative flex items-center justify-center flex-col w-full max-w-lg h-1/4 shadow-2xl rounded-2xl
          transition-all duration-500 ease-out transform
          bg-white text-gray-500
          ${
            notification
              ? "translate-y-0 opacity-100 scale-100"
              : "translate-y-4 opacity-0 scale-95"
          }
        `}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={handleClose}
          aria-label="Fechar notificação"
          className="absolute top-3 right-3 flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 text-gray-500 hover:bg-gray-50 hover:text-gray-700 transition-all duration-200"
        >
          <CloseIcon className="w-4 h-4" />
        </button>
        <ModalContent
          type={notification.type}
          title={notification.title}
          message={notification.message}
        />
      </div>
    </div>,
    document.body
  );
}
