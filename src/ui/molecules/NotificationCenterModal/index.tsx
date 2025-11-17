"use client";

import React from "react";
import { useUiStore } from "@/store/uiStore";
import { NotificationDeskIcon, HelpIcon, CalendarIcon } from "@/constants/icons";
import { Button } from "@/ui/atoms";

const mockNotifications = [
  {
    id: 1,
    title: "Transação aprovada",
    description: "O recibo enviado foi validado e adicionado às suas despesas.",
    timeAgo: "Há 2 min",
  },
  {
    id: 2,
    title: "Objetivo atualizado",
    description: "O objetivo " + "Viagem 2025" + " atingiu 60% do valor necessário.",
    timeAgo: "Há 1 h",
  },
  {
    id: 3,
    title: "Sugestão da IA",
    description: "Temos novas dicas para economizar 5% nos gastos com transporte.",
    timeAgo: "Ontem",
  },
];

const NotificationCenterModal: React.FC = () => {
  const { isNotificationCenterOpen, closeNotificationCenter } = useUiStore();

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
            className="rounded-full border border-gray-200 p-2 text-gray-500 hover:bg-gray-50"
            aria-label="Fechar notificações"
          >
            ✕
          </button>
        </div>

        <div className="max-h-[60vh] overflow-y-auto px-6 py-4 space-y-4">
          {mockNotifications.map((notification) => (
            <div
              key={notification.id}
              className="rounded-2xl border border-gray-100 bg-gray-50/60 p-4 hover:bg-white transition-colors"
            >
              <div className="flex items-start gap-3">
                <div className="rounded-2xl bg-white p-2 text-gray-500 shadow-sm">
                  <CalendarIcon className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-semibold text-gray-900">
                      {notification.title}
                    </h4>
                    <span className="text-xs text-gray-500">
                      {notification.timeAgo}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-gray-600">
                    {notification.description}
                  </p>
                </div>
              </div>
            </div>
          ))}

          <div className="rounded-2xl border border-dashed border-gray-200 p-4 text-center text-sm text-gray-500">
            <p>
              Precisa de ajuda? Entre em contacto com o nosso suporte para resolver qualquer
              questão ligada às notificações.
            </p>
            <Button
              variant="secondary"
              className="mt-3 text-sm"
              onClick={() => {
                /* Placeholder para ação futura */
              }}
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
