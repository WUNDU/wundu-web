"use client";

import React, { useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Check, X, Loader2 } from "lucide-react";
import { useCategory } from "@/hooks/use-category";
import type { Category } from "@/types/dtos/category.dto";
import { getCategoryStyle } from "@/utils/category-style";

export interface CategorySelectProps {
  /** The currently selected value — an ID (default) or a name, depending on `valueType` */
  value: string;
  onChange: (value: string) => void;
  /** Whether `value` / `onChange` operate on `id` or `name`. Defaults to `"id"` */
  valueType?: "id" | "name";
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  error?: string;
  className?: string;
}

export function CategorySelect({
  value,
  onChange,
  valueType = "id",
  label = "Categoria",
  placeholder = "Selecione uma categoria",
  disabled = false,
  error,
  className,
}: CategorySelectProps) {
  const [open, setOpen] = useState(false);
  const { categories, isLoading, hasFetched } = useCategory();

  const systemCats = categories.filter((c) => !c.userId);
  const userCats = categories.filter((c) => !!c.userId);

  const selectedCat =
    valueType === "id"
      ? categories.find((c) => c.id === value)
      : categories.find((c) => c.name === value);

  const displayName = selectedCat?.name ?? "";

  const handleSelect = (cat: Category) => {
    onChange(valueType === "id" ? cat.id : cat.name);
    setOpen(false);
  };

  const isSelected = (cat: Category) =>
    valueType === "id" ? value === cat.id : value === cat.name;

  const triggerCls = [
    "w-full flex items-center justify-between rounded-xl border px-4 py-3 text-sm bg-slate-50 focus:outline-none transition-all",
    disabled
      ? "opacity-50 cursor-not-allowed border-slate-200"
      : error
      ? "border-red-300 hover:border-red-400"
      : open
      ? "border-secondary/40 bg-white ring-4 ring-secondary/[0.06]"
      : "border-slate-200 hover:border-secondary/30",
  ].join(" ");

  return (
    <div className={`flex w-full flex-col gap-2 ${className ?? ""}`}>
      {label && (
        <label className="text-sm font-medium text-slate-600">{label}</label>
      )}

      <button
        type="button"
        disabled={disabled}
        onClick={() => !disabled && setOpen(true)}
        className={triggerCls}
      >
        {isLoading && !hasFetched ? (
          <span className="flex items-center gap-2 text-slate-400">
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
            A carregar…
          </span>
        ) : selectedCat ? (
          <span className="flex items-center gap-2 text-slate-900">
            {(() => { const s = getCategoryStyle(selectedCat.name); const Icon = s.icon; return <Icon className="w-4 h-4 flex-shrink-0" style={{ color: s.color }} />; })()}
            {displayName}
          </span>
        ) : (
          <span className="text-slate-400">{placeholder}</span>
        )}
        <ChevronDown className="w-4 h-4 text-slate-400 flex-shrink-0" />
      </button>

      {error && <p className="text-xs text-red-500">{error}</p>}

      {typeof document !== "undefined" &&
        createPortal(
          <AnimatePresence>
            {open && (
              <motion.div
                key="cat-sel-backdrop"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/50"
                onClick={() => setOpen(false)}
              >
                <motion.div
                  key="cat-sel-panel"
                  initial={{ opacity: 0, scale: 0.95, y: 8 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 8 }}
                  transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
                  className="bg-white w-full max-w-sm rounded-[20px] shadow-[0_8px_40px_rgba(0,0,0,0.18)] overflow-hidden flex flex-col max-h-[70vh]"
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* Header */}
                  <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 flex-shrink-0">
                    <h3 className="text-sm font-bold text-slate-900">{label}</h3>
                    <button
                      type="button"
                      onClick={() => setOpen(false)}
                      className="w-8 h-8 flex items-center justify-center rounded-xl text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Grouped list */}
                  <div className="overflow-y-auto flex-1 py-2">
                    {systemCats.length > 0 && (
                      <>
                        <p className="px-4 pt-2 pb-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                          Sistema
                        </p>
                        {systemCats.map((cat) => {
                          const style = getCategoryStyle(cat.name);
                          const Icon = style.icon;
                          return (
                          <button
                            key={cat.id}
                            type="button"
                            onClick={() => handleSelect(cat)}
                            className={`w-full flex items-center justify-between px-5 py-3 text-sm transition-colors ${
                              isSelected(cat)
                                ? "text-secondary font-semibold bg-blue-50/60"
                                : "text-slate-900 hover:bg-slate-50"
                            }`}
                          >
                            <span className="flex items-center gap-2.5">
                              <Icon className="w-4 h-4 flex-shrink-0" style={{ color: style.color }} />
                              {cat.name}
                            </span>
                            {isSelected(cat) && (
                              <Check className="w-3.5 h-3.5 text-secondary flex-shrink-0" />
                            )}
                          </button>
                          );
                        })}
                      </>
                    )}

                    {userCats.length > 0 && (
                      <>
                        {systemCats.length > 0 && (
                          <div className="mx-4 my-2 h-px bg-slate-100" />
                        )}
                        <p className="px-4 pt-1 pb-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                          Personalizadas
                        </p>
                        {userCats.map((cat) => {
                          const style = getCategoryStyle(cat.name);
                          const Icon = style.icon;
                          return (
                          <button
                            key={cat.id}
                            type="button"
                            onClick={() => handleSelect(cat)}
                            className={`w-full flex items-center justify-between px-5 py-3 text-sm transition-colors ${
                              isSelected(cat)
                                ? "text-secondary font-semibold bg-blue-50/60"
                                : "text-slate-900 hover:bg-blue-50/40"
                            }`}
                          >
                            <span className="flex items-center gap-2.5">
                              <Icon className="w-4 h-4 flex-shrink-0" style={{ color: style.color }} />
                              {cat.name}
                            </span>
                            {isSelected(cat) && (
                              <Check className="w-3.5 h-3.5 text-secondary flex-shrink-0" />
                            )}
                          </button>
                          );
                        })}
                      </>
                    )}

                    <div className="h-2" />
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>,
          document.body,
        )}
    </div>
  );
}

export default CategorySelect;
