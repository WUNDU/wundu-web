import React from "react";
import { ModalProps } from "@/types/modal";
import { DocumentIcon } from "@/constants/icons";
import { Button } from "@/ui/atoms";

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  message,
  confirmText = "Sim",
  cancelText = "Não",
  onConfirm,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-sm w-full p-6">
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <DocumentIcon className="h-8 w-8 text-green-600" />
            </div>
          </div>

          <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>

          <p className="text-gray-600 text-sm mb-6">{message}</p>

          <div className="flex flex-row items-center justify-center gap-3">
            <Button
              label={confirmText}
              variant="destructive"
              onClick={() => {
                onConfirm?.();
                onClose();
              }}
            />
            <Button
              label={cancelText}
              variant="destructive"
              onClick={onClose}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
