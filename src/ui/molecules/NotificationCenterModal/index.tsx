"use client";

import React from "react";
import { useUiStore } from "@/store/uiStore";
import { NotificationDeskIcon, HelpIcon } from "@/constants/icons";
import { Button } from "@/ui/atoms";

const NotificationCenterModal: React.FC = () => {
  const { isNotificationCenterOpen, closeNotificationCenter } = useUiStore();

  const handleSupportClick = () => {
    if (typeof window !== "undefined") {
      window.open(
        "mailto:Support@wundu.tech?subject=Ajuda%20com%20notificações",
        "_blank"
      );
    }
  };

  if (!isNotificationCenterOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 backdrop-blur-[2px] px-4"
      onClick={closeNotificationCenter}
    >
      <div
        className="w-full max-w-lg rounded-3xl bg-white shadow-2xl border border-gray-100 overflow-hidden animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-yellow-50 p-3 text-yellow-500">
              <NotificationDeskIcon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-gray-500">
                Central de notificações
              </p>
              <h3 className="text-lg font-semibold text-gray-900">
                Novidades da sua conta
              </h3>
            </div>
          </div>
          <button
            onClick={closeNotificationCenter}
            className="grid place-items-center rounded-full border border-gray-200 text-gray-500 hover:bg-gray-50 hover:text-gray-700 transition-colors"
            aria-label="Fechar notificações"
            style={{ width: 40, height: 40 }}
          >
            ✕
          </button>
        </div>

        <div className="max-h-[60vh] overflow-y-auto px-6 py-4 space-y-4">
          <div className="rounded-2xl border border-dashed border-gray-200 p-6 text-center text-sm text-gray-500 bg-gray-50">
            <p className="font-medium text-gray-700 mb-1">Sem notificações por enquanto</p>
            <p className="text-gray-500">
              Quando houver novidades sobre os seus comprovativos, elas aparecerão aqui.
            </p>
          </div>

          <div className="rounded-2xl border border-dashed border-gray-200 p-4 text-center text-sm text-gray-500">
            <p>
              Precisa de ajuda? Entre em contacto com o nosso suporte para resolver qualquer
              questão ligada às notificações.
            </p>
            <Button
              variant="secondary"
              className="mt-3 text-sm"
              onClick={handleSupportClick}
              leftIcon={<HelpIcon className="w-4 h-4" />}
            >
              Falar com suporte
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationCenterModal;
