"use client";

import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";

const EASE_OUT = [0.22, 1, 0.36, 1] as [number, number, number, number];

export type SortField  = "date" | "amount";
export type SortDir    = "desc" | "asc";
export type TypeFilter = "all" | "EXPENSE" | "INCOME";

export function FilterModal({
  open, onClose,
  sortField, setSortField,
  sortDir, setSortDir,
  typeFilter, setTypeFilter,
}: {
  open: boolean; onClose: () => void;
  sortField: SortField; setSortField: (v: SortField) => void;
  sortDir: SortDir; setSortDir: (v: SortDir) => void;
  typeFilter: TypeFilter; setTypeFilter: (v: TypeFilter) => void;
}) {
  const pill = (active: boolean) =>
    `px-3 py-1.5 rounded-full text-xs font-bold transition-colors cursor-pointer ${
      active ? "bg-secondary text-white" : "bg-[rgba(0,60,195,0.06)] text-secondary"
    }`;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="bd"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/30"
          onClick={onClose}
        >
          <motion.div
            key="panel"
            initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
            transition={{ duration: 0.18, ease: EASE_OUT }}
            className="w-full max-w-md bg-white rounded-t-[24px] p-6 pb-10"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-base font-extrabold text-slate-900">Filtros</h3>
              <button onClick={onClose} className="p-1.5 rounded-full hover:bg-slate-100 transition-colors">
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>

            <p className="text-xs font-bold text-slate-500 mb-2">Tipo</p>
            <div className="flex gap-2 mb-5">
              {([["all","Todos"],["EXPENSE","Despesas"]] as const).map(([v,l]) => (
                <button key={v} onClick={() => setTypeFilter(v)} className={pill(typeFilter === v)}>{l}</button>
              ))}
            </div>

            <p className="text-xs font-bold text-slate-500 mb-2">Ordenar por</p>
            <div className="flex gap-2 mb-5">
              {([["date","Data"],["amount","Valor"]] as const).map(([v,l]) => (
                <button key={v} onClick={() => setSortField(v)} className={pill(sortField === v)}>{l}</button>
              ))}
            </div>

            <p className="text-xs font-bold text-slate-500 mb-2">Direção</p>
            <div className="flex gap-2">
              {([["desc","Mais recente"],["asc","Mais antigo"]] as const).map(([v,l]) => (
                <button key={v} onClick={() => setSortDir(v)} className={pill(sortDir === v)}>{l}</button>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
