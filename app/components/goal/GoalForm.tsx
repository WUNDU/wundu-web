import { CloseIcon, GoalsIcon, MoneyIcon } from "@/constants/icons";
import { ArrowLeft, Calendar, ChevronRight, Trash2 } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import DropmenuCategoria from "../transaction/DropmenuCategoria";
import DropmenuData from "../transaction/DropmenuData";
import FloatingMenu from "../ui/FloatingMenu";
import type { GoalDTO, GoalType } from "../../types/dto/goal.dto";
import type { TransactionCategory } from "../../types/transaction";
import { transactionCategoryConfig } from "../config/transaction-category-config";
import { formatAOA } from "../../utils/format-AOA";
import { formatFullDatePT } from "../../utils/format-date-pt";
import {
  formatAmountInput,
  formatAmountValue,
  parseAmountPt,
} from "../../utils/amount-mask";
import { useCategory } from "@/hooks/use-category";
import { goalPercent, statusFor } from "./goal-status";

export type GoalFormMode = "create" | "edit" | "savings";

export type GoalSaveValues = {
  title: string;
  type: GoalType;
  targetAmount: number;
  startDate: string;
  endDate: string;
  categoryId: string;
  description: string;
};

export type GoalProgressValues = {
  amount: number;
  date: string;
};

type GoalFormProps = {
  isOpen: boolean;
  onClose: () => void;
  /** Meta a editar (também ativa o modo "edit" por omissão). */
  goal?: GoalDTO | null;
  /** Por omissão: "edit" se existir meta, senão "create". */
  mode?: GoalFormMode;
  /** Chamado ao guardar (criar ou atualizar). Devolve true em sucesso. */
  onSave?: (values: GoalSaveValues) => Promise<boolean>;
  /** Chamado ao adicionar poupança. Devolve true em sucesso. */
  onSaveProgress?: (values: GoalProgressValues) => Promise<boolean>;
  /** Chamado ao confirmar a eliminação. Devolve true em sucesso. */
  onDelete?: (id: string) => Promise<boolean>;
  /** Abre directamente no ecrã de confirmação de eliminação. */
  startInDelete?: boolean;
  /** Chamado pelo botão "Voltar". Por omissão usa onClose (revela os detalhes). */
  onBack?: () => void;
};

