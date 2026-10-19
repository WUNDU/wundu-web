"use client";

import { useState } from "react";
import { FileText } from "lucide-react";

type TicketMessage = {
  id: string;
  isUser: boolean;
  content: string;
  createdAt: string;
};

type TicketConversationProps = {
  ticket: {
    reference: string;
    subject: string;
    status: string;
    author: string;
    email: string;
    createdAt: string;
    description: string;
    attachment?: { name: string; hint: string };
  };
  messages: TicketMessage[];
  onReply?: (message: string) => void;
};

const STATUS_STYLES: Record<string, string> = {
  "Em análise": "bg-warning/10 text-warning",
  Resolvido: "bg-success/10 text-success",
  Aberto: "bg-info/10 text-info",
};

function TicketConversation({ ticket, messages, onReply }: TicketConversationProps) {
  const [reply, setReply] = useState("");

  const statusClass =
    STATUS_STYLES[ticket.status] ?? "bg-warning/10 text-warning";

  return (
    <section
      aria-label={`Conversa do chamado ${ticket.reference}`}
      className="flex flex-col items-start justify-start gap-6 self-stretch px-6 py-3"
    >
      <div className="flex flex-col items-start justify-start gap-4 self-stretch">
        <p className="self-stretch font-manrope text-xs font-normal text-(--text-description)">
          Chamado {ticket.reference}
        </p>

        <article className="flex flex-col items-start justify-start gap-3 self-stretch overflow-hidden rounded-xl border border-(--card-barras) bg-(--bg-card) p-5">
          <div className="flex items-center justify-between gap-4 self-stretch">
            <h3 className="font-manrope text-xl font-bold leading-8 text-(--text-title)">
              {ticket.subject}
            </h3>
            <span
              className={`flex shrink-0 items-center gap-1.5 rounded-lg px-2.5 py-[5px] ${statusClass}`}
            >
              <span aria-hidden="true" className="size-1.5 rounded-full bg-current" />
              <span className="font-manrope text-sm font-bold leading-5">{ticket.status}</span>
            </span>
          </div>

          <div className="flex items-center justify-between gap-4 self-stretch">
            <p className="min-w-0 truncate font-manrope text-sm font-bold leading-5 text-(--text-title)">
              {ticket.author}
              <span className="ml-2 font-normal text-(--text-description)">{ticket.email}</span>
            </p>
            <time className="shrink-0 font-manrope text-xs font-normal text-(--text-description)">
              {ticket.createdAt}
            </time>
          </div>

          <p className="self-stretch font-manrope text-sm font-normal leading-5 text-(--text-title)">
            {ticket.description}
          </p>

          {ticket.attachment ? (
            <div className="flex items-center justify-start gap-3 self-stretch rounded-xl border border-(--card-barras) bg-(--bg-body) p-3">
              <span
                aria-hidden="true"
                className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary-300/10"
              >
                <FileText width={20} height={20} className="text-(--icon-hover)" />
              </span>
              <span className="flex min-w-0 flex-1 flex-col items-start justify-start gap-0.5">
                <span className="self-stretch truncate font-manrope text-sm font-bold leading-5 text-(--text-description-60)">
                  {ticket.attachment.name}
                </span>
                <span className="self-stretch font-manrope text-xs font-normal text-(--text-description-60)">
                  {ticket.attachment.hint}
                </span>
              </span>
            </div>
          ) : null}
        </article>
      </div>

      <div className="flex flex-col items-start justify-start gap-6 self-stretch">
        <ol className="flex flex-col items-start justify-start gap-6 self-stretch">
          {messages.map((message) => (
            <li key={message.id} className="w-full">
              <article
                className={`flex flex-col items-start justify-start gap-3 self-stretch overflow-hidden rounded-xl border p-5 ${
                  message.isUser
                    ? "border-(--border-button) bg-(--card)"
                    : "border-(--card-barras) bg-(--bg-card)"
                }`}
              >
                <div className="flex items-center justify-between gap-4 self-stretch">
                  <p
                    className={`font-manrope text-sm font-bold leading-5 ${
                      message.isUser ? "text-(--text-link)" : "text-(--text-title)"
                    }`}
                  >
                    {message.isUser ? "Você" : "Equipa de suporte"}
                  </p>
                  <time className="font-manrope text-xs font-normal text-(--text-description)">
                    {message.createdAt}
                  </time>
                </div>
                <p className="self-stretch font-manrope text-sm font-normal leading-5 text-(--text-title)">
                  {message.content}
                </p>
              </article>
            </li>
          ))}
        </ol>

        <form
          onSubmit={(event) => {
            event.preventDefault();
            if (!reply.trim()) return;
            onReply?.(reply);
            setReply("");
          }}
          className="flex flex-col items-start justify-start gap-4 self-stretch py-5"
        >
          <h4 className="font-manrope text-lg font-bold leading-7 text-(--text-title)">
            Responder ao chamado
          </h4>
          <label htmlFor="ticket-reply" className="sr-only">
            Mensagem
          </label>
          <textarea
            id="ticket-reply"
            rows={3}
            value={reply}
            onChange={(event) => setReply(event.target.value)}
            placeholder="Escreva uma mensagem para a equipa de suporte…"
            className="w-full resize-none rounded-xl border border-(--border-button) bg-(--bg-card) px-4 pb-7 pt-3 font-manrope text-sm font-normal leading-5 text-(--text-title) outline-none transition-colors placeholder:text-(--text-description) focus:border-(--border)"
          />
          <div className="flex items-center justify-end self-stretch">
            <button
              type="submit"
              disabled={!reply.trim()}
              className="flex w-56 items-center justify-center gap-2.5 rounded-2xl bg-primary-300 p-3.5 shadow-[0px_4px_12px_0px_rgba(5,61,196,0.15)] transition-opacity hover:opacity-90 active:scale-95 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <span className="text-center font-manrope text-base font-bold text-base-white">
                Enviar mensagem
              </span>
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}

export default TicketConversation;
