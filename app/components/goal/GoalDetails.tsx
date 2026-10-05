import { CloseIcon, WalletProgressIcon } from "@/constants/icons";
import React from "react";
import type { GoalDTO } from "../../types/dto/goal.dto";
import { formatAOA } from "../../utils/format-AOA";
import { goalPercent, statusFor } from "./goal-status";

export type SavingsEntry = {
  amount: number;
  date: string;
};

type GoalDetailsProps = {
  isOpen: boolean;
  onClose: () => void;
  goal: GoalDTO | null;
  /** Abre o formulário em modo de edição. */
  onEdit?: (goal: GoalDTO) => void;
  /** Abre o formulário em modo de adicionar poupança. */
  onAddSavings?: (goal: GoalDTO) => void;
  /** Elimina a meta. */
  onDelete?: (goal: GoalDTO) => void;
  /** Movimentos de poupança (por omissão usa mock local). */
  history?: SavingsEntry[];
};

const defaultHistory: SavingsEntry[] = [
  { amount: 1000000, date: "02/06/2026" },
  { amount: 200000, date: "02/06/2026" },
  { amount: 5000, date: "02/06/2026" },
  { amount: 32000, date: "02/06/2026" },
  { amount: 1000, date: "02/06/2026" },
];

const DAY_MS = 24 * 60 * 60 * 1000;

