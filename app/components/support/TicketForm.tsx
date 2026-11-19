"use client";

import { useRef, useState } from "react";
import { ChevronDown, Paperclip } from "lucide-react";
import { MessageIcon } from "@/constants/icons";
import FloatingMenu from "app/components/ui/FloatingMenu";
import SearchableMenu from "app/components/ui/SearchableMenu";

const CATEGORIES = ["Transações", "Contas", "Metas", "Perfil", "Outro"];

type TicketFormProps = {
  onSubmit?: (data: { email: string; category: string; subject: string; description: string }) => void;
};

function TicketForm({ onSubmit }: TicketFormProps) {
  const [email, setEmail] = useState("");
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [fileName, setFileName] = useState("");
  const [categoryOpen, setCategoryOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const categoryAnchorRef = useRef<HTMLButtonElement>(null);

  const canSubmit = email.trim() !== "" && subject.trim() !== "" && description.trim() !== "";

  const fieldLabel =
    "font-manrope text-sm font-medium leading-5 text-(--text-description)";
  const fieldBox =
    "w-full rounded-lg border border-(--card-barras) bg-(--background) px-4 py-3 font-manrope text-base font-normal text-(--text-title) outline-none transition-colors placeholder:text-(--text-description) focus:border-(--border)";

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        if (!canSubmit) return;
        onSubmit?.({ email, category, subject, description });
      }}
      className="flex w-full flex-col items-start justify-start gap-4 overflow-hidden rounded-xl border border-(--border-button) bg-(--bg-card) p-6"
    >
      <header className="flex flex-col items-start justify-start gap-1 self-stretch">
        <div className="flex items-center justify-start gap-3">
          <MessageIcon width={16} height={16} className="text-(--menu-icon-cinza)" aria-hidden="true" />
          <h2 className="font-manrope text-lg font-bold leading-7 text-(--text)">Novo Chamado</h2>
        </div>
        <p className="self-stretch font-manrope text-sm font-normal leading-5 text-(--text-description)">
          Descreva o que aconteceu. A resposta será enviada para o email indicado.
        </p>
      </header>

      <div className="grid flex-1 grid-cols-1 items-start gap-5 self-stretch sm:grid-cols-2">
        <div className="flex flex-col items-start justify-start gap-2">
          <label htmlFor="ticket-email" className={fieldLabel}>
            Email de resposta{" "}
            <span className="text-danger-300" aria-hidden="true">
              *
            </span>
          </label>
          <input
            id="ticket-email"
            type="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="O seu endereço de email"
            className={fieldBox}
          />
        </div>

        <div className="flex flex-col items-start justify-start gap-2">
          <span id="ticket-category-label" className={fieldLabel}>
            Categoria{" "}
            <span className="text-danger-300" aria-hidden="true">
              *
            </span>
          </span>
          <div className="relative w-full">
            <button
              type="button"
              ref={categoryAnchorRef}
              onClick={() => setCategoryOpen((value) => !value)}
              aria-expanded={categoryOpen}
              aria-labelledby="ticket-category-label"
              className={`${fieldBox} flex items-center justify-between gap-2 text-left transition-colors hover:bg-neutrals-300/10 active:scale-[0.99]`}
            >
              <span className="min-w-0 flex-1 truncate text-left font-manrope text-base font-normal text-(--text-title)">
                {category}
              </span>
              <ChevronDown
                width={14}
                height={14}
                aria-hidden="true"
                className={`shrink-0 text-(--icon-hover) transition-transform duration-200 ${categoryOpen ? "rotate-180" : ""}`}
              />
            </button>
            <FloatingMenu
              isOpen={categoryOpen}
              anchorRef={categoryAnchorRef}
              onClose={() => setCategoryOpen(false)}
            >
              <SearchableMenu
                isOpen={categoryOpen}
                options={CATEGORIES.map((item) => ({ id: item, label: item }))}
                value={category}
                placeholder="Pesquisar categoria"
                emptyText="Sem categorias."
                onSelect={(id) => {
                  setCategory(id);
                  setCategoryOpen(false);
                }}
              />
            </FloatingMenu>
          </div>
        </div>
      </div>

      <div className="flex flex-col items-start justify-start gap-2 self-stretch">
        <label htmlFor="ticket-subject" className={fieldLabel}>
          Assunto{" "}
          <span className="text-danger-300" aria-hidden="true">
            *
          </span>
        </label>
        <input
          id="ticket-subject"
          type="text"
          required
          value={subject}
          onChange={(event) => setSubject(event.target.value)}
          placeholder="Dúvida sobre uma transação"
          className={fieldBox}
        />
      </div>

      <div className="flex flex-col items-start justify-start gap-2 self-stretch">
        <label htmlFor="ticket-description" className={fieldLabel}>
          Descrição{" "}
          <span className="text-danger-300" aria-hidden="true">
            *
          </span>
        </label>
        <textarea
          id="ticket-description"
          required
          rows={4}
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          placeholder="Conte-nos o que aconteceu, quando ocorreu e como podemos ajudar."
          className={`${fieldBox} resize-none`}
        />
      </div>

      <div className="self-stretch">
        <input
          ref={fileInputRef}
          type="file"
          accept=".png,.jpg,.jpeg,.pdf"
          className="sr-only"
          onChange={(event) => setFileName(event.target.files?.[0]?.name ?? "")}
        />
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="flex w-full items-center justify-start gap-3 rounded-lg border border-(--card-barras) px-4 py-3 transition-colors hover:bg-(--card-bg-hover)"
        >
          <Paperclip width={20} height={20} aria-hidden="true" className="text-(--icon)" />
          <span className="font-manrope text-sm font-bold leading-5 text-(--text-link)">
            {fileName || "Adicionar anexo"}
          </span>
          <span className="font-manrope text-xs font-normal text-(--text-description)">
            Opcional · PNG, JPG ou PDF · até 10 MB
          </span>
        </button>
      </div>

      <footer className="flex items-center justify-between gap-4 self-stretch pt-1">
        <p className="font-manrope text-xs font-normal text-(--text-description)">
          <span className="text-danger-300" aria-hidden="true">
            *{" "}
          </span>
          Campos obrigatórios
        </p>
        <button
          type="submit"
          disabled={!canSubmit}
          className="flex w-56 items-center justify-center gap-2.5 rounded-2xl bg-primary-300 p-3.5 shadow-[0px_4px_12px_0px_rgba(5,61,196,0.15)] transition-opacity hover:opacity-90 active:scale-95 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <span className="text-center font-manrope text-base font-bold text-base-white">
            Enviar chamado
          </span>
        </button>
      </footer>
    </form>
  );
}

export default TicketForm;