function toDateKey(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

const formatShortDate = (date: Date): string =>
  date.toLocaleDateString("pt-PT", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

function GoalForm({
  isOpen,
  onClose,
  goal,
  mode,
  onSave,
  onSaveProgress,
  onDelete,
  startInDelete = false,
  onBack,
}: GoalFormProps) {
  const resolvedMode: GoalFormMode = mode ?? (goal ? "edit" : "create");
  const isEdit = resolvedMode === "edit";
  const isSavings = resolvedMode === "savings";
  const { categories } = useCategory();

  const [confirmDelete, setConfirmDelete] = useState(false);
  const [prazo, setPrazo] = useState<"short" | "long">("short");
  const [title, setTitle] = useState("");
  const [target, setTarget] = useState("");
  const [note, setNote] = useState("");
  const [savingsAmount, setSavingsAmount] = useState("");
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [endOpen, setEndOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [savingsDate, setSavingsDate] = useState(() => new Date());
  const [savingsDateOpen, setSavingsDateOpen] = useState(false);
  const savingsDateAnchorRef = useRef<HTMLButtonElement>(null);
  const endDateAnchorRef = useRef<HTMLButtonElement>(null);
  const categoryAnchorRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    setConfirmDelete(
      startInDelete &&
        Boolean(goal) &&
        (mode ?? (goal ? "edit" : "create")) === "edit",
    );
    setCategoryOpen(false);
    setEndOpen(false);
    setSavingsDateOpen(false);
    setSaving(false);
    setDeleting(false);
    setFormError(null);
    setSavingsAmount("");
    if (goal) {
      setPrazo(goal.type === "LONG_TERM" ? "long" : "short");
      setTitle(goal.title);
      setTarget(
        Number.isFinite(goal.targetAmount)
          ? formatAmountValue(goal.targetAmount)
          : "",
      );
      setNote(goal.description ?? "");
      setStartDate(goal.startDate ? new Date(goal.startDate) : null);
      setEndDate(goal.endDate ? new Date(goal.endDate) : null);
      setSelectedCategory(goal.category);
    } else {
      setPrazo("short");
      setTitle("");
      setTarget("");
      setNote("");
      setStartDate(null);
      setEndDate(null);
      setSelectedCategory("");
    }
    setSavingsDate(new Date());
  }, [isOpen, goal, mode, startInDelete]);

  function resolveCategoryId(name: string): string | null {
    const found = categories.find(
      (category) => category.name.toLocaleLowerCase() === name.trim().toLocaleLowerCase(),
    );
    return found?.id ?? null;
  }

  async function handleSave() {
    if (saving) return;
    if (!title.trim()) {
      setFormError("Dê um título à meta.");
      return;
    }
    const parsedTarget = parseAmountPt(target);
    if (parsedTarget === null) {
      setFormError("Indique um valor objetivo superior a 0 Kz.");
      return;
    }
    if (!endDate) {
      setFormError("Selecione a data limite da meta.");
      return;
    }
    const start = startDate ?? new Date();
    if (endDate.getTime() < start.getTime()) {
      setFormError("A data limite tem de ser posterior ao início.");
      return;
    }
    if (!selectedCategory) {
      setFormError("Selecione uma categoria.");
      return;
    }
    const categoryId = resolveCategoryId(selectedCategory);
    if (!categoryId) {
      setFormError("Categoria indisponível. Tente novamente.");
      return;
    }
    setSaving(true);
    setFormError(null);
    const ok = await onSave?.({
      title: title.trim(),
      type: prazo === "long" ? "LONG_TERM" : "SHORT_TERM",
      targetAmount: parsedTarget,
      startDate: toDateKey(start),
      endDate: toDateKey(endDate),
      categoryId,
      description: note.trim(),
    });
    setSaving(false);
    if (ok) onClose();
    else setFormError("Não foi possível guardar. Tente novamente.");
  }

  async function handleSaveProgress() {
    if (saving || !goal) return;
    const parsed = parseAmountPt(savingsAmount);
    if (parsed === null) {
      setFormError("Indique um valor superior a 0 Kz.");
      return;
    }
    const remaining = Math.max(0, goal.targetAmount - goal.currentAmount);
    if (parsed > remaining) {
      setFormError(
        `O valor excede o que falta (${formatAOA(remaining)}).`,
      );
      return;
    }
    setSaving(true);
    setFormError(null);
    const ok = await onSaveProgress?.({
      amount: parsed,
      date: toDateKey(savingsDate),
    });
    setSaving(false);
    if (ok) onClose();
    else setFormError("Não foi possível registar. Tente novamente.");
  }

  async function handleDelete() {
    if (!goal || deleting) return;
    setDeleting(true);
    const ok = await onDelete?.(goal.id);
    setDeleting(false);
    if (ok) onClose();
    else setFormError("Não foi possível eliminar. Tente novamente.");
  }

  const categoryConfig = selectedCategory
    ? transactionCategoryConfig[selectedCategory as TransactionCategory]
    : undefined;
  const CategoryIcon = categoryConfig?.icon ?? MoneyIcon;

  const percent = goal ? goalPercent(goal) : 0;
  const status = statusFor(percent);

  const headerTitle =
    resolvedMode === "create"
      ? "Nova meta"
      : resolvedMode === "edit"
        ? "Editar meta"
        : "Adicionar poupança";

  const primaryLabel =
    resolvedMode === "create"
      ? "Salvar"
      : resolvedMode === "edit"
        ? "Actualizar"
        : "Adicionar";

  const fieldLabel =
    "text-sm not-italic font-semibold font-manrope leading-5 text-(--text-description)";
  const fieldBox =
    "rounded-2xl border border-(--border-button) bg-(--background) focus:border-(--border) focus:outline-none";

  return (
    <div
      className={`fixed inset-0 z-40 backdrop-blur transition-opacity duration-300 ${isOpen ? "opacity-100" : "pointer-events-none opacity-0"}`}
      onClick={onClose}
    >
      <aside
        className={`flex fixed right-0 top-0 z-50 h-screen max-h-dvh w-125 max-w-full flex-col justify-between items-start border-l border-(--card-barras) bg-(--background) transition-transform duration-300 ease-out ${isOpen ? "translate-x-0" : "translate-x-full"}`}
        onClick={(e) => e.stopPropagation()}
      >
        {confirmDelete && goal ? (
          <>
            <div className="flex min-h-0 flex-1 flex-col items-start self-stretch overflow-y-auto">
              <header className="flex p-6 justify-between items-center self-stretch border-b border-(--card-barras)">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setConfirmDelete(false)}
                    aria-label="Voltar"
                    className="rounded-lg p-1 hover:bg-neutrals-300/10 active:scale-90 transition-all"
                  >
                    <ArrowLeft
                      width={16}
                      height={16}
                      className="text-(--icon)"
                    />
                  </button>
                  <p className="text-lg not-italic font-bold font-manrope leading-7 text-(--text-title)">
                    Eliminar meta
                  </p>
                </div>
              </header>
              <section className="flex flex-col justify-center items-center gap-5 self-stretch px-6 py-10">
                <div className="flex size-14 shrink-0 justify-center items-center rounded-full bg-danger-300/10">
                  <Trash2 width={24} height={24} className="text-danger-300" />
                </div>
                <div className="flex flex-col justify-center items-center gap-1.5 self-stretch">
                  <p className="text-center text-base not-italic font-bold font-manrope leading-6 text-(--text)">
                    Tem certeza que deseja eliminar esta meta?
                  </p>
                  <p className="w-96 text-center text-sm not-italic font-medium font-manrope leading-5 text-(--text-description)">
                    Esta acção irá remover permanentemente a meta &quot;
                    <span className="font-bold">{goal.title}</span>&quot; e todo
                    o progresso associado. Esta operação não pode ser desfeita.
                  </p>
                </div>
              </section>
            </div>
            <div className="flex shrink-0 flex-col justify-end items-start gap-2.5 self-stretch p-6 border-t border-(--card-barras)">
              <div className="flex items-start gap-4 self-stretch">
                <button
                  type="button"
                  onClick={() => setConfirmDelete(false)}
                  className="flex w-56 p-3.5 justify-center items-center gap-2.5 rounded-2xl border border-(--border-button) text-(--text-title) hover:bg-neutrals-300/10 active:bg-neutrals-300/20 active:scale-[0.98] transition-all"
                >
                  <p className="text-base not-italic font-bold font-manrope leading-normal">
                    Não
                  </p>
                </button>
                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={deleting}
                  className="flex w-56 p-3.5 justify-center items-center gap-2.5 rounded-2xl bg-danger-300 text-base-white shadow-[0px_4px_12px_rgba(5,61,196,0.15)] hover:opacity-90 active:opacity-80 active:scale-[0.98] transition-all disabled:cursor-wait disabled:opacity-60"
                >
                  <p className="text-center text-base not-italic font-bold font-manrope leading-normal">
                    {deleting ? "A eliminar…" : "Sim, Eliminar"}
                  </p>
                </button>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="flex min-h-0 flex-1 flex-col items-start self-stretch overflow-y-auto">
              <header className="flex p-6 justify-between items-center self-stretch border-b border-(--card-barras)">
                <div className="flex items-center gap-2">
                  {resolvedMode !== "create" && (
                    <button
                      type="button"
                      onClick={onBack ?? onClose}
                      aria-label="Voltar"
                      className="rounded-lg p-1 hover:bg-neutrals-300/10 active:scale-90 transition-all"
                    >
                      <ArrowLeft
                        width={16}
                        height={16}
                        className="text-(--icon)"
                      />
                    </button>
                  )}
                  <p className="text-lg not-italic font-bold font-manrope leading-7 text-(--text-title)">
                    {headerTitle}
                  </p>
                </div>
                <span className="flex items-center gap-3">
                  {isEdit && (
                    <button
                      type="button"
                      onClick={() => setConfirmDelete(true)}
                      aria-label="Eliminar meta"
                      title="Eliminar meta"
                      className="rounded-lg p-1 text-danger-300 hover:bg-danger-300/10 active:scale-90 transition-all"
                    >
                      <Trash2 width={20} height={20} />
                    </button>
                  )}
                  {resolvedMode === "create" && (
                    <button
                      type="button"
                      onClick={onClose}
                      aria-label="Fechar"
                      className="rounded-lg hover:bg-neutrals-300/10 active:bg-neutrals-300/20 active:scale-90 transition-all"
                    >
                      <CloseIcon width={24} className="text-primary-900/50" />
                    </button>
                  )}
                </span>
              </header>

              {isSavings ? (
                <>
                  <section className="flex flex-col justify-center items-center gap-6 self-stretch px-6 py-6 border-b border-(--card-barras)">
                    {goal && (
                      <div className="flex items-center gap-4 p-2 rounded-3xl bg-(--bg-card) border border-(--card-barras) self-stretch">
                        <span
                          className={`flex size-16 shrink-0 justify-center items-center rounded-2xl ${status.tint}`}
                        >
                          <GoalsIcon className={status.color} />
                        </span>
                        <div className="flex flex-1 min-w-0 flex-col justify-between gap-2">
                          <p className="truncate text-base not-italic font-bold font-manrope text-(--text-title)">
                            {goal.title}
                          </p>
                          <div className="flex items-center gap-2">
                            <p className="text-base not-italic font-bold font-inter text-(--text-description)">
                              {formatAOA(goal.currentAmount)}
                            </p>
                            <p className="text-base not-italic font-medium font-inter text-(--text-description)">
                              de
                            </p>
                            <p className="text-base not-italic font-medium font-inter text-(--text-description)">
                              {formatAOA(goal.targetAmount)}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                    <div className="flex flex-col items-center gap-1.5">
                      <p className={fieldLabel}>VALOR DA TRANSAÇÃO</p>
                      <div className="flex flex-col items-center">
                        <div className="flex items-center justify-center gap-2 rounded-2xl border border-transparent px-4 py-1">
                          <input
                            type="text"
                            inputMode="numeric"
                            value={savingsAmount}
                            onChange={(event) =>
                              setSavingsAmount(
                                formatAmountInput(event.target.value),
                              )
                            }
                            placeholder="0,00"
                            aria-label="Valor da poupança"
                            size={Math.max(savingsAmount.length, 4)}
                            className="w-auto max-w-full min-w-0 bg-transparent text-center text-3xl not-italic font-bold text-(--text) outline-none placeholder:text-(--text-description)/40"
                          />
                          <span className="font-manrope text-[16px] font-bold text-(--text-description)">
                            Kz
                          </span>
                        </div>
                        <p className="text-sm not-italic font-semibold font-manrope leading-5 text-(--text-description)">
                          MÁX. {formatAOA(goal?.targetAmount ?? 0)}
                        </p>
                      </div>
                      {formError && isSavings ? (
                        <p role="alert" className="font-manrope text-[13px] font-semibold text-danger-300">
                          {formError}
                        </p>
                      ) : null}
                    </div>
                  </section>
                  <section className="flex flex-col justify-center items-start gap-5 self-stretch px-6 pt-6 pb-4">
                    <div className="grid grid-cols-2 gap-4 items-start self-stretch">
                      <div className="flex min-w-0 flex-1 flex-col items-start gap-2">
                        <p className={fieldLabel}>DATA</p>
                        <div className="relative w-full min-w-0">
                          <button
                            type="button"
                            ref={savingsDateAnchorRef}
                            onClick={() => setSavingsDateOpen((v) => !v)}
                            aria-expanded={savingsDateOpen}
                            className={`flex w-full min-w-0 px-4 py-3 justify-start items-center gap-2.5 rounded-2xl border border-(--border-button) bg-(--background) hover:bg-neutrals-300/10 active:scale-[0.98] transition-all`}
                          >
                            <Calendar width={16} className="shrink-0 text-primary-300" />
                            <p className="min-w-0 flex-1 truncate text-sm not-italic font-semibold font-manrope leading-5 text-(--text-description)">
                              {formatFullDatePT(savingsDate)}
                            </p>
                          </button>
                          <FloatingMenu
                            isOpen={savingsDateOpen}
                            anchorRef={savingsDateAnchorRef}
                            onClose={() => setSavingsDateOpen(false)}
                          >
                            <DropmenuData
                              isOpen={savingsDateOpen}
                              selected={savingsDate}
                              onSelect={(date) => {
                                setSavingsDate(date);
                                setSavingsDateOpen(false);
                              }}
                            />
                          </FloatingMenu>
                        </div>
                      </div>
                      <div className="flex min-w-0 flex-col items-start gap-2">
                        <div className="flex items-center gap-2">
                          <p className={fieldLabel}>CONTA</p>
                          <span className="rounded-md bg-primary-300/10 px-2 py-0.5 font-manrope text-[11px] font-bold leading-4 text-primary-300">
                            Brevemente
                          </span>
                        </div>
                        <button
                          type="button"
                          disabled
                          aria-disabled="true"
                          title="Seleção de conta disponível em breve"
                          className="flex w-full min-w-0 cursor-not-allowed items-center justify-start gap-2 rounded-2xl border border-(--border-button) bg-(--background) px-4 py-3 opacity-60"
                        >
                          <p className="min-w-0 flex-1 truncate text-left text-sm font-medium not-italic font-manrope leading-5 text-(--text-description-60)">
                            Conta padrão
                          </p>
                        </button>
                      </div>
                    </div>
                  </section>
                  <section className="flex flex-col items-start gap-4 self-stretch px-6 pt-2 pb-6">
                    <div className="flex flex-col items-start gap-2 self-stretch">
                      <p className={fieldLabel}>DESCRIÇÃO</p>
                      <input
                        type="text"
                        placeholder="Descreva a sua transação..."
                        className={`w-full p-3 font-manrope text-base not-italic font-medium leading-normal text-(--text-description) ${fieldBox}`}
                      />
                    </div>
                  </section>
                  <div className="self-stretch px-6">
                    <hr className="w-full h-px text-(--card-barras)" />
                  </div>
                  <section className="flex flex-col items-start gap-2 self-stretch h-20 px-6 pt-4 pb-6">
                    <p className={fieldLabel}>CATEGORIA</p>
                    <div
                      className={`flex h-11 p-3 justify-between items-center self-stretch rounded-2xl border border-(--border-button) bg-(--background-variant) opacity-80`}
                    >
                      <span className="flex items-center gap-2 rounded-lg px-2.5 py-1 bg-(--background-variant)">
                        <CategoryIcon className="size-5 text-(--text-description-60)" />
                        <p className="text-sm not-italic font-semibold font-manrope leading-5 text-(--text-description-60)">
                          {goal?.category ??
                            selectedCategory ??
                            "Selecionar categoria"}
                        </p>
                      </span>
                      <ChevronRight width={16} className="text-(--icon)" />
                    </div>
                  </section>
                  <div className="self-stretch px-6">
                    <hr className="w-full h-px text-(--card-barras)" />
                  </div>
                  <section className="flex flex-col items-start gap-2 self-stretch px-6 pb-10 pt-4">
                    <p className={fieldLabel}>NOTA ADICIONAL</p>
                    <textarea
                      placeholder="Adicione notas adicionais aqui..."
                      className={`w-full h-20 p-3 rounded-xl font-manrope text-sm not-italic font-normal leading-5 text-(--text-description-60) resize-none ${fieldBox}`}
                    />
                  </section>
                </>
              ) : (
                <section className="flex flex-col items-start self-stretch py-6">
                  <div className="flex flex-col justify-center items-center gap-6 self-stretch px-6 py-2 border-b border-(--card-barras)">
                    <div className="flex flex-col items-center gap-2 self-stretch">
                      <p className={fieldLabel}>TIPO DE PRAZO</p>
                      <div className="flex items-start gap-1 self-stretch p-[3px] rounded-2xl bg-(--background-variant) border border-(--card-barras)">
                        <button
                          type="button"
                          onClick={() => setPrazo("short")}
                          aria-pressed={prazo === "short"}
                          className={`flex-1 px-4 py-3 rounded-xl flex justify-center items-center transition-colors ${
                            prazo === "short"
                              ? "bg-(--background) text-primary-300"
                              : "text-(--text-title) hover:bg-neutrals-300/10"
                          }`}
                        >
                          <p
                            className={`text-base not-italic font-manrope leading-normal ${
                              prazo === "short" ? "font-bold" : "font-medium"
                            }`}
                          >
                            Curto Prazo
                          </p>
                        </button>
                        <button
                          type="button"
                          onClick={() => setPrazo("long")}
                          aria-pressed={prazo === "long"}
                          className={`flex-1 px-4 py-3 rounded-xl flex justify-center items-center transition-colors ${
                            prazo === "long"
                              ? "bg-(--background) text-primary-300"
                              : "text-(--text-title) hover:bg-neutrals-300/10"
                          }`}
                        >
                          <p
                            className={`text-base not-italic font-manrope leading-normal ${
                              prazo === "long" ? "font-bold" : "font-medium"
                            }`}
                          >
                            Longo Prazo
                          </p>
                        </button>
                      </div>
                    </div>
                    <div className="flex flex-col items-center gap-1.5">
                      <p className={fieldLabel}>VALOR OBJECTIVO DA META</p>
                      <div className="flex items-center justify-center gap-2 rounded-2xl border border-transparent px-4 py-1">
                        <input
                          type="text"
                          inputMode="numeric"
                          value={target}
                          onChange={(event) =>
                            setTarget(formatAmountInput(event.target.value))
                          }
                          placeholder="0,00"
                          aria-label="Valor objetivo da meta"
                          size={Math.max(target.length, 4)}
                          className="w-auto max-w-full min-w-0 bg-transparent text-center text-3xl not-italic font-bold text-(--text) outline-none placeholder:text-(--text-description)/40"
                        />
                        <span className="font-manrope text-[16px] font-bold text-(--text-description)">
                          Kz
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col items-start gap-6 self-stretch px-6 pt-6 pb-3">
                    <div className="flex flex-col items-start gap-2 self-stretch">
                      <label htmlFor="goal-title" className={fieldLabel}>
                        TÍTULO
                      </label>
                      <input
                        id="goal-title"
                        type="text"
                        value={title}
                        onChange={(event) => setTitle(event.target.value)}
                        placeholder="Descreva a sua meta..."
                        className={`w-full p-3 font-manrope text-base not-italic leading-normal ${
                          title
                            ? "font-semibold text-(--text-title)"
                            : "font-medium text-(--text-description-60)"
                        } ${fieldBox}`}
                      />
                    </div>

                    <div className="flex items-start gap-4 self-stretch">
                      <div className="flex flex-1 flex-col items-start gap-2">
                        <p className={fieldLabel}>DATA DE INÍCIO</p>
                        <div className="relative w-full">
                          <button
                            type="button"
                            disabled
                            aria-label="Data de início (automática)"
                            title="A data de início é automática: hoje"
                            className={`flex w-full px-4 py-3 justify-start items-center gap-2.5 cursor-not-allowed opacity-60 ${fieldBox}`}
                          >
                            <Calendar width={16} className="text-primary-300" />
                            <p className="min-w-0 flex-1 truncate text-sm not-italic font-semibold font-manrope leading-5 text-(--text-title)">
                              {formatShortDate(startDate ?? new Date())}
                            </p>
                          </button>
                        </div>
                      </div>
                      <div className="flex flex-1 flex-col items-start gap-2">
                        <p className={fieldLabel}>DATA LIMITE</p>
                        <div className="relative w-full">
                          <button
                            type="button"
                            ref={endDateAnchorRef}
                            onClick={() => setEndOpen((v) => !v)}
                            aria-expanded={endOpen}
                            className={`flex w-full px-4 py-3 justify-start items-center gap-2.5 hover:bg-neutrals-300/10 active:scale-[0.98] transition-all ${fieldBox}`}
                          >
                            <Calendar width={16} className="text-primary-300" />
                            <p
                              className={`min-w-0 flex-1 truncate text-sm not-italic font-semibold font-manrope leading-5 ${
                                endDate
                                  ? "text-(--text-title)"
                                  : "text-(--text-description)"
                              }`}
                            >
                              {endDate
                                ? formatShortDate(endDate)
                                : "Seleccionar data"}
                            </p>
                          </button>
                          <FloatingMenu
                            isOpen={endOpen}
                            anchorRef={endDateAnchorRef}
                            onClose={() => setEndOpen(false)}
                          >
                            <DropmenuData
                              isOpen={endOpen}
                              selected={endDate ?? new Date()}
                              minDate={new Date()}
                              onSelect={(date) => {
                                setEndDate(date);
                                setEndOpen(false);
                              }}
                            />
                          </FloatingMenu>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col items-start gap-2 self-stretch">
                      <p className={fieldLabel}>CATEGORIA</p>
                      <div className="relative self-stretch">
                        <button
                          type="button"
                          ref={categoryAnchorRef}
                          onClick={() => setCategoryOpen((v) => !v)}
                          aria-expanded={categoryOpen}
                          className={`w-full p-3 flex justify-between items-center hover:bg-neutrals-300/10 active:scale-[0.99] transition-all ${fieldBox}`}
                        >
                          {selectedCategory && categoryConfig ? (
                            <span
                              className={`flex items-center gap-2 rounded-lg px-2.5 py-1 ${categoryConfig.background}`}
                            >
                              <CategoryIcon
                                className={`size-5 ${categoryConfig.iconColor ?? categoryConfig.color}`}
                              />
                              <span
                                className={`text-sm font-semibold ${categoryConfig.color}`}
                              >
                                {selectedCategory}
                              </span>
                            </span>
                          ) : (
                            <span className="text-sm font-normal font-manrope leading-5 text-(--text-description-60)">
                              Selecionar categoria
                            </span>
                          )}
                          <ChevronRight
                            width={16}
                            className={`text-(--icon) transition-transform duration-200 ${categoryOpen ? "rotate-90" : ""}`}
                          />
                        </button>
                        <FloatingMenu
                          isOpen={categoryOpen}
                          anchorRef={categoryAnchorRef}
                          onClose={() => setCategoryOpen(false)}
                        >
                          <DropmenuCategoria
                            isOpen={categoryOpen}
                            onSelect={(category) => {
                              setSelectedCategory(category);
                              setCategoryOpen(false);
                            }}
                          />
                        </FloatingMenu>
                      </div>
                    </div>

                    <hr className="w-full h-px text-(--card-barras)" />

                    <div className="flex flex-col items-start gap-2 self-stretch">
                      <label htmlFor="goal-note" className={fieldLabel}>
                        NOTA ADICIONAL
                      </label>
                      <textarea
                        id="goal-note"
                        value={note}
                        onChange={(event) => setNote(event.target.value)}
                        placeholder="Adicione notas adicionais aqui..."
                        className={`w-full h-20 p-3 rounded-xl font-manrope text-sm not-italic font-normal leading-5 text-(--text-description-60) resize-none ${fieldBox}`}
                      />
                      {formError && !isSavings ? (
                        <p role="alert" className="font-manrope text-[13px] font-semibold text-danger-300">
                          {formError}
                        </p>
                      ) : null}
                    </div>
                  </div>
                </section>
              )}
            </div>

            <div className="flex shrink-0 flex-col justify-end items-start gap-2.5 self-stretch p-6 border-t border-(--card-barras)">
              <div className="flex items-start gap-4 self-stretch">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex w-56 p-3.5 justify-center items-center gap-2.5 rounded-2xl border border-(--border-button) text-(--text-title) hover:bg-neutrals-300/10 active:bg-neutrals-300/20 active:scale-[0.98] transition-all"
                >
                  <p className="text-base not-italic font-bold font-manrope leading-normal">
                    Cancelar
                  </p>
                </button>
                <button
                  type="button"
                  onClick={isSavings ? handleSaveProgress : handleSave}
                  disabled={saving}
                  className="flex w-56 p-3.5 justify-center items-center gap-2.5 rounded-2xl bg-primary-300 text-base-white shadow-[0px_4px_12px_rgba(5,61,196,0.15)] hover:opacity-90 active:opacity-80 active:scale-[0.98] transition-all disabled:cursor-wait disabled:opacity-60"
                >
                  <p className="text-center text-base not-italic font-bold font-manrope leading-normal">
                    {saving ? "A guardar…" : primaryLabel}
                  </p>
                </button>
              </div>
            </div>
          </>
        )}
      </aside>
    </div>
  );
}

export default GoalForm;
