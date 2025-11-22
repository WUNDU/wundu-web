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
      }, 150); // Match sweetalert-hide duration
    }

    return () => clearTimeout(timeout);
  }, [notification]);

  if (!isMounted || (!isAnimating && !notification)) {
    return null;
  }

  const handleClose = () => {
    closeNotification();
  };

  // Don't render if no notification (fixes empty toast bug)
  if (!notification) {
    return null;
  }

  return createPortal(
    <div
      className={`
        fixed inset-0 z-[9999] flex items-center justify-center p-4
        bg-black/40 backdrop-blur-sm
        ${notification ? "animate-backdrop-in" : "animate-backdrop-out pointer-events-none"}
      `}
      onClick={handleClose}
    >
      <div
        className={`
          relative w-full max-w-md bg-white rounded-3xl shadow-2xl
          ${notification ? "animate-sweetalert-show" : "animate-sweetalert-hide"}
        `}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={handleClose}
          aria-label="Fechar notificação"
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all duration-200"
        >
          <CloseIcon className="w-4 h-4" />
        </button>

        {/* Content */}
        <div className="px-6 py-8 sm:px-8 sm:py-10 text-center">
          <ModalContent
            type={notification.type}
            title={notification.title}
            message={notification.message}
          />
        </div>
      </div>
    </div>,
    document.body
  );
}
