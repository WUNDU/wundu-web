import React, { useEffect, useMemo, useState } from "react";
import {
  NoMovementIcon,
  SettingsIcon,
  ArrowRotateIcon,
  PaymentIcon,
  MoneyIcon,
  CalendarIcon,
} from "@/constants/icons";
import { Document } from "@/types/button";
import { Button } from "@/ui/atoms";
import TransactionHighlight from "@/ui/molecules/TransactionHighlight";

interface MovementSectionProps {
  documents: Document[];
  isLoading?: boolean;
  isRefreshing?: boolean;
  onRefresh?: () => void;
  error?: string | null;
}

type PaletteStyle = {
  gradient: string;
  badge: string;
  accent: string;
};

type PaletteSet = Record<string, PaletteStyle> & { default: PaletteStyle };

const EXPENSE_PALETTE: PaletteSet = {
  Habitação: {
    gradient: "from-orange-50/80 via-transparent to-transparent",
    badge: "bg-orange-100 text-orange-700",
    accent: "shadow-orange-200",
  },
  Alimentação: {
    gradient: "from-rose-50/80 via-transparent to-transparent",
    badge: "bg-rose-100 text-rose-700",
    accent: "shadow-rose-200",
  },
  Saúde: {
    gradient: "from-red-50/80 via-transparent to-transparent",
    badge: "bg-red-100 text-red-700",
    accent: "shadow-red-200",
  },
  Transporte: {
    gradient: "from-sky-50/80 via-transparent to-transparent",
    badge: "bg-sky-100 text-sky-700",
    accent: "shadow-sky-200",
  },
  default: {
    gradient: "from-slate-50/80 via-transparent to-transparent",
    badge: "bg-slate-100 text-slate-700",
    accent: "shadow-slate-200",
  },
};

const INCOME_PALETTE: PaletteSet = {
  Salário: {
    gradient: "from-emerald-50/80 via-transparent to-transparent",
    badge: "bg-emerald-100 text-emerald-700",
    accent: "shadow-emerald-200",
  },
  Investimentos: {
    gradient: "from-teal-50/80 via-transparent to-transparent",
    badge: "bg-teal-100 text-teal-700",
    accent: "shadow-teal-200",
  },
  default: {
    gradient: "from-lime-50/80 via-transparent to-transparent",
    badge: "bg-lime-100 text-lime-700",
    accent: "shadow-lime-200",
  },
};

const getPalette = (category: string | undefined, isIncome: boolean): PaletteStyle => {
  const palette = isIncome ? INCOME_PALETTE : EXPENSE_PALETTE;
  return palette[category ?? ""] ?? palette.default;
};

