"use client";

import { useRef, useState } from "react";
import { ChevronDown, FileText, Mail, MessageCircle, Phone } from "lucide-react";
import { PageHeader } from "app/components/layout";
import SupportHeader from "app/components/support/SupportHeader";
import TicketForm from "app/components/support/TicketForm";
import TicketConversation from "app/components/support/TicketConversation";

type Drawer = { kind: "form" } | { kind: "chat" } | { kind: "faq"; index: number };

const STATUS_STYLES: Record<string, string> = {
  "Em andamento": "bg-warning/10 text-warning",
  "Em análise": "bg-warning/10 text-warning",
  Resolvido: "bg-success/10 text-success",
  Aberto: "bg-info/10 text-info",
};

const FAQ_ITEMS = [
  {
    question: "Como recuperar a minha palavra-passe?",
    intro:
      "Pode criar uma nova palavra-passe através do email associado à sua conta Wundu.",
    steps: [
      "No ecrã de entrada, seleccione “Esqueci-me da palavra-passe”.",
      "Introduza o email da sua conta e envie o pedido de recuperação.",
      "Abra o email recebido e siga o link para definir uma nova palavra-passe.",
    ],
    tip: {
      title: "Não recebeu o email?",
      description:
        "Verifique a pasta de spam e confirme que utilizou o email associado à sua conta.",
    },
  },
  {
    question: "Como corrigir uma transação?",
    intro:
      "Se identificou um erro numa transação, abra um chamado na categoria “Transações” e anexe o comprovativo, se disponível.",
  },
  {
    question: "Como actualizar os dados do perfil?",
    intro:
      "Pode actualizar nome, email e outros dados em Definições → Perfil e guardar as alterações.",
  },
  {
    question: "Como adicionar uma conta bancária?",
    intro:
      "Abra a área de Contas no menu lateral, clique em “Adicionar conta” e escolha o banco.",
  },
];

const OPEN_TICKET = {
  reference: "#CH-2026-0148",
  subject: "Dúvida sobre uma transação",
  status: "Em análise",
  author: "Ana Silva",
  email: "ana.silva@email.com",
  createdAt: "15 out. 2026 · 09:42",
  description:
    "Possível cobrança duplicada na compra do supermercado de 14 de outubro. Foi realizado apenas um pagamento de 18.500,00 Kz.",
  attachment: {
    name: "Comprovativo da transação.pdf",
    hint: "Arquivo anexado ao formulário original",
  },
};

const TICKET_MESSAGES = [
  {
    id: "1",
    isUser: true,
    content:
      "A compra no supermercado de 14 de outubro aparece duas vezes na minha conta. Fiz apenas um pagamento de 18.500,00 Kz. Podem verificar se houve uma cobrança duplicada?",
    createdAt: "15 out. 2026 · 09:42",
  },
  {
    id: "2",
    isUser: false,
    content:
      "Olá, Ana. Estamos a verificar a possível cobrança duplicada. Vamos responder por aqui em até 1 dia útil.",
    createdAt: "15 out. 2026 · 10:18",
  },
  {
    id: "3",
    isUser: true,
    content: "Obrigada. Aguardo a confirmação por aqui.",
    createdAt: "15 out. 2026 · 10:25",
  },
];

const MY_TICKETS = [
  {
    reference: "CHAMADO-003",
    subject: "Ajuda com uma transação",
    status: "Em andamento",
    description:
      "A equipa está a analisar a sua solicitação. Consulte as mensagens no chamado.",
  },
  {
    reference: "CHAMADO-002",
    subject: "Problema ao adicionar conta bancária",
    status: "Em andamento",
    description:
      "A equipa está a analisar a sua solicitação. Consulte as mensagens no chamado.",
  },
  {
    reference: "CHAMADO-001",
    subject: "Palavra-passe não reconhecida",
    status: "Em andamento",
    description:
      "A equipa está a analisar a sua solicitação. Consulte as mensagens no chamado.",
  },
];

