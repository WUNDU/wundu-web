"use client";

import React from "react";
import { ModalIcon } from "../atoms/ModalIcon";
import { ModalContentProps } from "@/src/types/modal";

export function ModalContent({ type, title, message }: ModalContentProps) {
  const textColorClass = "text-white";
  const titleColorClass = "text-white";

  return (
    <div className="p-4 sm:p-6 text-center overflow-y-auto flex flex-row items-center space-x-4">
      {/* Icon */}
      <div className="flex-shrink-0 flex justify-center mt-5">
        <ModalIcon type={type} />
      </div>

      <div className="flex flex-col text-left">
        <h3
          id="modal-title"
          className={`mb-1 text-xl font-bold ${titleColorClass}`}
        >
          {title}
        </h3>
        <p className={`text-sm ${textColorClass}`}>{message}</p>
      </div>
    </div>
  );
}