const MovementSection: React.FC<MovementSectionProps> = ({
  documents,
  isLoading,
  isRefreshing,
  onRefresh,
  error,
}) => {
  const [showAllTransactions, setShowAllTransactions] = useState(false);

  const transactionDocuments = useMemo(() => {
    return documents.map((doc, index) => {
      const amount = typeof (doc as any).amount === "number" ? (doc as any).amount : 0;
      const category = (doc as any).category ?? (doc.type === "image" ? "Imagem" : doc.type === "document" ? "Documento" : "Movimento");
      const description = (doc as any).description ?? "Movimento registrado";
      const timestamp = (doc as any).timestamp ?? new Date(Date.now() - index * 60 * 1000).toISOString();
      const isIncome = typeof (doc as any).isIncome === "boolean" ? (doc as any).isIncome : amount >= 0;

      return {
        ...(doc as any),
        amount,
        category,
        description,
        timestamp,
        isIncome,
      } as Document;
    });
  }, [documents]);

  useEffect(() => {
    setShowAllTransactions(false);
  }, [transactionDocuments]);

  const totalTransactions = transactionDocuments.length;
  const visibleDocuments = useMemo(() => {
    if (showAllTransactions) {
      return transactionDocuments;
    }
    return transactionDocuments.slice(0, 5);
  }, [transactionDocuments, showAllTransactions]);

  const handleRefresh = () => {
    if (onRefresh) {
      onRefresh();
    }
  };

  const groupedTransactions = useMemo(() => {
    const groups: Record<string, Document[]> = {};
    const today = new Date();

    const normalize = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
    const todayKey = normalize(today).getTime();
    const yesterdayKey = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 1).getTime();

    visibleDocuments.forEach((doc) => {
      const ts = doc.timestamp ? new Date(doc.timestamp) : new Date();
      const keyDate = normalize(ts).getTime();

      let label: string;
      if (keyDate === todayKey) {
        label = "Hoje";
      } else if (keyDate === yesterdayKey) {
        label = "Ontem";
      } else {
        label = ts.toLocaleDateString("pt-AO", {
          day: "2-digit",
          month: "short",
        });
      }

      if (!groups[label]) {
        groups[label] = [];
      }
      groups[label].push(doc);
    });

    return groups;
  }, [visibleDocuments]);

  if (isLoading) {
    return (
      <section className="flex flex-col flex-1 min-h-0 pb-5 overflow-hidden">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-sm font-bold uppercase text-gray-900">
              Últimas transações
            </h2>
            <p className="text-xs text-gray-500">Carregando transações...</p>
          </div>
          <div className="border-2 rounded-full border-gray-200 bg-gray-100 p-1">
            <SettingsIcon className="text-gray-500" />
          </div>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="text-sm text-gray-500">Buscando dados...</div>
        </div>
      </section>
    );
  }

  const renderHighlight = (doc: Document, index: number) => {
    const isIncome = Boolean(doc.isIncome ?? (doc.amount ?? 0) > 0);
    const palette = getPalette(doc.category, isIncome);
    const IconComponent = isIncome ? MoneyIcon : PaymentIcon;

    return (
      <TransactionHighlight
        key={`${doc.name}-${doc.timestamp ?? index}`}
        title={doc.name}
        description={
          doc.description ??
          (isIncome
            ? "Receita sincronizada automaticamente"
            : "Despesa registrada a partir do comprovativo")
        }
        amount={doc.amount ?? 0}
        isIncome={isIncome}
        category={doc.category ?? (isIncome ? "Receita" : "Despesa")}
        timestamp={doc.timestamp}
        icon={IconComponent}
        badgeClassName={palette.badge}
        gradientClassName={palette.gradient}
        iconAccentClass={palette.accent}
      />
    );
  };

  // ESTADO ANTIGO: nenhum movimento registrado, ocupando todo o espaço
  if (!documents.length) {
    return (
      <section className="flex flex-col flex-1 min-h-full pb-5">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-sm font-bold uppercase text-gray-900">
              Últimas transações
            </h2>
            <p className="text-xs text-gray-500">Ainda não há movimentos registrados</p>
          </div>
          <div className="border-2 rounded-full border-gray-200 bg-gray-100 p-1">
            <SettingsIcon className="text-gray-500" />
          </div>
        </div>

        <div className="flex flex-1 min-h-0">
          <div className="bg-white rounded-xl my-4 mb-20 md:my-2 p-8 shadow-sm flex flex-col flex-1 min-h-0 items-center justify-center text-center overflow-hidden">
            <div className="flex flex-col items-center gap-2 mb-4">
              <NoMovementIcon className="mx-auto mb-2 text-gray-600" />
              <p className="text-lg font-semibold text-gray-900">
                Nenhum movimento registrado.
              </p>
              <p className="text-sm text-gray-500">
                {error
                  ? error
                  : "Faça upload de um comprovativo ou registre manualmente para visualizar aqui."}
              </p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // ESTADO COM MOVIMENTOS: lista de cards dentro do MovementSection
  return (
    <section className="flex flex-col flex-1 h-full min-h-0 overflow-hidden">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-sm font-bold uppercase text-gray-900">
            Últimas transações
          </h2>
          <p className="text-xs text-gray-500">Resumo das despesas e receitas recentes</p>
        </div>
        <div className="border-2 rounded-full border-gray-200 bg-gray-100 p-1">
          <SettingsIcon className="text-gray-500" />
        </div>
      </div>

      <div className="flex flex-1 min-h-0">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col flex-1 min-h-0 overflow-hidden">
          <div className="flex-1 overflow-y-auto pr-1 space-y-4 py-4">
            {Object.entries(groupedTransactions).map(([label, items]) => (
              <div key={label} className="space-y-1 px-4">
                <div className="flex items-center gap-1.5 text-[11px] font-medium text-gray-500">
                  <CalendarIcon className="w-3 h-3" />
                  <span>{label}</span>
                </div>
                <div className="mt-1 space-y-2 border-t border-gray-100 pt-1">
                  {items.map((doc, index) => renderHighlight(doc, index))}
                </div>
              </div>
            ))}
          </div>

          {totalTransactions > 5 && (
            <div className="border-t border-gray-100 p-4 flex justify-center">
              <Button
                variant="secondary"
                onClick={() => setShowAllTransactions((prev) => !prev)}
                label={showAllTransactions ? "Mostrar menos" : "Ver todos os movimentos"}
              />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
;

export default MovementSection;
