/**
 * wunduToast — typed wrapper over Sonner for consistent toast usage.
 *
 * Usage:
 *   wunduToast.success("Cadastro concluído!")
 *   wunduToast.error("Falha no servidor.", { description: "Tente novamente." })
 *   wunduToast.info("Nova actualização disponível.")
 *   wunduToast.warning("Sessão expira em 5 minutos.")
 *   wunduToast.promise(fetchData(), { loading: "A carregar...", success: "OK!", error: "Falhou." })
 *   wunduToast.dismiss()    // dismiss all
 *   wunduToast.dismiss(id)  // dismiss specific
 */
import { toast } from "sonner";
import type { ExternalToast } from "sonner";

type ToastOptions = ExternalToast & {
  description?: string;
};

export const wunduToast = {
  success: (title: string, options?: ToastOptions) =>
    toast.success(title, options),

  error: (title: string, options?: ToastOptions) => toast.error(title, options),

  info: (title: string, options?: ToastOptions) => toast.info(title, options),

  warning: (title: string, options?: ToastOptions) =>
    toast.warning(title, options),

  loading: (title: string, options?: ToastOptions) =>
    toast.loading(title, options),

  promise: toast.promise,

  dismiss: (id?: string | number) => toast.dismiss(id),
} as const;

export type { ToastOptions };
