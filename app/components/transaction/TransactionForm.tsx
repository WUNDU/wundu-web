import { CloseIcon, MoneyIcon } from "@/constants/icons";
import {
  Calendar,
  ChevronDown,
  ChevronRight,
  Trash2,
  ArrowLeft,
} from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import DropmenuCategoria from "./DropmenuCategoria";
import DropmenuData from "./DropmenuData";
import FloatingMenu from "../ui/FloatingMenu";
import type { TransactionDTO } from "../../types/dto/transaction.dto";
import type { TransactionCategory } from "../../types/transaction";
import { transactionCategoryConfig } from "../config/transaction-category-config";
import { formatFullDatePT } from "../../utils/format-date-pt";
import {
  formatAmountInput,
  formatAmountValue,
  parseAmountPt,
} from "../../utils/amount-mask";
import {
  TIME_PATTERN,
  currentTimeLabel,
  extractTimeLabel,
} from "../../utils/time-mask";

type TransactionFormProps = {
  isOpen: boolean;
  onClose: () => void;
  /** Se vier uma transação, o formulário abre em modo de edição. */
  transaction?: TransactionDTO | null;
  /** Chamado ao guardar (criar ou atualizar). Devolve true em sucesso. */
  onSave?: (values: TransactionFormValues) => Promise<boolean>;
  /** Chamado ao confirmar a eliminação. Devolve true em sucesso. */
  onDelete?: (id: string) => Promise<boolean>;
};

export type TransactionFormValues = {
  type: "income" | "expense";
  amount: number;
  description: string;
  category: string;
  /** Data no formato YYYY-MM-DD. */
  date: string;
  /** Hora no formato HH:MM (24h). */
  time: string;
};