const outlineButton =
  "flex h-10 items-center justify-center gap-2 rounded-lg border-[1.5px] border-(--border-button) px-5 transition-colors hover:bg-(--card-bg-hover) active:scale-[0.98]";

export default function Support() {
  const [drawer, setDrawer] = useState<Drawer | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const lastDrawer = useRef<Drawer>({ kind: "form" });

  const openDrawer = (next: Drawer) => {
    lastDrawer.current = next;
    setDrawer(next);
    setIsOpen(true);
  };

  const closeDrawer = () => setIsOpen(false);

  const active = drawer ?? lastDrawer.current;
  const activeFaq = active.kind === "faq" ? FAQ_ITEMS[active.index] : null;

  return (
    <div className="flex h-full flex-col">
      <PageHeader title="Suporte" />
      <main className="flex min-h-0 flex-1 flex-col items-start gap-6 overflow-y-auto bg-(--settings-bg-config) px-6 pb-8 pt-6 lg:px-10 lg:pt-7">
        <header className="flex flex-col items-start justify-start gap-1 self-stretch">
          <h1 className="sr-only">Suporte</h1>
          <p className="font-manrope text-base font-normal text-(--text-description)">
            Como podemos ajudar? Escolha um canal ou envie uma solicitação à
            nossa equipa.
          </p>
        </header>

        <section
          aria-label="Canais de contacto"
          className="grid w-full grid-cols-1 items-stretch gap-5 md:grid-cols-3"
        >
          <article className="flex flex-col items-start justify-start gap-3 rounded-xl border border-(--card-barras) bg-(--bg-card) p-6">
            <div className="flex items-center justify-start gap-3 self-stretch">
              <span
                aria-hidden="true"
                className="flex size-10 shrink-0 items-center justify-center rounded-[10px] bg-primary-300/10"
              >
                <Mail width={24} height={24} className="text-(--icon-hover)" />
              </span>
              <h2 className="font-manrope text-lg font-bold leading-7 text-(--text-title)">
                Email
              </h2>
            </div>
            <p className="self-stretch font-manrope text-sm font-normal leading-5 text-(--text-description)">
              Envie a sua dúvida com todos os detalhes.
            </p>
            <p className="self-stretch font-manrope text-base font-bold text-(--text-title)">
              suporte@wundu.tech
            </p>
            <a href="mailto:suporte@wundu.tech" className={outlineButton}>
              <span className="text-center font-manrope text-sm font-medium leading-5 text-(--text-link)">
                Escrever email
              </span>
            </a>
          </article>

          <article className="flex flex-col items-start justify-start gap-3 rounded-xl border border-(--card-barras) bg-(--bg-card) p-6">
            <div className="flex items-center justify-start gap-3 self-stretch">
              <span
                aria-hidden="true"
                className="flex size-10 shrink-0 items-center justify-center rounded-[10px] bg-primary-300/10"
              >
                <Phone width={24} height={24} className="text-(--icon-hover)" />
              </span>
              <h2 className="font-manrope text-lg font-bold leading-7 text-(--text-title)">
                Telefone
              </h2>
            </div>
            <p className="self-stretch font-manrope text-sm font-normal leading-5 text-(--text-description)">
              Prefere falar? Consulte o contacto de atendimento.
            </p>
            <p className="self-stretch font-manrope text-base font-bold text-(--text-title)">
              +244 999 999 999
            </p>
            <a href="tel:+244999999999" className={outlineButton}>
              <span className="text-center font-manrope text-sm font-medium leading-5 text-(--text-link)">
                Consultar atendimento
              </span>
            </a>
          </article>

          <article className="flex flex-col items-start justify-start gap-3 rounded-xl border border-(--card-barras) bg-(--bg-card) p-6">
            <div className="flex items-center justify-start gap-3 self-stretch">
              <span
                aria-hidden="true"
                className="flex size-10 shrink-0 items-center justify-center rounded-[10px] bg-primary-300/10"
              >
                <MessageCircle
                  width={24}
                  height={24}
                  className="text-(--menu-icon-cinza)"
                />
              </span>
              <h2 className="font-manrope text-lg font-bold leading-7 text-(--text-title)">
                Chat de suporte
              </h2>
            </div>
            <p className="self-stretch font-manrope text-sm font-normal leading-5 text-(--text-description)">
              Converse com a equipa e acompanhe a resposta.
            </p>
            <p className="self-stretch font-manrope text-base font-bold text-(--text-title)">
              Uma conversa, um chamado
            </p>
            <button
              type="button"
              onClick={() => openDrawer({ kind: "form" })}
              className="flex h-10 items-center justify-center gap-2 rounded-lg bg-(--bg-button) px-5 transition-all hover:opacity-90 active:scale-[0.98]"
            >
              <span className="text-center font-manrope text-sm font-medium leading-5 text-(--button-fg)">
                Iniciar conversa
              </span>
            </button>
          </article>
        </section>

        <section
          aria-label="Chamados e perguntas frequentes"
          className="grid w-full grid-cols-1 items-start gap-6 lg:grid-cols-2"
        >
          <article className="flex flex-col items-start justify-start gap-4 rounded-xl border border-(--card-barras) bg-(--bg-card) p-6">
            <header className="flex items-center justify-start gap-2.5 self-stretch">
              <FileText
                width={20}
                height={20}
                aria-hidden="true"
                className="text-(--text-title)"
              />
              <h2 className="font-manrope text-lg font-bold leading-7 text-(--text-title)">
                Os meus chamados
              </h2>
            </header>

            <ul className="flex w-full flex-col items-start justify-start gap-2.5 self-stretch">
              {MY_TICKETS.map((ticket) => (
                <li key={ticket.reference} className="w-full">
                  <button
                    type="button"
                    onClick={() => openDrawer({ kind: "chat" })}
                    className="flex w-full flex-col items-start justify-start gap-2.5 rounded-lg bg-(--settings-bg-config) p-4 text-left transition-colors hover:opacity-90"
                  >
                    <span className="flex items-center justify-between gap-3 self-stretch">
                      <span className="font-manrope text-sm font-bold leading-5 text-(--text-description)">
                        {ticket.reference}
                      </span>
                      <span
                        className={`flex shrink-0 items-center justify-center rounded-md px-2.5 py-1 ${
                          STATUS_STYLES[ticket.status] ??
                          "bg-warning/10 text-warning"
                        }`}
                      >
                        <span className="font-inter text-xs font-medium">
                          {ticket.status}
                        </span>
                      </span>
                    </span>
                    <span className="self-stretch font-manrope text-base font-semibold text-(--text-title)">
                      {ticket.subject}
                    </span>
                    <span className="self-stretch font-manrope text-sm font-normal leading-5 text-(--text-description)">
                      {ticket.description}
                    </span>
                  </button>
                </li>
              ))}
            </ul>

            <button
              type="button"
              onClick={() => openDrawer({ kind: "chat" })}
              className={`${outlineButton} w-full`}
            >
              <span className="text-center font-manrope text-sm font-medium leading-5 text-(--text-link)">
                Ver os meus chamados
              </span>
            </button>
          </article>

          <article className="flex flex-col items-start justify-start gap-3 rounded-xl border border-(--card-barras) bg-(--bg-card) p-6">
            <h2 className="font-manrope text-lg font-bold leading-7 text-(--text-title)">
              Antes de entrar em contacto
            </h2>
            <p className="self-stretch font-manrope text-sm font-normal leading-5 text-(--text-description)">
              Encontre orientação para dúvidas frequentes.
            </p>
            <ul className="flex w-full flex-col items-start justify-start self-stretch">
              {FAQ_ITEMS.map((item, index) => (
                <li key={item.question} className="w-full">
                  <button
                    type="button"
                    onClick={() => openDrawer({ kind: "faq", index })}
                    className={`flex w-full items-center justify-start gap-3 p-3 transition-colors hover:bg-(--card-bg-hover) ${
                      index === 0
                        ? "rounded-lg bg-(--settings-bg-config)"
                        : "border-b-[0.5px] border-(--card-barras)"
                    }`}
                  >
                    <span className="flex-1 text-left font-manrope text-sm font-semibold leading-5 text-(--text-description)">
                      {item.question}
                    </span>
                    <ChevronDown
                      width={16}
                      height={16}
                      aria-hidden="true"
                      className="shrink-0 -rotate-90 text-(--icon-hover-2)"
                    />
                  </button>
                </li>
              ))}
            </ul>
          </article>
        </section>
      </main>

      <div
        className={`fixed inset-0 z-50 bg-base-black/40 backdrop-blur transition-opacity duration-300 lg:bg-zinc-300/30 ${
          isOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={closeDrawer}
        aria-hidden="true"
      />
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Painel de suporte"
        className={`fixed inset-x-0 bottom-0 top-auto z-50 flex max-h-dvh w-full max-w-full flex-col rounded-t-3xl border-t border-(--card-barras) bg-(--background) transition-transform duration-300 ease-out lg:inset-x-auto lg:bottom-auto lg:left-auto lg:right-0 lg:top-0 lg:h-screen lg:max-h-dvh lg:w-[860px] lg:rounded-none lg:border-l lg:border-t-0 ${
          isOpen
            ? "translate-x-0 translate-y-0 lg:translate-x-0"
            : "translate-x-0 translate-y-full lg:translate-x-full lg:translate-y-0"
        }`}
      >
        <div
          aria-hidden="true"
          className="mx-auto mt-2 h-1 w-10 shrink-0 rounded-xs bg-(--card-barras) lg:hidden"
        />
        {active.kind === "faq" ? (
          <>
            <SupportHeader
              title={activeFaq?.question ?? ""}
              onClose={closeDrawer}
            />
            <div className="w-full min-h-0 flex-1 overflow-y-auto px-6 py-6">
              <div className="flex w-full flex-col items-start justify-start gap-6 rounded-xl border border-(--card-barras) bg-(--menu-bg-aside) p-8">
                <p className="self-stretch font-manrope text-sm font-normal leading-5 text-(--text-description)">
                  {activeFaq?.intro}
                </p>
                {activeFaq?.steps?.length ? (
                  <ol className="flex flex-col items-start justify-start gap-5 self-stretch">
                    {activeFaq.steps.map((step, stepIndex) => (
                      <li
                        key={step}
                        className="flex items-start justify-start gap-3 self-stretch"
                      >
                        <span
                          aria-hidden="true"
                          className="flex size-6 shrink-0 items-center justify-center rounded-md bg-(--settings-bg-config) font-manrope text-sm font-semibold leading-5 text-(--text-title)"
                        >
                          {stepIndex + 1}
                        </span>
                        <span className="flex-1 font-manrope text-sm font-normal leading-5 text-(--text-description)">
                          {step}
                        </span>
                      </li>
                    ))}
                  </ol>
                ) : null}
                {activeFaq?.tip ? (
                  <aside className="flex flex-col items-start justify-start gap-1.5 self-stretch rounded-lg bg-(--settings-bg-config) p-4">
                    <p className="font-manrope text-sm font-semibold leading-5 text-(--text-title)">
                      {activeFaq.tip.title}
                    </p>
                    <p className="self-stretch font-manrope text-sm font-normal leading-5 text-(--text-description)">
                      {activeFaq.tip.description}
                    </p>
                  </aside>
                ) : null}
              </div>
            </div>
          </>
        ) : (
          <>
            <SupportHeader title="Suporte via Chamado" onClose={closeDrawer} />
            <div
              className={`min-h-0 flex-1 overflow-y-auto ${
                active.kind === "form" ? "px-6 py-6" : ""
              }`}
            >
              {active.kind === "form" ? (
                <TicketForm onSubmit={() => openDrawer({ kind: "chat" })} />
              ) : (
                <TicketConversation
                  ticket={OPEN_TICKET}
                  messages={TICKET_MESSAGES}
                />
              )}
            </div>
          </>
        )}
      </aside>
    </div>
  );
}
