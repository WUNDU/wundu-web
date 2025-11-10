"use client";

import React from "react";
import { ModalIcon } from "../atoms/ModalIcon";
import type { NotificationType } from "@/src/store/uiStore";

interface ModalContentProps {
  type: NotificationType;
  title: string;
  message: string;
}

export function ModalContent({ type, title, message }: ModalContentProps) {
  return (
    <div className="p-6 pt-8">
      <div className="flex-1 flex flex-col items-center justify-center gap-1 text-center min-w-0">
        <div className="p-2 m-2">
          <ModalIcon type={type} variant="toast" />
        </div>
        <h3 className="text-xl font-bold mb-2 leading-tight">{title}</h3>
        <p className="text-sm leading-relaxed opacity-90">{message}</p>
      </div>
    </div>
  );
}
