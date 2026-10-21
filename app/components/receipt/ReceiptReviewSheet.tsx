"use client";

import { ArrowRight, ChevronRight, Eye, FileText, Sparkles, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useReceipt } from "app/components/layout/ReceiptProvider";
import { useTransaction } from "@/hooks/use-transaction";
import DropmenuCategoria from "app/components/transaction/DropmenuCategoria";
import FloatingMenu from "app/components/ui/FloatingMenu";
import { categoryVisual } from "app/utils/category-visual";
import { MoneyIcon } from "@/constants/icons";
import {
  formatAmountInput,
  formatAmountValue,
  parseAmountPt,
} from "app/utils/amount-mask";
import { toTransactionDateTimeISO } from "app/utils/transaction-date";

type ReceiptReviewSheetProps = {
  open: boolean;
  onClose: () => void;
};

const todayKey = () => {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${now.getFullYear()}-${month}-${day}`;
};

const currentTime = () => {
  const now = new Date();
  return `${String(now.getHours()).padStart(2, "0")}:${String(
    now.getMinutes(),
  ).padStart(2, "0")}`;
};

/**
 * Revisão de um comprovativo lido — portada do protótipo `wundu`
 * (`ReceiptReviewSheet`): confere os dados extraídos, assinala a confirmação e
 * guarda ("Salvar e seguinte") ou descarta o documento.
 */
export default function ReceiptReviewSheet({
  open,
  onClose,
}: ReceiptReviewSheetProps) {
  const receipt = useReceipt();
  const { updateTransaction, createTransaction, transactions, notPaginated } =
    useTransaction();

  const job = useMemo(
    () => receipt.items.find((item) => item.id === receipt.reviewId) ?? null,
    [receipt.items, receipt.reviewId],
  );

  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [date, setDate] = useState(todayKey());
  const [checked, setChecked] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  /** Campos por assinalar na última tentativa de guardar. */
  const [invalid, setInvalid] = useState<{
    amount?: boolean;
    category?: boolean;
    confirm?: boolean;
  }>({});
  const [preview, setPreview] = useState(false);
  const [url, setUrl] = useState("");
  const [categoryOpen, setCategoryOpen] = useState(false);
  const categoryAnchorRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!job) return;
    setAmount(job.draft?.amount ? formatAmountValue(job.draft.amount) : "");
    setDescription(job.draft?.description ?? "");
    setCategory(job.draft?.category ?? "");
    setDate(job.draft?.date ?? todayKey());
    setChecked(false);
    setError("");
    setInvalid({});
    setCategoryOpen(false);
  }, [job]);

  useEffect(() => {
    return () => {
      if (url) URL.revokeObjectURL(url);
    };
  }, [url]);

  // Visual da categoria (ícone e cor) — como no formulário de transação.
  const categoryConfig = useMemo(
    () => (category ? categoryVisual(category, "EXPENSE") : undefined),
    [category],
  );
  const CategoryIcon = categoryConfig?.icon ?? MoneyIcon;

  // Mesmo valor e data — como no protótipo (`possibleReceiptDuplicates`).
  const duplicates = useMemo(() => {
    const parsed = parseAmountPt(amount);
    if (!parsed || !date) return [];
    const rows = transactions ?? notPaginated ?? [];
    return rows.filter(
      (transaction) =>
        transaction.type === "EXPENSE" &&
        transaction.amount === parsed &&
        (transaction.transactionDate ?? "").slice(0, 10) === date,
    );
  }, [amount, date, notPaginated, transactions]);

  if (!open || !job) return null;

  const current = job;
  const readyJobs = receipt.ready;
  const position = readyJobs.findIndex((item) => item.id === current.id) + 1;
  const total = readyJobs.length;

  function openPreview() {
    if (!current.file) return;
    if (!url) setUrl(URL.createObjectURL(current.file));
    setPreview(true);
  }

  async function save() {
    if (!job || busy) return;
    // Valida tudo de uma vez e assinala cada campo que falta, para o
    // utilizador ver exactamente o que tem de corrigir.
    const parsed = parseAmountPt(amount);
    const problems: {
      amount?: boolean;
      category?: boolean;
      confirm?: boolean;
    } = {};
    if (!checked) problems.confirm = true;
    if (parsed === null) problems.amount = true;
    if (!category) problems.category = true;
    if (problems.confirm || problems.amount || problems.category) {
      setInvalid(problems);
      setError(
        problems.confirm
          ? "Revê os dados do comprovativo e assinala a confirmação."
          : problems.amount
            ? "Indica um valor válido superior a 0 Kz."
            : "Escolhe uma categoria.",
      );
      return;
    }
    if (parsed === null) return; // já acima (parsing)
    setInvalid({});
    setBusy(true);
    setError("");
    const payload = {
      amount: parsed,
      description: description.trim() || undefined,
      transactionDate: toTransactionDateTimeISO(date, currentTime()),
      category: { name: category, flow: "EXPENSE" as const },
    };
    // O backend cria a transação ao confirmar o documento: guardamos é
    // actualizar essa transação. Sem transação ligada, cria-se uma nova.
    const updated = current.linkedTransactionId
      ? await updateTransaction(current.linkedTransactionId, payload)
      : await createTransaction({
          type: "EXPENSE",
          source: "MANUAL",
          ...payload,
        });
    setBusy(false);
    if (!updated) {
      setError("Não foi possível guardar. Tenta novamente.");
      return;
    }
    receipt.markSaved(job.id);
    const next = readyJobs.find((item) => item.id !== job.id);
    if (next) receipt.openReview(next.id);
    else onClose();
  }

  function discard() {
    if (!job || busy) return;
    receipt.remove(job.id);
    const next = readyJobs.find((item) => item.id !== job.id);
    if (next) receipt.openReview(next.id);
    else onClose();
  }

  const isPdf =
    job.file?.type === "application/pdf" ||
    job.fileName.toLowerCase().endsWith(".pdf");

  return (
    <>
      <div
        className="fixed inset-0 z-[60] flex items-end justify-center bg-base-black/40 backdrop-blur transition-opacity duration-300 sm:items-center sm:p-4"
        onClick={() => !busy && onClose()}
      >
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Rever transação"
          className="flex max-h-[92dvh] w-full max-w-[440px] flex-col overflow-hidden rounded-t-3xl border border-(--card-barras) bg-(--background) sm:rounded-2xl"
          onClick={(event) => event.stopPropagation()}
        >
          <div
            aria-hidden="true"
            className="mx-auto mt-2 h-1 w-10 shrink-0 rounded-xs bg-(--card-barras) sm:hidden"
          />
          <header className="flex shrink-0 items-center gap-3 border-b border-(--card-barras) px-5 py-4">
            <p className="flex-1 font-manrope text-base font-bold leading-6 text-(--text-title)">
              Rever transação
            </p>
            <span className="rounded-full bg-(--bg-body) px-2 py-0.5 font-manrope text-[11px] font-semibold leading-4 text-(--text-description)">
              {position} de {total}
            </span>
            <button
              type="button"
              disabled={busy}
              onClick={onClose}
              aria-label="Fechar revisão"
              className="rounded-lg p-1 text-(--icon) transition-colors hover:bg-neutrals-300/10 disabled:opacity-60"
            >
              <X size={19} />
            </button>
          </header>

          <div className="flex min-h-0 flex-1 flex-col overflow-y-auto px-5 py-5">
            <fieldset
              disabled={busy}
              className="flex w-full min-w-0 flex-col items-start"
            >
              <button
                type="button"
                onClick={openPreview}
                disabled={!current.file}
                title={
                  current.file
                    ? "Ver comprovativo"
                    : "O comprovativo original já não está disponível neste dispositivo."
                }
                className="flex h-11 w-full items-center gap-2 rounded-xl bg-(--bg-body) px-3 text-left disabled:cursor-default disabled:opacity-70"
              >
                <FileText size={18} className="shrink-0 text-(--icon)" />
                <span className="min-w-0 flex-1 truncate font-manrope text-xs font-medium leading-5 text-(--text-title)">
                  {job.fileName}
                </span>
                {current.file ? (
                  <>
                    <Eye size={17} className="shrink-0 text-(--icon)" />
                    <small className="font-manrope text-[11px] font-semibold leading-4 text-primary-300">
                      Ver documento
                    </small>
                  </>
                ) : (
                  <small className="font-manrope text-[11px] font-semibold leading-4 text-(--text-description)">
                    Sem original
                  </small>
                )}
              </button>

              <label className="mt-5 flex w-full flex-col items-start gap-2">
                <span
                  className={`font-manrope text-[10px] font-semibold uppercase leading-5 ${
                    invalid.amount ? "text-danger-300" : "text-(--text-description)"
                  }`}
                >
                  Valor da transação
                </span>
                <div
                  className={`flex w-full items-center justify-center gap-2 rounded-xl border border-transparent px-4 py-2 transition-colors ${
                    invalid.amount ? "bg-danger-300/5" : ""
                  }`}
                >
                  <input
                    aria-label="Valor da despesa em Kz"
                    required
                    type="text"
                    inputMode="decimal"
                    value={amount}
                    onChange={(event) => {
                      setAmount(formatAmountInput(event.target.value));
                      if (invalid.amount) setInvalid((v) => ({ ...v, amount: false }));
                    }}
                    placeholder="0,00"
                    size={Math.max(amount.length, 4)}
                    className="w-auto max-w-full min-w-0 bg-transparent text-center font-manrope text-2xl font-bold leading-8 text-danger-300 outline-none placeholder:text-(--text-description)/40 lg:text-3xl"
                  />
                  <span className="font-manrope text-sm font-bold text-(--text-description) lg:text-base">
                    Kz
                  </span>
                </div>
              </label>

              <label className="mt-5 flex w-full min-w-0 flex-col items-start gap-2">
                <span className="font-manrope text-[10px] font-semibold uppercase leading-5 text-(--text-description)">
                  Descrição
                </span>
                <input
                  required
                  maxLength={100}
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                  placeholder="Fornecedor ou descrição"
                  className="h-11 w-full min-w-0 rounded-xl border border-(--border-button) bg-(--background) px-3 font-manrope text-sm font-medium leading-6 text-(--text) outline-none focus:border-(--border)"
                />
              </label>

              <div className="mt-5 grid w-full grid-cols-1 gap-3 sm:grid-cols-2">
                <div className="flex min-w-0 flex-col items-start gap-2">
                  <span
                    className={`flex h-5 w-full items-center gap-2 font-manrope text-[10px] font-semibold uppercase leading-5 ${
                      invalid.category ? "text-danger-300" : "text-(--text-description)"
                    }`}
                  >
                    Categoria
                    <em className="ml-auto flex items-center gap-1 rounded-full bg-primary-300/10 px-2 py-0.5 text-[9px] font-semibold leading-4 not-italic normal-case text-primary-300">
                      <Sparkles size={11} />
                      Sugerida
                    </em>
                  </span>
                  <div className="relative w-full">
                    <button
                      type="button"
                      ref={categoryAnchorRef}
                      onClick={() => setCategoryOpen((value) => !value)}
                      aria-expanded={categoryOpen}
                      aria-label="Categoria da despesa"
                      aria-invalid={invalid.category || undefined}
                      className={`flex h-11 w-full min-w-0 items-center justify-between gap-2 rounded-xl border px-3 text-left transition-colors active:scale-[0.99] ${
                        invalid.category
                          ? "border-danger-300 bg-danger-300/5"
                          : "border-(--border-button) bg-(--background) hover:bg-neutrals-300/10"
                      }`}
                    >
                      {category && categoryConfig ? (
                        <span
                          className={`flex min-w-0 items-center gap-2 rounded-md px-2 py-0.5 ${categoryConfig.background}`}
                        >
                          <CategoryIcon
                            className={`size-4 shrink-0 ${
                              categoryConfig.iconColor ?? categoryConfig.color
                            }`}
                          />
                          <span
                            className={`min-w-0 truncate text-sm font-semibold ${categoryConfig.color}`}
                          >
                            {category}
                          </span>
                        </span>
                      ) : (
                        <span className="font-manrope text-sm font-medium leading-6 text-(--text-description)">
                          Selecionar categoria
                        </span>
                      )}
                      <ChevronRight
                        width={16}
                        className={`shrink-0 text-(--icon) transition-transform duration-200 ${
                          categoryOpen ? "rotate-90" : ""
                        }`}
                      />
                    </button>
                    <FloatingMenu
                      isOpen={categoryOpen}
                      anchorRef={categoryAnchorRef}
                      onClose={() => setCategoryOpen(false)}
                    >
                      <DropmenuCategoria
                        isOpen={categoryOpen}
                        flow="EXPENSE"
                        onSelect={(value) => {
                          setCategory(value);
                          setCategoryOpen(false);
                          if (invalid.category) {
                            setInvalid((v) => ({ ...v, category: false }));
                          }
                        }}
                      />
                    </FloatingMenu>
                  </div>
                </div>
                <label className="flex min-w-0 flex-col items-start gap-2">
                  <span className="flex h-5 w-full items-center font-manrope text-[10px] font-semibold uppercase leading-5 text-(--text-description)">
                    Data
                  </span>
                  <input
                    aria-label="Data da despesa"
                    type="date"
                    required
                    max={todayKey()}
                    value={date}
                    onChange={(event) => setDate(event.target.value)}
                    className="h-11 w-full min-w-0 rounded-xl border border-(--border-button) bg-(--background) px-3 font-manrope text-sm font-medium leading-6 text-(--text) outline-none focus:border-(--border)"
                  />
                </label>
              </div>

              <div className="mt-5 flex w-full flex-col items-start gap-2">
                <div className="flex h-5 w-full items-center gap-2">
                  <span className="font-manrope text-[10px] font-semibold uppercase leading-5 text-(--text-description)">
                    Conta
                  </span>
                  <span className="rounded-md bg-primary-300/10 px-2 py-0.5 font-manrope text-xs font-bold leading-4 text-primary-300">
                    Brevemente
                  </span>
                </div>
                <div className="flex h-11 w-full min-w-0 cursor-not-allowed items-center gap-2.5 rounded-xl border border-(--border-button) bg-(--bg-body) px-3 opacity-60">
                  <p className="truncate font-manrope text-sm font-medium leading-5 text-(--text-description-60)">
                    Conta padrão
                  </p>
                </div>
              </div>

              {job.note ? (
                <div className="mt-3 w-full">
                  <p className="font-manrope text-[11px] font-medium leading-5 text-(--text-description)">
                    {job.note}
                  </p>
                </div>
              ) : null}

              {duplicates.length ? (
                <p
                  role="alert"
                  className="mt-3 w-full font-manrope text-[11px] font-medium leading-5 text-warning"
                >
                  Possível duplicado:{" "}
                  {duplicates
                    .map((transaction) => transaction.description ?? "")
                    .join(", ")}{" "}
                  — mesmo valor e data.
                </p>
              ) : null}

              <label
                className={`mt-3 flex w-full items-start gap-2 rounded-lg transition-colors ${
                  invalid.confirm ? "-mx-2 -my-1 bg-danger-300/5 px-2 py-1" : ""
                }`}
              >
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={(event) => {
                    setChecked(event.target.checked);
                    if (invalid.confirm) {
                      setInvalid((v) => ({ ...v, confirm: false }));
                    }
                  }}
                  className={`mt-0.5 size-4 shrink-0 accent-danger-300 ${
                    invalid.confirm ? "ring-2 ring-danger-300/50" : ""
                  }`}
                />
                <span
                  className={`font-manrope text-[11px] font-medium leading-5 ${
                    invalid.confirm ? "font-semibold text-danger-300" : "text-(--text-description)"
                  }`}
                >
                  Conferi os dados e o valor em Kz.
                  {duplicates.length ? " Esta é uma despesa diferente." : ""}
                </span>
              </label>

              {error ? (
                <p role="alert" className="mt-3 font-manrope text-xs font-semibold text-danger-300">
                  {error}
                </p>
              ) : null}
            </fieldset>
          </div>

          <footer className="flex shrink-0 items-start gap-3 border-t border-(--card-barras) px-5 py-4">
            <button
              type="button"
              disabled={busy}
              onClick={discard}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-(--card-barras) px-4 py-3 font-manrope text-sm font-bold leading-6 text-(--text-title) transition-colors hover:bg-neutrals-300/10 active:scale-95 disabled:opacity-60"
            >
              Descartar
            </button>
            <button
              type="button"
              disabled={busy}
              onClick={() => void save()}
              className="flex flex-[1.4] items-center justify-center gap-2 rounded-xl bg-primary-300 px-4 py-3 font-manrope text-sm font-bold leading-6 text-base-white transition-opacity hover:opacity-90 active:scale-95 disabled:cursor-wait disabled:opacity-60"
            >
              {busy ? "A guardar…" : "Salvar e seguinte"}
              <ArrowRight size={16} />
            </button>
          </footer>
        </div>
      </div>

      {preview && url ? (
        <div
          className="fixed inset-0 z-[70] flex flex-col items-center justify-center gap-3 bg-base-black/70 p-4"
          onClick={() => setPreview(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            className="flex max-h-[95dvh] w-full max-w-3xl flex-col gap-3 overflow-hidden rounded-2xl bg-(--background) p-5"
            onClick={(event) => event.stopPropagation()}
          >
            <header className="flex items-center gap-3">
              <p className="min-w-0 flex-1 truncate font-manrope text-sm font-bold text-(--text-title)">
                Comprovativo original
              </p>
              <a
                href={url}
                download={job.fileName}
                className="font-manrope text-[13px] font-medium text-primary-300 underline"
              >
                Descarregar original
              </a>
              <button
                type="button"
                onClick={() => setPreview(false)}
                aria-label="Fechar documento"
                className="rounded-lg p-1 text-(--icon) hover:bg-neutrals-300/10"
              >
                <X size={18} />
              </button>
            </header>
            {isPdf ? (
              <iframe
                title="Documento PDF"
                src={url}
                sandbox="allow-same-origin"
                className="h-[65dvh] w-full border-0"
              />
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={url}
                alt="Comprovativo original"
                className="max-h-[65dvh] w-full object-contain"
              />
            )}
          </div>
        </div>
      ) : null}
    </>
  );
}
