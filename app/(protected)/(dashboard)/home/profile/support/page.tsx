"use client";

import React, { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui";
import { TextInput } from "@/components/ui";
import {
  CloseIcon,
  EmailIcon,
  HelpIcon,
  MessageIcon,
  PhoneIcon,
} from "@/constants/icons";
import { useUiStore } from "@/store/ui-store";
import {
  CheckCircle,
  AlertCircle,
  Info,
} from "lucide-react";

const NotificationToast: React.FC = () => {
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
      timeout = setTimeout(() => setIsAnimating(false), 150);
    }
    return () => clearTimeout(timeout);
  }, [notification]);

  if (!isMounted || (!isAnimating && !notification)) return null;
  if (!notification) return null;

  const iconMap = {
    success: <CheckCircle className="w-5 h-5" />,
    error: <AlertCircle className="w-5 h-5" />,
    info: <Info className="w-5 h-5" />,
  };

  const bgMap = {
    success: "bg-emerald-50 text-emerald-600",
    error: "bg-rose-50 text-rose-600",
    info: "bg-blue-50 text-blue-600",
  };

  return createPortal(
    <div className="fixed top-6 right-6 z-[100] w-full max-w-sm animate-in fade-in slide-in-from-top-4 duration-300 pointer-events-auto">
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-3 flex items-center gap-3">
        <div className={`p-2 rounded-xl ${bgMap[notification.type]}`}>
          {iconMap[notification.type]}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-slate-900">{notification.title}</p>
          <p className="text-xs text-slate-500 truncate">{notification.message}</p>
        </div>
        <button onClick={closeNotification} className="p-1 hover:bg-slate-100 rounded-lg transition-colors">
          <CloseIcon className="w-4 h-4 text-slate-400" />
        </button>
      </div>
    </div>,
    document.body,
  );
};

export default function Support() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    topic: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const isFormValid = useMemo(
    () => form.name.trim() && form.email.trim() && form.message.trim(),
    [form],
  );

  const handleChange = (field: keyof typeof form, value: string) => {
    setSubmitted(false);
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!isFormValid) return;

    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 800));
    setSubmitted(true);
    setIsSubmitting(false);
    setForm({ name: "", email: "", topic: "", message: "" });
  };

  const handleReset = () => {
    setForm({ name: "", email: "", topic: "", message: "" });
    setSubmitted(false);
  };

  const supportChannels = [
    {
      icon: <EmailIcon className="w-5 h-5 text-[#003cc3]" />,
      title: "Email",
      description: "Envie-nos um email detalhando a sua questão",
      actionLabel: "Support@wundu.tech",
    },
    {
      icon: <PhoneIcon className="w-5 h-5 text-emerald-500" />,
      title: "Linha direta",
      description: "Resposta imediata nos dias úteis das 9h às 18h",
      actionLabel: "+351 900 000 000",
    },
    {
      icon: <MessageIcon className="w-5 h-5 text-indigo-500" />,
      title: "Chat prioritário",
      description: "Converse com um especialista e acompanhe o seu ticket",
      actionLabel: "Disponível em breve",
    },
  ];

  return (
    <>
      <main className="flex-1 overflow-y-auto px-3 sm:px-4 lg:px-5 pb-4 sm:pb-6 space-y-3 bg-slate-50">
        <motion.section
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.18, ease: "easeOut" as const }}
          className="pt-4"
        >
          <div className="bg-white rounded-xl border border-slate-100 shadow-sm px-3 sm:px-4 py-3 sm:py-4">
            <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Suporte</p>
            <div className="mt-3 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
              <div>
                <h1 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <HelpIcon className="w-5 h-5 text-[#ffd400]" />
                  Suporte & Feedback
                </h1>
                <p className="text-sm text-slate-500">
                  Partilhe dúvidas, reporte problemas e ajude-nos a melhorar a sua experiência.
                </p>
              </div>
            </div>
          </div>
        </motion.section>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-3 lg:gap-4">
          <motion.section
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.18, ease: "easeOut" as const, delay: 0.04 }}
            className="bg-white rounded-xl border border-slate-100 shadow-sm p-3 lg:p-4 space-y-3 lg:col-span-2"
          >
            <h2 className="text-sm font-bold text-slate-800">Canais de contacto</h2>
            <p className="text-sm text-slate-500">
              Escolha o melhor canal para o seu momento ou envie-nos uma mensagem no formulário.
            </p>
            <div className="space-y-3">
              {supportChannels.map((channel) => (
                <div
                  key={channel.title}
                  className="p-3 rounded-xl border border-slate-100 bg-slate-50"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-white border border-slate-100">{channel.icon}</div>
                    <div>
                      <h3 className="text-sm font-semibold text-slate-900">{channel.title}</h3>
                      <p className="text-xs text-slate-500">{channel.description}</p>
                    </div>
                  </div>
                  <p className="mt-3 text-sm font-medium text-slate-700">{channel.actionLabel}</p>
                </div>
              ))}
            </div>
          </motion.section>

          <motion.section
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.18, ease: "easeOut" as const, delay: 0.08 }}
            className="bg-white rounded-xl border border-slate-100 shadow-sm p-3 lg:p-4 lg:col-span-3"
          >
            <h2 className="text-sm font-bold text-slate-800">Envie-nos uma mensagem</h2>
            <p className="text-sm text-slate-500">Respondemos em média dentro de 24h úteis.</p>

            <form className="mt-3 space-y-3" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <TextInput
                  label="Nome completo"
                  placeholder="Ex: João Silva"
                  value={form.name}
                  onChange={(event) => handleChange("name", event.target.value)}
                />
                <TextInput
                  label="Email"
                  type="email"
                  placeholder="voce@email.com"
                  value={form.email}
                  onChange={(event) => handleChange("email", event.target.value)}
                />
              </div>

              <TextInput
                label="Assunto"
                placeholder="Actualização de objectivo, problema com upload..."
                value={form.topic}
                onChange={(event) => handleChange("topic", event.target.value)}
              />

              <div className="flex flex-col gap-2">
                <label className="text-slate-600 text-sm font-medium">Mensagem</label>
                <textarea
                  value={form.message}
                  onChange={(event) => handleChange("message", event.target.value)}
                  placeholder="Explique como podemos ajudar"
                  className="min-h-32 md:min-h-40 rounded-xl border border-slate-200 px-4 py-3 text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#003cc3]/35 resize-none bg-slate-50"
                />
              </div>

              {submitted && (
                <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2.5 text-sm text-emerald-700">
                  Obrigado! Recebemos o seu feedback e responderemos em breve.
                </div>
              )}

              <div className="flex flex-wrap gap-3">
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  className="flex-1 min-w-40 bg-[#003cc3] text-white hover:bg-[#002fa0]"
                  loading={isSubmitting}
                  disabled={!isFormValid || isSubmitting}
                >
                  Enviar mensagem
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  size="lg"
                  onClick={handleReset}
                  className="min-w-32 px-6"
                  disabled={isSubmitting}
                >
                  Limpar campos
                </Button>
              </div>
            </form>
          </motion.section>
        </div>
      </main>
      <NotificationToast />
    </>
  );
}
