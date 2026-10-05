"use client";

import { CloseIcon } from "@/constants/icons";
import { ArrowLeft, Trash2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import type { CategoryDTO } from "../mock/category";
import {
  formatAmountInput,
  formatAmountValue,
  parseAmountPt,
} from "../../utils/amount-mask";

export type CategoryFormMode = "create" | "edit";

export type CategoryFormValues = {
  name: string;
  flow: "EXPENSE" | "INCOME";
  /** null = sem limite (não envia). */
  limit: number | null;
};

type CategoryFormProps = {
  isOpen: boolean;
  onClose: () => void;
  /** Categoria a editar (também ativa o modo "edit" por omissão). */
  category?: CategoryDTO | null;
  /** Por omissão: "edit" se existir categoria, senão "create". */
  mode?: CategoryFormMode;
  /** ADMIN edita nome/tipo e elimina; os restantes só definem o limite. */
  canManage?: boolean;
  /** Chamado ao guardar. Devolve true em sucesso. */
  onSave?: (
    values: CategoryFormValues,
    category: CategoryDTO | null,
  ) => Promise<boolean>;
  /** Chamado ao confirmar a eliminação. Devolve true em sucesso. */
  onDelete?: (id: string) => Promise<boolean>;
  /** Chamado pelo botão "Voltar". Por omissão usa onClose. */
  onBack?: () => void;
};

function CategoryForm({
  isOpen,
  onClose,
  category,
  mode,
  canManage = false,
  onSave,
  onDelete,
  onBack,
}: CategoryFormProps) {
  const resolvedMode: CategoryFormMode = mode ?? (category ? "edit" : "create");
  const isEdit = resolvedMode === "edit";

  const [confirmDelete, setConfirmDelete] = useState(false);
  const [name, setName] = useState("");
  const [flow, setFlow] = useState<"EXPENSE" | "INCOME">("EXPENSE");
  const [limit, setLimit] = useState("");
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    setConfirmDelete(false);
    setSaving(false);
    setDeleting(false);
    setFormError(null);
    if (category) {
      setName(category.name);
      setFlow(category.flow);
      setLimit(
        category.limit != null ? formatAmountValue(category.limit) : "",
      );
    } else {
      setName("");
      setFlow("EXPENSE");
      setLimit("");
    }
  }, [isOpen, category, mode]);

  const headerTitle = isEdit ? "Editar categoria" : "Nova categoria";
  const primaryLabel = isEdit ? "Actualizar" : "Salvar";
  const fieldsLocked = isEdit && !canManage;

  const fieldLabel =
    "font-manrope text-sm font-bold leading-5 text-(--text-description)";
  const fieldBox =
    "rounded-xl border border-(--border-button) bg-(--background) focus:border-(--border) focus:outline-none";

  async function handleSave() {
    if (saving) return;
    if (!name.trim()) {
      setFormError("Dê um nome à categoria.");
      return;
    }
    const parsedLimit = limit.trim() ? parseAmountPt(limit) : null;
    if (limit.trim() && parsedLimit === null) {
      setFormError("Indique um limite válido superior a 0 Kz.");
      return;
    }
    setSaving(true);
    setFormError(null);
    const ok = await onSave?.(
      { name: name.trim(), flow, limit: parsedLimit },
      category ?? null,
    );
    setSaving(false);
    if (ok) onClose();
    else setFormError("Não foi possível guardar. Tente novamente.");
  }

  async function handleDelete() {
    if (!category || deleting) return;
    setDeleting(true);
    const ok = await onDelete?.(category.id);
    setDeleting(false);
    if (ok) onClose();
    else setFormError("Não foi possível eliminar. Tente novamente.");
  }

  return (
    <div
      className={`fixed inset-0 z-[60] bg-sky-950/40 backdrop-blur transition-opacity duration-300 lg:bg-transparent ${isOpen ? "opacity-100" : "pointer-events-none opacity-0"}`}
      onClick={onClose}
    >
      <aside
        className={`fixed inset-x-0 bottom-0 top-auto z-50 max-h-[calc(100dvh-3rem)] flex w-full max-w-full flex-col items-start justify-between rounded-t-3xl border-t border-(--card-barras) bg-(--background) transition-transform duration-300 ease-out lg:inset-x-auto lg:bottom-auto lg:left-auto lg:right-0 lg:top-0 lg:h-screen lg:max-h-dvh lg:w-125 lg:rounded-none lg:border-l lg:border-t-0 ${isOpen ? "translate-x-0 translate-y-0 lg:translate-x-0" : "translate-x-0 translate-y-full lg:translate-x-full lg:translate-y-0"}}`}
        onClick={(event) => event.stopPropagation()}
      >
        <div
          aria-hidden="true"
          className="mx-auto mt-2 h-1 w-10 shrink-0 rounded-xs bg-zinc-300 lg:hidden"
        />
        {confirmDelete && category ? (
          <>
            <div className="flex min-h-0 flex-1 flex-col items-start self-stretch overflow-y-auto">
              <header className="flex items-center justify-between self-stretch border-b border-(--card-barras) p-6">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setConfirmDelete(false)}
                    aria-label="Voltar"
                    className="rounded-lg p-1 transition-all hover:bg-neutrals-300/10 active:scale-90"
                  >
                    <ArrowLeft width={16} height={16} className="text-(--icon)" />
                  </button>
                  <h2 className="font-manrope text-lg font-bold leading-7 text-(--text-title)">
                    Eliminar categoria
                  </h2>
                </div>
              </header>
              <section className="flex flex-col items-center justify-center gap-5 self-stretch px-6 py-10">
                <div className="flex size-14 shrink-0 items-center justify-center rounded-full bg-danger-300/10">
                  <Trash2 width={24} height={24} className="text-danger-300" />
                </div>
                <div className="flex flex-col items-center justify-center gap-1.5 self-stretch">
                  <p className="text-center font-manrope text-base font-bold leading-6 text-(--text)">
                    Tem certeza que deseja eliminar esta categoria?
                  </p>
                  <p className="w-96 text-center font-manrope text-sm font-medium leading-5 text-(--text-description)">
                    Esta acção irá remover permanentemente a categoria &quot;
                    <span className="font-bold">{category.name}</span>&quot; e
                    todo o progresso associado. Esta operação não pode ser
                    desfeita.
                  </p>
                </div>
                {formError ? (
                  <p role="alert" className="font-manrope text-[13px] font-semibold text-danger-300">
                    {formError}
                  </p>
                ) : null}
              </section>
            </div>
            <footer className="flex shrink-0 flex-col items-start justify-end gap-2.5 self-stretch border-t border-(--card-barras) p-6">
              <div className="flex items-start gap-4 self-stretch">
                <button
                  type="button"
                  onClick={() => setConfirmDelete(false)}
                  className="flex w-56 items-center justify-center gap-2.5 rounded-2xl border border-(--border-button) p-3.5 text-(--text-title) transition-all hover:bg-neutrals-300/10 active:scale-[0.98] active:bg-neutrals-300/20"
                >
                  <span className="font-manrope text-base font-bold leading-normal">
                    Não
                  </span>
                </button>
                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={deleting}
                  className="flex w-56 items-center justify-center gap-2.5 rounded-2xl bg-danger-300 p-3.5 text-base-white shadow-[0px_4px_12px_rgba(5,61,196,0.15)] transition-all hover:opacity-90 active:scale-[0.98] active:opacity-80 disabled:cursor-wait disabled:opacity-60"
                >
                  <span className="text-center font-manrope text-base font-bold leading-normal">
                    {deleting ? "A eliminar…" : "Sim, Eliminar"}
                  </span>
                </button>
              </div>
            </footer>
          </>
        ) : (
          <>
            <div className="flex min-h-0 flex-1 flex-col items-start self-stretch overflow-y-auto">
              <header className="flex h-24 shrink-0 items-center justify-between self-stretch border-b border-(--card-barras) p-6">
                <h2 className="font-manrope text-lg font-bold leading-7 text-(--text-title)">
                  {headerTitle}
                </h2>
                <div className="flex items-center justify-start gap-2.5">
                  {isEdit &&
                  (canManage || category?.badge === "custom") ? (
                    <button
                      type="button"
                      onClick={() => setConfirmDelete(true)}
                      aria-label="Eliminar categoria"
                      title="Eliminar categoria"
                      className="rounded-lg p-1 text-danger-300 transition-all hover:bg-danger-300/10 active:scale-90"
                    >
                      <Trash2 width={20} height={20} />
                    </button>
                  ) : null}
                  <button
                    type="button"
                    onClick={onBack ?? onClose}
                    aria-label="Fechar"
                    className="rounded-lg p-1 transition-all hover:bg-neutrals-300/10 active:scale-90"
                  >
                    <CloseIcon width={24} className="text-(--menu-icon-cinza)" />
                  </button>
                </div>
              </header>

              <div className="flex flex-col items-start justify-start gap-6 self-stretch p-6">
                <div className="flex flex-col items-start justify-start gap-2 self-stretch">
                  <label htmlFor="category-name" className={fieldLabel}>
                    NOME
                  </label>
                  <input
                    id="category-name"
                    type="text"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    placeholder="Ex: Candongueiro"
                    maxLength={50}
                    readOnly={fieldsLocked}
                    aria-readonly={fieldsLocked || undefined}
                    className={`w-full px-4 py-3 font-manrope text-base leading-normal ${fieldBox} ${
                      fieldsLocked
                        ? "cursor-not-allowed font-medium text-(--text-description-60)"
                        : name
                          ? "bg-(--bg-filter) font-medium text-(--text)"
                          : "bg-(--background) font-medium text-(--text-description-60) placeholder:text-(--text-description-60)"
                    }`}
                  />
                </div>

                <div className="flex flex-col items-start justify-start gap-2 self-stretch">
                  <p className={fieldLabel}>TIPO</p>
                  <div
                    aria-disabled={fieldsLocked || undefined}
                    className={`flex items-start gap-1 self-stretch rounded-2xl border border-(--card-barras) bg-(--background-variant) p-[3px] ${
                      fieldsLocked ? "cursor-not-allowed opacity-60" : ""
                    }`}
                  >
                    <button
                      type="button"
                      disabled={fieldsLocked}
                      onClick={() => setFlow("EXPENSE")}
                      aria-pressed={flow === "EXPENSE"}
                      className={`flex flex-1 items-center justify-center rounded-xl px-4 py-3 transition-colors disabled:cursor-not-allowed ${
                        flow === "EXPENSE"
                          ? "bg-(--background) font-bold text-danger-300"
                          : "font-medium text-(--text-title) hover:bg-neutrals-300/10"
                      }`}
                    >
                      <span className="font-manrope text-base leading-normal">
                        Despesa
                      </span>
                    </button>
                    <button
                      type="button"
                      disabled={fieldsLocked}
                      onClick={() => setFlow("INCOME")}
                      aria-pressed={flow === "INCOME"}
                      className={`flex flex-1 items-center justify-center rounded-xl px-4 py-3 transition-colors disabled:cursor-not-allowed ${
                        flow === "INCOME"
                          ? "bg-(--background) font-bold text-primary-300"
                          : "font-medium text-(--text-title) hover:bg-neutrals-300/10"
                      }`}
                    >
                      <span className="font-manrope text-base leading-normal">
                        Receita
                      </span>
                    </button>
                  </div>
                </div>

                <div className="flex flex-col items-start justify-start gap-2 self-stretch">
                  <p className={fieldLabel}>
                    LIMITE DE GASTOS (
                    <span className="font-medium">OPCIONAL</span>)
                  </p>
                  <div
                    className={`flex w-full items-center justify-between bg-(--background) px-3.5 py-3 ${fieldBox}`}
                  >
                    <input
                      type="text"
                      inputMode="numeric"
                      value={limit}
                      onChange={(event) =>
                        setLimit(formatAmountInput(event.target.value))
                      }
                      placeholder="0,00"
                      aria-label="Limite de gastos"
                      className="min-w-0 flex-1 bg-transparent font-manrope text-base font-medium text-(--text) outline-none placeholder:text-(--text-description-60)"
                    />
                    <span className="shrink-0 font-manrope text-base font-medium text-(--text-description-60)">
                      Kz
                    </span>
                  </div>
                </div>

                {formError ? (
                  <p role="alert" className="font-manrope text-[13px] font-semibold text-danger-300">
                    {formError}
                  </p>
                ) : null}
              </div>
            </div>

            <footer className="flex shrink-0 flex-col items-start justify-end gap-2.5 self-stretch border-t border-(--card-barras) p-6">
              <div className="flex items-start gap-4 self-stretch">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex w-56 items-center justify-center gap-2.5 rounded-2xl border border-(--border-button) p-3.5 text-(--text-title) transition-all hover:bg-neutrals-300/10 active:scale-[0.98] active:bg-neutrals-300/20"
                >
                  <span className="font-manrope text-base font-bold leading-normal">
                    Cancelar
                  </span>
                </button>
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={saving}
                  className="flex w-56 items-center justify-center gap-2.5 rounded-2xl bg-primary-300 p-3.5 text-base-white shadow-[0px_4px_12px_rgba(5,61,196,0.15)] transition-all hover:opacity-90 active:scale-[0.98] active:opacity-80 disabled:cursor-wait disabled:opacity-60"
                >
                  <span className="text-center font-manrope text-base font-bold leading-normal">
                    {saving ? "A guardar…" : primaryLabel}
                  </span>
                </button>
              </div>
            </footer>
          </>
        )}
      </aside>
    </div>
  );
}

export default CategoryForm;
