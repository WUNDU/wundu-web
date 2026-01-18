"use client";

import React from "react";
import { ModalIcon } from "@/shared/components/modal-icon";
import type { NotificationType } from "@/shared/store/ui-store";

interface ModalContentProps {
  type: NotificationType;
  title: string;
  message: string;
}

export function ModalContent({ type, title, message }: ModalContentProps) {
  return (
    <div className="flex flex-col items-center justify-center">
      {/* Icon */}
      <ModalIcon type={type} variant="toast" />

      {/* Title */}
      <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-3 leading-tight px-2">
        {title}
      </h3>

      {/* Message */}
      <p className="text-sm sm:text-base text-gray-600 leading-relaxed px-2 max-w-sm">
        {message}
      </p>
    </div>
  );
}
