"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  BanknoteArrowDown,
  ChartPie,
  Scale,
  Sparkles,
  X,
} from "lucide-react";

type NegativeBalanceAlertProps = {
  amount: number | null;
  loading: boolean;
  /** Nome do utilizador para o "Hey {nome}!". */
  name: string;
  /** Escopo da exibição (ex. mês selecionado) — o sheet aparece uma vez por escopo. */
  scope: string;
};

/**
 * Sheet de saldo negativo portado do protótipo (`wundu/app/negative-balance-alert.tsx`).
 * Aparece ~800ms depois do saldo ficar negativo, uma vez por escopo/sessão.
 * O card vermelho já existia no `BalanceHero`; aqui vai só o sheet + CTA para a Wundu IA.
 */
export default function NegativeBalanceAlert({
  amount,
  loading,
  name,
  scope,
}: NegativeBalanceAlertProps) {
  const router = useRouter();
  const [openFor, setOpenFor] = useState<string | null>(null);
  const shown = useRef(new Set<string>());
  const negative =
    !loading &&
    amount !== null &&
    Number.isFinite(amount) &&
    (amount as number) < 0;

  useEffect(() => {
    const key = `wundu:negative-balance:${scope}`;
    if (!loading && amount !== null && amount >= 0) {
      shown.current.delete(key);
      try {
        sessionStorage.removeItem(key);
      } catch {
        /* sessão privada — ignora */
      }
      return;
    }
    if (!negative) return;
    let seen = shown.current.has(key);
    try {
      seen ||= sessionStorage.getItem(key) === "shown";
    } catch {
      /* sessão privada — ignora */
    }
    if (seen) return;
    const timer = setTimeout(() => {
      shown.current.add(key);
      try {
        sessionStorage.setItem(key, "shown");
      } catch {
        /* sessão privada — ignora */
      }
      setOpenFor(scope);
    }, 800);
    return () => clearTimeout(timer);
  }, [amount, loading, negative, scope]);

  const open = openFor === scope && negative;
  if (!open) return null;

  const displayName = name.trim() && name !== "O meu espaço" ? name.trim() : "";
  const close = () => setOpenFor(null);
  const goToAi = () => {
    setOpenFor(null);
    router.push("/home/ai");
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Alerta de saldo negativo"
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 backdrop-blur-sm sm:items-center sm:p-4"
      onClick={close}
    >
      <div
        className="flex max-h-[90dvh] w-full max-w-[520px] flex-col overflow-hidden rounded-t-3xl border border-(--card-barras) bg-(--bg-card) text-(--text-title) sm:rounded-3xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mx-auto mt-2.5 h-1 w-10 shrink-0 rounded-full bg-(--card-barras) sm:hidden" />
        <div className="flex items-center justify-end px-5 pt-2.5 sm:px-6 sm:pt-3">
          <button
            type="button"
            onClick={close}
            aria-label="Fechar alerta de saldo negativo"
            className="grid size-8 place-items-center rounded-lg text-(--text-description) transition-colors hover:bg-(--menu-bg-hover)"
          >
            <X size={20} />
          </button>
        </div>

        <div className="min-h-0 overflow-y-auto px-6 pb-2 sm:px-7">
          <h2 className="text-center font-manrope text-[26px] font-bold leading-snug sm:text-[27px]">
            Hey{displayName ? `, ${displayName}` : ""}!
          </h2>
          <p className="mt-3.5 text-center font-manrope text-sm leading-relaxed text-(--text-description)">
            Estás a receber este alerta pois o teu saldo é negativo. Efectua as
            seguintes alterações:
          </p>
          <ul className="mt-6 grid gap-4 pb-2">
            <li className="flex items-center gap-3.5 text-sm leading-relaxed">
              <span className="grid size-11 shrink-0 place-items-center rounded-[13px] bg-primary-300/10 text-primary-300">
                <BanknoteArrowDown size={23} />
              </span>
              <p>Adiciona as receitas à tua conta.</p>
            </li>
            <li className="flex items-center gap-3.5 text-sm leading-relaxed">
              <span className="grid size-11 shrink-0 place-items-center rounded-[13px] bg-primary-300/10 text-primary-300">
                <ChartPie size={23} />
              </span>
              <p>Revê onde gastas mais dinheiro.</p>
            </li>
            <li className="flex items-center gap-3.5 text-sm leading-relaxed">
              <span className="grid size-11 shrink-0 place-items-center rounded-[13px] bg-primary-300/10 text-primary-300">
                <Scale size={23} />
              </span>
              <p>As tuas despesas não podem superar o teu rendimento mensal.</p>
            </li>
          </ul>
        </div>

        <div className="border-t border-(--card-barras) px-5 pb-[calc(20px+env(safe-area-inset-bottom))] pt-4 sm:px-6 sm:pb-5">
          <button
            type="button"
            onClick={goToAi}
            className="flex min-h-[50px] w-full items-center justify-center gap-2.5 rounded-[13px] bg-primary-300 px-5 py-3.5 text-[15px] font-semibold text-white transition-colors hover:bg-primary-400"
          >
            <Sparkles size={20} />
            Wundu IA
            <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
