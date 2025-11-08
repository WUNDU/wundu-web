"use client";

import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Button from "../atoms/Button";
import { useUiStore } from "@/src/store/uiStore";
import { ModalContent } from "../molecules/ModalConten";

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
        <div className="absolute top-4 right-4">
          <Button
            variant="close"
            onClick={handleClose}
            className="hover:bg-white rounded-full p-1"
          />
        </div>
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
