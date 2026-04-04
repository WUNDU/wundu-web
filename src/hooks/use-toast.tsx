"use client";

import { useCallback } from "react";
import { toast as sonnerToast, Toaster, ExternalToast } from "sonner";
import { AlertCircle, CheckCircle, Info, AlertTriangle, X, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type ToastType = "success" | "error" | "info" | "warning";

export interface UseToastOptions extends ExternalToast {
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export function useToast() {
  const show = useCallback(
    (type: ToastType, message: string, options: UseToastOptions = {}) => {
      const { duration = 4000, action, ...rest } = options;

      const icons = {
        success: <CheckCircle className="w-5 h-5" />,
        error: <AlertCircle className="w-5 h-5" />,
        info: <Info className="w-5 h-5" />,
        warning: <AlertTriangle className="w-5 h-5" />,
      };

      const themes = {
        success: {
          bg: "bg-white",
          accent: "bg-emerald-500",
          text: "text-[#2D1B18]",
          icon: "text-emerald-500",
          border: "border-[#2D1B18]/5"
        },
        error: {
          bg: "bg-white",
          accent: "bg-red-500",
          text: "text-[#2D1B18]",
          icon: "text-red-500",
          border: "border-[#2D1B18]/5"
        },
        info: {
          bg: "bg-white",
          accent: "bg-[#B8926A]",
          text: "text-[#2D1B18]",
          icon: "text-[#B8926A]",
          border: "border-[#2D1B18]/5"
        },
        warning: {
          bg: "bg-white",
          accent: "bg-amber-500",
          text: "text-[#2D1B18]",
          icon: "text-amber-500",
          border: "border-[#2D1B18]/5"
        },
      };

      const theme = themes[type];

      sonnerToast.custom(
        (id) => (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ type: "tween", duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className={`w-full max-w-sm bg-white p-5 rounded-3xl border ${theme.border} flex items-center gap-4 shadow-[0_20px_40px_-10px_rgba(45,27,24,0.12)] relative overflow-hidden group`}
          >
            {/* Status Line */}
            <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${theme.accent}`} />

            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 bg-[#FDFCFB] border border-[#2D1B18]/5 ${theme.icon} shadow-sm group-hover:scale-110 transition-transform`}>
              {icons[type]}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <span className={`text-[9px] font-black uppercase tracking-widest ${theme.icon}`}>
                  {type === 'success' ? 'Sucesso' : type === 'error' ? 'Erro' : 'Notificação'}
                </span>
                <Sparkles size={8} className="opacity-20" />
              </div>
              <p className={`text-sm font-bold ${theme.text} leading-tight`}>
                {message}
              </p>
              {action && (
                <button
                  onClick={() => {
                    action.onClick();
                    sonnerToast.dismiss(id);
                  }}
                  className={`mt-2 text-[10px] font-black uppercase tracking-widest ${theme.icon} hover:underline decoration-2 underline-offset-4`}
                >
                  {action.label}
                </button>
              )}
            </div>

            <button
              onClick={() => sonnerToast.dismiss(id)}
              className="p-2 text-[#2D1B18]/10 hover:text-[#2D1B18]/40 transition-colors"
            >
              <X size={16} />
            </button>
          </motion.div>
        ),
        { duration, ...rest },
      );
    },
    [],
  );

  return {
    success: (message: string, options?: UseToastOptions) =>
      show("success", message, options),
    error: (message: string, options?: UseToastOptions) =>
      show("error", message, options),
    info: (message: string, options?: UseToastOptions) =>
      show("info", message, options),
    warning: (message: string, options?: UseToastOptions) =>
      show("warning", message, options),
    dismiss: sonnerToast.dismiss,
  };
}

export function ToasterComponent() {
  return (
    <Toaster
      position="top-right"
      richColors={false}
      theme="light"
      expand={false}
      gap={12}
    />
  );
}