function GoalDetails({
  isOpen,
  onClose,
  goal,
  onEdit,
  onAddSavings,
  onDelete,
  history = defaultHistory,
}: GoalDetailsProps) {
  const percent = goal ? goalPercent(goal) : 0;
  const status = statusFor(percent);
  const prazo = goal?.type === "LONG_TERM" ? "Longo prazo" : "Curto Prazo";
  const falta = goal ? Math.max(0, goal.targetAmount - goal.currentAmount) : 0;
  const isComplete = percent >= 100;
  const daysLeft =
    goal && !isComplete
      ? Math.max(
          0,
          Math.ceil((new Date(goal.endDate).getTime() - Date.now()) / DAY_MS),
        )
      : 0;
  const porDia = daysLeft > 0 ? falta / daysLeft : 0;

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
        <div className="flex min-h-0 flex-1 flex-col items-start self-stretch overflow-y-auto">
          <header className="flex p-4 justify-between items-center self-stretch border-b border-(--card-barras) lg:p-6">
            <p className="text-base not-italic font-bold font-manrope leading-7 text-(--text-title) lg:text-lg">
              Detalhes da Meta
            </p>
            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={!goal || isComplete}
                onClick={() => goal && onAddSavings?.(goal)}
                className={`flex w-auto px-3 py-2 justify-center items-center gap-2 rounded-xl border border-(--border-button) transition-colors lg:w-40 ${
                  isComplete
                    ? "bg-(--background-variant) text-(--text-description-60) cursor-not-allowed"
                    : "bg-(--background) text-(--text-title) hover:bg-neutrals-300/10 active:bg-neutrals-300/20"
                }`}
              >
                <p className="text-center text-xs not-italic font-semibold font-manrope leading-5 lg:text-sm">
                  Adicionar Poupança
                </p>
              </button>
              <button
                type="button"
                onClick={onClose}
                aria-label="Fechar"
                className="rounded-lg p-1 hover:bg-neutrals-300/10 active:scale-90 transition-all"
              >
                <CloseIcon width={24} className="text-primary-900/50" />
              </button>
            </div>
          </header>

          {goal && (
            <>
              <section className="flex flex-col items-start gap-2.5 self-stretch p-4 lg:p-6">
                <div className="flex flex-col items-start gap-3 p-3 rounded-2xl bg-(--bg-filter) border border-(--card-barras) self-stretch overflow-hidden lg:gap-4 lg:p-4 lg:rounded-[32px]">
                  <div className="flex items-center gap-3 p-3 rounded-2xl bg-(--background) border border-(--card-barras) self-stretch lg:gap-4 lg:p-4 lg:rounded-[32px]">
                    <span
                      className={`flex size-16 shrink-0 justify-center items-center rounded-full border-2 ${status.color} ${status.tint} lg:size-20`}
                    >
                      <p
                        className={`text-sm not-italic font-bold font-inter leading-6 ${status.color} lg:text-base`}
                      >
                        {percent}%
                      </p>
                    </span>
                    <div className="flex flex-1 min-w-0 flex-col justify-center gap-2">
                      <div className="flex flex-col items-start gap-2">
                        <div className="flex items-center gap-2.5 self-stretch">
                          <span className="flex px-2.5 py-1 justify-center items-center rounded-lg bg-neutrals-300/10">
                            <p className="text-sm not-italic font-bold font-manrope leading-5 text-(--text-description)">
                              {prazo}
                            </p>
                          </span>
                          <p
                            className={`text-sm not-italic font-bold font-inter ${status.color} lg:text-base`}
                          >
                            {status.label}
                          </p>
                        </div>
                        <p className="text-sm not-italic font-semibold font-manrope text-(--text-title) lg:text-base">
                          {goal.title}
                        </p>
                      </div>
                      <div className="flex items-baseline gap-1">
                        <p className="text-xs not-italic font-bold font-inter leading-5 text-(--text-title) lg:text-sm">
                          {formatAOA(goal.currentAmount)}
                        </p>
                        <p className="text-xs not-italic font-medium font-inter leading-5 text-(--text-description-60) lg:text-sm">
                          /{formatAOA(goal.targetAmount)}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="h-2.5 rounded-3xl overflow-hidden self-stretch">
                    <div
                      role="progressbar"
                      aria-valuenow={percent}
                      aria-valuemin={0}
                      aria-valuemax={100}
                      aria-label={`Progresso de ${goal.title}`}
                      className={`h-full rounded-3xl ${status.bar}`}
                      style={{ width: `${percent}%` }}
                    />
                  </div>

                  <div className="flex items-start gap-3 self-stretch">
                    <div className="flex flex-1 p-2.5 flex-col items-start gap-1 rounded-2xl bg-(--background) border border-(--card-barras) lg:p-3">
                      <p className="text-xs not-italic font-semibold font-manrope leading-5 text-(--text-title) lg:text-sm">
                        FALTA
                      </p>
                      <p className="text-xs not-italic font-bold font-inter text-primary-300 lg:text-sm">
                        {formatAOA(falta)}
                      </p>
                    </div>
                    <div className="flex w-24 p-2.5 flex-col items-start gap-1 rounded-2xl bg-(--background) border border-(--card-barras) lg:p-3">
                      <p className="text-xs not-italic font-semibold font-manrope leading-5 text-(--text-title) lg:text-sm">
                        DIAS
                      </p>
                      <p className="text-xs not-italic font-bold font-inter text-primary-300 lg:text-sm">
                        {daysLeft}
                      </p>
                    </div>
                    <div className="flex flex-1 p-2.5 flex-col items-start gap-1 rounded-2xl bg-(--background) border border-(--card-barras) lg:p-3">
                      <p className="text-xs not-italic font-semibold font-manrope leading-5 text-(--text-title) lg:text-sm">
                        POR DIA
                      </p>
                      <p className="text-xs not-italic font-bold font-inter text-primary-300 lg:text-sm">
                        {formatAOA(porDia)}
                      </p>
                    </div>
                  </div>
                </div>
              </section>

              <hr className="w-full h-px text-(--card-barras)" />

              <section className="flex flex-col items-start gap-4 self-stretch px-4 pt-4 pb-3 lg:gap-6 lg:px-6 lg:pt-6">
                <div className="flex flex-col items-start gap-2 self-stretch">
                  <div className="flex h-10 items-center justify-between self-stretch">
                    <div className="flex items-center gap-2.5">
                      <WalletProgressIcon
                        width={24}
                        height={24}
                        className="text-(--icon-hover)"
                      />
                      <p className="text-base not-italic font-semibold font-manrope leading-7 text-(--text-title) lg:text-lg">
                        Histórico de poupanças
                      </p>
                    </div>
                    <span className="flex size-6 justify-center items-center rounded-2xl bg-(--menu-bg-active)">
                      <p className="text-center text-sm not-italic font-bold font-manrope leading-5 text-primary-300">
                        {history.length}
                      </p>
                    </span>
                  </div>
                  <div className="flex flex-col self-stretch py-2.5">
                    {history.map((entry, index) => (
                      <div
                        key={`entry-${entry.date}-${index}`}
                        className="flex gap-4 self-stretch"
                      >
                        <div className="flex w-4 flex-col items-center self-stretch">
                          <span className="w-0.5 min-h-3 flex-1 rounded-full bg-(--border-card-10)" />
                          <span className="size-3.5 shrink-0 rounded-full bg-primary-300 border-2 border-(--background)" />
                          <span className="w-0.5 min-h-3 flex-1 rounded-full bg-(--border-card-10)" />
                        </div>
                        <div className="flex flex-1 flex-col justify-center gap-0.5 py-3">
                          <p className="text-sm not-italic font-bold font-inter text-(--text-title) lg:text-base">
                            {formatAOA(entry.amount)}
                          </p>
                          <p className="text-xs not-italic font-normal font-inter leading-5 text-(--text-description-60) lg:text-sm">
                            {entry.date}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            </>
          )}
        </div>

        {!isComplete && (
          <div className="flex shrink-0 flex-col justify-end items-start gap-2.5 self-stretch p-4 border-t border-(--card-barras) lg:p-6">
            <div className="flex items-start gap-4 self-stretch">
              <button
                type="button"
                onClick={() => goal && onEdit?.(goal)}
                className="flex flex-1 p-3.5 justify-center items-center gap-2.5 rounded-2xl bg-primary-300 text-base-white shadow-[0px_4px_12px_rgba(5,61,196,0.15)] hover:opacity-90 active:opacity-80 active:scale-[0.98] transition-all lg:w-56 lg:flex-none"
              >
                <p className="text-center text-sm not-italic font-bold font-manrope leading-normal lg:text-base">
                  Editar
                </p>
              </button>
              <button
                type="button"
                onClick={() => goal && onDelete?.(goal)}
                className="flex flex-1 p-3.5 justify-center items-center gap-2.5 rounded-2xl bg-danger-300 text-base-white shadow-[0px_4px_12px_rgba(5,61,196,0.15)] hover:opacity-90 active:opacity-80 active:scale-[0.98] transition-all lg:w-56 lg:flex-none"
              >
                <p className="text-center text-sm not-italic font-bold font-manrope leading-normal lg:text-base">
                  Eliminar
                </p>
              </button>
            </div>
          </div>
        )}
      </aside>
    </div>
  );
}

export default GoalDetails;
