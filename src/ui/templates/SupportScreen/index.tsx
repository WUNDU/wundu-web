"use client";

import React, { useMemo, useState } from "react";
import { BottomNavigation } from "@/ui/organisms";
import { Button, TextInput } from "@/ui/atoms";
import { EmailIcon, HelpIcon, MessageIcon, PhoneIcon } from "@/constants/icons";
import { GreetingHeader } from "@/ui/molecules";
import SidebarRight from "@/ui/molecules/SideBarRight";
import { NotificationToast } from "@/ui/organisms/NotificationToast";

const SupportScreen: React.FC = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    topic: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const isFormValid = useMemo(() => {
    return form.name.trim() && form.email.trim() && form.message.trim();
  }, [form]);

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
      icon: <EmailIcon className="w-5 h-5 text-blue-500" />,
      title: "Email",
      description: "Envie-nos um email detalhando a sua questão",
      actionLabel: "support@wundu.com",
    },
    {
      icon: <PhoneIcon className="w-5 h-5 text-emerald-500" />,
      title: "Linha direta",
      description: "Resposta imediata nos dias úteis das 9h às 18h",
      actionLabel: "+351 900 000 000",
    },
    {
      icon: <MessageIcon className="w-5 h-5 text-purple-500" />,
      title: "Chat prioritário",
      description: "Converse com um especialista e acompanhe o seu ticket",
      actionLabel: "Disponível em breve",
    },
  ];

  const [isSidebarRightOpen, setIsSidebarRightOpen] = useState(false);
  const toggleSidebarRight = () => setIsSidebarRightOpen((prev) => !prev);

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30 relative overflow-hidden font-sans antialiased text-gray-800">
      <div className="flex-1 flex flex-col transition-all duration-500 ease-out">
        <GreetingHeader onToggleSidebar={toggleSidebarRight} />

        <main className="flex-1 overflow-y-auto px-5 pb-24 md:pb-10 space-y-6">
          <section className="pt-4">
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm px-6 py-5">
              <p className="text-xs uppercase tracking-[0.3em] text-gray-400">Suporte</p>
              <div className="mt-3 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
                <div>
                  <h1 className="text-2xl font-semibold text-gray-900 flex items-center gap-2">
                    <HelpIcon className="w-6 h-6 text-yellow-500" />
                    Suporte & Feedback
                  </h1>
                  <p className="text-sm text-gray-500">
                    Partilhe dúvidas, reporte problemas e ajude-nos a melhorar a sua experiência.
                  </p>
                </div>
              </div>
            </div>
          </section>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            <section className="bg-white rounded-3xl border border-gray-100 shadow-lg p-5 space-y-4 lg:col-span-2">
              <h2 className="text-base font-semibold text-gray-900">Canais de contacto</h2>
              <p className="text-sm text-gray-500">
                Escolha o melhor canal para o seu momento ou envie-nos uma mensagem no formulário.
              </p>
              <div className="space-y-4">
                {supportChannels.map((channel) => (
                  <div
                    key={channel.title}
                    className="p-4 rounded-2xl border border-gray-100 bg-gray-50/60"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-2xl bg-white shadow-sm">
                        {channel.icon}
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold text-gray-900">{channel.title}</h3>
                        <p className="text-xs text-gray-500">{channel.description}</p>
                      </div>
                    </div>
                    <p className="mt-3 text-sm font-medium text-gray-700">
                      {channel.actionLabel}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            <section className="bg-white rounded-3xl border border-gray-100 shadow-lg p-5 lg:col-span-3">
              <h2 className="text-base font-semibold text-gray-900">Envie-nos uma mensagem</h2>
              <p className="text-sm text-gray-500">Respondemos em média dentro de 24h úteis.</p>

              <form className="mt-4 space-y-4" onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  <label className="text-gray-600 text-sm font-medium">Mensagem</label>
                  <textarea
                    value={form.message}
                    onChange={(event) => handleChange("message", event.target.value)}
                    placeholder="Explique como podemos ajudar"
                    className="min-h-[160px] rounded-2xl border border-gray-200 px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none bg-gray-50"
                  />
                </div>

                {submitted && (
                  <div className="rounded-2xl border border-emerald-200 bg-emerald-50/80 px-4 py-3 text-sm text-emerald-700">
                    Obrigado! Recebemos o seu feedback e responderemos em breve.
                  </div>
                )}

                <div className="flex flex-wrap gap-3">
                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    className="flex-1 min-w-[180px]"
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
                    className="min-w-[140px] px-6"
                    disabled={isSubmitting}
                  >
                    Limpar campos
                  </Button>
                </div>
              </form>
            </section>
          </div>
        </main>

        <div className="md:hidden">
          <BottomNavigation />
        </div>
      </div>
      <SidebarRight isOpen={isSidebarRightOpen} onClose={toggleSidebarRight} />
      <NotificationToast />
    </div>
  );
};

export default SupportScreen;