function toDateKey(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function TransactionForm({
  isOpen,
  onClose,
  transaction,
  onSave,
  onDelete,
}: TransactionFormProps) {
  const isEdit = Boolean(transaction);
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [txType, setTxType] = useState<"expense" | "income">("income");
  const [dateOpen, setDateOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(() => new Date());
  const [time, setTime] = useState(() => currentTimeLabel());
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const dateAnchorRef = useRef<HTMLButtonElement>(null);
  const categoryAnchorRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    setCategoryOpen(false);
    setDateOpen(false);
    setConfirmDelete(false);
    setSaving(false);
    setDeleting(false);
    setFormError(null);
    if (transaction) {
      setTxType(transaction.type === "expense" ? "expense" : "income");
      setSelectedCategory(transaction.category);
      setSelectedDate(
        transaction.date ? new Date(transaction.date) : new Date(),
      );
      setTime(
        extractTimeLabel(transaction.transactionDate ?? transaction.date) ??
          currentTimeLabel(),
      );
      setDescription(transaction.description ?? "");
      setAmount(
        transaction && Number.isFinite(transaction.amount)
          ? formatAmountValue(transaction.amount)
          : "",
      );
    } else {
      setTxType("income");
      setSelectedCategory("");
      setSelectedDate(new Date());
      setTime(currentTimeLabel());
      setDescription("");
      setAmount("");
    }
  }, [isOpen, transaction]);

  async function handleSave() {
    if (saving) return;
    const parsed = parseAmountPt(amount);
    if (parsed === null) {
      setFormError("Indique um valor válido superior a 0 Kz.");
      return;
    }
    if (!selectedCategory) {
      setFormError("Selecione uma categoria.");
      return;
    }
    if (!TIME_PATTERN.test(time)) {
      setFormError("Indique a hora no formato HH:MM.");
      return;
    }
    setSaving(true);
    setFormError(null);
    const ok = await onSave?.({
      type: txType,
      amount: parsed,
      description: description.trim(),
      category: selectedCategory,
      date: toDateKey(selectedDate),
      time,
    });
    setSaving(false);
    if (ok) onClose();
    else setFormError("Não foi possível guardar. Tente novamente.");
  }

  async function handleDelete() {
    if (!transaction || deleting) return;
    setDeleting(true);
    const ok = await onDelete?.(transaction.id);
    setDeleting(false);
    if (ok) onClose();
    else setFormError("Não foi possível eliminar. Tente novamente.");
  }

  /** Troca o tipo e limpa a categoria se for do fluxo contrário. */
  function handleTypeChange(next: "expense" | "income") {
    setTxType(next);
    setSelectedCategory((current) => {
      if (!current) return current;
      const config =
        transactionCategoryConfig[current as TransactionCategory];
      const expected = next === "income" ? "INCOME" : "EXPENSE";
      return config?.flow === expected ? current : "";
    });
  }

  const categoryConfig = selectedCategory
    ? transactionCategoryConfig[selectedCategory as TransactionCategory]
    : undefined;
  const CategoryIcon = categoryConfig?.icon ?? MoneyIcon;

  return (
    <div
      className={`fixed inset-0 z-[60] bg-sky-950/40 backdrop-blur transition-opacity duration-300 lg:bg-transparent ${isOpen ? "opacity-100" : "pointer-events-none opacity-0"}`}
      onClick={onClose}
    >
      <aside
        className={`flex fixed inset-x-0 bottom-0 top-auto z-50 max-h-[calc(100dvh-3rem)] w-full max-w-full flex-col justify-between items-start rounded-t-3xl border-t border-(--card-barras) bg-(--background) transition-transform duration-300 ease-out lg:inset-x-auto lg:bottom-auto lg:left-auto lg:right-0 lg:top-0 lg:h-screen lg:max-h-dvh lg:w-125 lg:rounded-none lg:border-l lg:border-t-0 ${isOpen ? "translate-x-0 translate-y-0 lg:translate-x-0" : "translate-x-0 translate-y-full lg:translate-x-full lg:translate-y-0"}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          aria-hidden="true"
          className="mx-auto mt-2 h-1 w-10 shrink-0 rounded-xs bg-zinc-300 lg:hidden"
        />
        {confirmDelete && transaction ? (
          <>
            <div className="flex min-h-0 flex-1 flex-col items-start self-stretch overflow-y-auto">
              <header className="flex h-24 p-6 justify-between items-center self-stretch border-b border-(--card-barras)">
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
                    Eliminar transação
                  </p>
                </div>
              </header>
              <section className="flex flex-col justify-center items-center gap-5 self-stretch px-6 py-10">
                <div className="flex size-14 shrink-0 justify-center items-center rounded-full bg-danger-300/10">
                  <Trash2 width={24} height={24} className="text-danger-300" />
                </div>
                <div className="flex flex-col justify-center items-center gap-1.5 self-stretch">
                  <p className="text-center text-base not-italic font-bold font-manrope leading-6 text-(--text)">
                    Tem certeza que deseja eliminar esta transação?
                  </p>
                  <p className="w-full max-w-96 text-center text-sm not-italic font-medium font-manrope leading-5 text-(--text-description)">
                    Esta acção irá remover permanentemente a transação &quot;
                    {transaction.title}&quot; e todo o progresso associado. Esta
                    operação não pode ser desfeita.
                  </p>
                </div>
              </section>
            </div>
            <div className="flex shrink-0 flex-col justify-end items-start gap-2.5 self-stretch p-6 border-t border-(--card-barras)">
              <div className="flex items-start gap-4 self-stretch">
                <button
                  type="button"
                  onClick={() => setConfirmDelete(false)}
                  className="flex flex-1 p-3.5 justify-center items-center gap-2.5 rounded-2xl border border-(--border-button) text-(--text-title) hover:bg-neutrals-300/10 active:bg-neutrals-300/20 active:scale-[0.98] transition-all lg:w-56 lg:flex-none"
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
                <p className="text-base not-italic font-bold leading-[155.99%] text-(--text-title) lg:text-[18px]">
                  {isEdit ? "Editar transação" : "Adicionar transação"}
                </p>
                <span className="flex items-center gap-3">
                  {!isEdit && (
                    <button
                      type="button"
                      className="flex py-2 px-3 justify-center items-center gap-2 rounded-xl border-(--border-button) border bg-(--background) hover:bg-neutrals-300/10 active:bg-neutrals-300/20 active:scale-95 transition-all"
                    >
                      <p className="text-xs not-italic font-semibold leading-[155.99%] text-(--text-description) lg:text-[14px]">
                        Regular
                      </p>
                      <ChevronDown width={14} className="text-primary-900/50" />
                    </button>
                  )}
                  {isEdit && (
                    <button
                      type="button"
                      onClick={() => setConfirmDelete(true)}
                      aria-label="Eliminar transação"
                      title="Eliminar transação"
                      className="rounded-lg p-1 text-danger-300 hover:bg-danger-300/10 active:scale-90 transition-all"
                    >
                      <Trash2 width={20} height={20} />
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={onClose}
                    aria-label="Fechar"
                    className="rounded-lg hover:bg-neutrals-300/10 active:bg-neutrals-300/20 active:scale-90 transition-all"
                  >
                    <CloseIcon width={24} className="text-(--menu-icon-cinza)" />
                  </button>
                </span>
              </header>
              <section className="flex flex-col items-start self-stretch">
                <div className="flex py-2 px-6 flex-col justify-center items-center gap-5 self-stretch border border-(--card-barras)">
                  <div className="flex flex-col py-0 px-8 items-center gap-2.5 self-stretch">
                    <p className="text-(--text-description) text-xs not-italic font-semibold leading-[155.99%] uppercase lg:text-[14px]">
                      Tipo de tansação
                    </p>
                    <div className="relative flex p-0.75 items-start gap-1 rounded-2xl border border-(--card-barras) bg-(--background) w-full">
                      <span
                        aria-hidden="true"
                        className={`absolute top-0.75 bottom-0.75 left-0.75 w-[calc(50%-5px)] rounded-xl transition-transform duration-300 ease-out ${txType === "income" ? "translate-x-[calc(100%+4px)] bg-primary-300/20" : "translate-x-0 bg-danger-300/10"}`}
                      />
                      <button
                        type="button"
                        onClick={() => handleTypeChange("expense")}
                        aria-pressed={txType === "expense"}
                        className="relative flex py-2.5 px-4 justify-center items-center flex-1 self-stretch rounded-xl hover:bg-neutrals-300/10 active:bg-neutrals-300/20 active:scale-[0.98] transition-all lg:py-3"
                      >
                        <p
                          className={`${txType === "expense" ? "text-danger-300" : "text-(--text-title)"} text-sm not-italic font-medium leading-normal transition-colors lg:text-[16px]`}
                        >
                          Gastos
                        </p>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleTypeChange("income")}
                        aria-pressed={txType === "income"}
                        className="relative flex py-2.5 px-4 justify-center items-center flex-1 self-stretch rounded-xl hover:bg-neutrals-300/10 active:bg-neutrals-300/20 active:scale-[0.98] transition-all lg:py-3"
                      >
                        <p
                          className={`${txType === "income" ? "text-primary-300" : "text-(--text-title)"} text-sm not-italic font-medium leading-normal transition-colors lg:text-[16px]`}
                        >
                          Receitas
                        </p>
                      </button>
                    </div>
                    <div className="flex flex-col justify-center items-center gap-1.5 shrink-0 self-stretch">
                      <p className="text-xs not-italic leading-[155.99%] font-semibold text-(--text-description) uppercase lg:text-[14px]">
                        VALOR DA TRANSAÇÃO
                      </p>
                      <div className="flex items-center justify-center gap-2 rounded-2xl border border-transparent px-4 py-2">
                        <input
                          type="text"
                          inputMode="numeric"
                          value={amount}
                          onChange={(event) =>
                            setAmount(formatAmountInput(event.target.value))
                          }
                          placeholder="0,00"
                          aria-label="Valor da transação"
                          size={Math.max(amount.length, 4)}
                          className="w-auto max-w-full min-w-0 bg-transparent text-center font-sans text-2xl not-italic font-bold leading-normal text-(--text) lg:text-[30px] outline-none placeholder:text-(--text-description)/40"
                        />
                        <span className="font-manrope text-sm font-bold text-(--text-description) lg:text-[16px]">
                          Kz
                        </span>
                      </div>
                      {formError ? (
                        <p role="alert" className="font-manrope text-[13px] font-semibold text-danger-300">
                          {formError}
                        </p>
                      ) : null}
                    </div>
                  </div>
                </div>
              </section>
              <section className="flex flex-col justify-center items-start gap-5 self-stretch px-6 pt-6 pb-4">
                <div className="grid grid-cols-2 gap-4 items-start self-stretch">
                  <div className="flex min-w-0 flex-col items-start gap-2">
                    <p className="font-manrope text-xs not-italic font-semibold leading-[155.99%] text-(--text-description) lg:text-[14px]">
                      Data
                    </p>
                    <div className="relative w-full min-w-0">
                      <button
                        type="button"
                        ref={dateAnchorRef}
                        onClick={() => setDateOpen((value) => !value)}
                        aria-expanded={dateOpen}
                        className="flex w-full min-w-0 px-4 py-3 justify-start items-center gap-2.5 rounded-2xl border border-(--border-button) focus:border-(--border) focus:outline-none bg-(--bg-body) hover:bg-neutrals-300/10 active:bg-neutrals-300/20 active:scale-[0.98] transition-all"
                      >
                        <Calendar width={16} className="shrink-0 text-primary-300" />
                        <p className="min-w-0 flex-1 truncate font-manrope text-[14px] not-italic font-semibold leading-[21.839px] text-(--text-description)">
                          {formatFullDatePT(selectedDate)}
                        </p>
                      </button>
                      <FloatingMenu isOpen={dateOpen} anchorRef={dateAnchorRef} onClose={() => setDateOpen(false)}>
                        <DropmenuData
                          isOpen={dateOpen}
                          selected={selectedDate}
                          showTime
                          time={time}
                          onTimeChange={setTime}
                          onSelect={(date) => {
                            setSelectedDate(date);
                            setDateOpen(false);
                          }}
                        />
                      </FloatingMenu>
                    </div>
                  </div>
                  <div className="flex min-w-0 flex-col items-start gap-2">
                    <div className="flex items-center gap-2">
                      <p className="font-manrope text-xs not-italic font-semibold leading-[155.99%] text-(--text-description) lg:text-[14px]">
                        Conta
                      </p>
                      <span className="rounded-md bg-primary-300/10 px-2 py-0.5 font-manrope text-[11px] font-bold leading-4 text-primary-300">
                        Brevemente
                      </span>
                    </div>
                    <button
                      type="button"
                      disabled
                      aria-disabled="true"
                      title="Seleção de conta disponível em breve"
                      className="flex w-full min-w-0 cursor-not-allowed justify-start items-center gap-2 rounded-2xl border border-(--border-button) bg-(--bg-body) px-4 py-3 opacity-60"
                    >
                      <span className="flex min-w-0 flex-1 justify-start items-center">
                        <p className="truncate font-manrope text-[14px] not-italic font-medium leading-[21.839px] tracking-[-0.42px] text-(--text-description-60)">
                          Conta padrão
                        </p>
                      </span>
                    </button>
                  </div>
                </div>
              </section>
              <section className="flex flex-col items-start gap-4 self-stretch pt-2 px-6 pb-6">
                <div className="flex flex-col items-start gap-2 self-stretch">
                  <p className="text-(--text-description) font-manrope text-xs not-italic font-semibold leading-[21.839px] lg:text-[14px]">
                    DESCRIÇÃO
                  </p>
                  <input
                    type="text"
                    value={description}
                    onChange={(event) => setDescription(event.target.value)}
                    placeholder="Descreva a sua transação..."
                    className={`w-full border border-(--border-button) focus:border-(--border) focus:outline-none bg-(--background) rounded-2xl flex p-3 items-start font-manrope text-sm not-italic font-semibold leading-normal lg:text-base ${
                      description
                        ? "text-(--text-title)"
                        : "text-(--text-description)"
                    }`}
                  />
                </div>
              </section>
              <div className="flex flex-col items-start self-stretch pt-4 px-6 pb-6">
                <hr className="h-px w-full text-(--card-barras)" />
              </div>
              <section className="flex flex-col items-start gap-4 self-stretch pt-2 px-6 pb-6">
                <div className="flex flex-col items-start gap-2 self-stretch">
                  <p className="text-(--text-description) font-manrope text-xs not-italic font-semibold leading-[21.839px] lg:text-[14px]">
                    CATEGORIA
                  </p>
                    <div className="relative w-full">
                      <button
                        type="button"
                        ref={categoryAnchorRef}
                        onClick={() => setCategoryOpen((value) => !value)}
                      aria-expanded={categoryOpen}
                      className="w-full border border-(--border-button) focus:border-(--border) focus:outline-none bg-(--background) rounded-2xl flex p-3 items-center justify-between font-manrope text-sm not-italic font-medium leading-normal text-(--text) hover:bg-neutrals-300/10 lg:text-base active:bg-neutrals-300/20 active:scale-[0.99] transition-all"
                    >
                      {selectedCategory && categoryConfig ? (
                        <span
                          className={`flex items-center gap-2 rounded-lg px-2.5 py-1 ${categoryConfig.background}`}
                        >
                          <CategoryIcon
                            className={`w-5 h-5 ${categoryConfig.iconColor ?? categoryConfig.color}`}
                          />
                          <span
                            className={`text-[14px] font-semibold ${categoryConfig.color}`}
                          >
                            {selectedCategory}
                          </span>
                        </span>
                      ) : (
                        <span>Selecionar categoria</span>
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
                        flow={txType === "income" ? "INCOME" : "EXPENSE"}
                        onSelect={(category) => {
                          setSelectedCategory(category);
                          setCategoryOpen(false);
                        }}
                      />
                    </FloatingMenu>
                  </div>
                </div>
              </section>
              <div className="flex flex-col items-start self-stretch pt-4 px-6 pb-6">
                <hr className="h-px w-full text-(--card-barras)" />
              </div>
              <section className="flex flex-col items-start gap-4 self-stretch pt-2 px-6 pb-6">
                <div className="flex flex-col items-start gap-2 self-stretch">
                  <p className="text-(--text-description) font-manrope text-xs not-italic font-semibold leading-[21.839px] lg:text-[14px]">
                    NOTA ADICIONAL
                  </p>
                  <textarea
                    placeholder="Adicione notas adicionais aqui..."
                    className="border border-(--border-button) focus:border-(--border) focus:outline-none bg-(--background) rounded-2xl flex w-full p-3 items-start font-manrope text-sm not-italic font-medium leading-normal text-(--text-description) lg:text-base"
                  />
                </div>
              </section>
            </div>
            <div className="flex shrink-0 flex-col justify-end items-start gap-2.5 self-stretch p-6 border-t border-(--card-barras) lg:border">
              <div className="flex items-start gap-4 self-stretch">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex flex-1 p-3 justify-center items-center gap-2.5 rounded-2xl border border-(--card-barras) text-(--text-title) lg:p-3.5 hover:bg-neutrals-300/10 active:bg-neutrals-300/20 active:scale-[0.98] transition-all lg:w-54.5 lg:flex-none"
                >
                  <p className="text-(--text-description) font-manrope text-sm not-italic font-bold leading-normal lg:text-base">
                    Cancelar
                  </p>
                </button>
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={saving}
                  className="flex w-56 p-3 justify-center items-center gap-2.5 rounded-2xl border border-(--card-barras) bg-primary-300 lg:p-3.5 hover:opacity-90 active:opacity-80 active:scale-[0.98] transition-all disabled:cursor-wait disabled:opacity-60 lg:w-54.5"
                >
                  <p className="text-base-white font-manrope text-sm not-italic font-bold leading-normal lg:text-base">
                    {saving ? "A guardar…" : isEdit ? "Actualizar" : "Salvar"}
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

export default TransactionForm;
