"use client";

import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { ChevronDown, Check, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { SelectProps } from "@/types/ui";

const Select: React.FC<SelectProps> = ({
  label,
  value,
  onChange,
  options,
  modal = false,
  className,
}) => {
  const [open, setOpen] = useState(false);
  const [dropPos, setDropPos] = useState({ top: 0, left: 0, width: 0 });
  const btnRef = useRef<HTMLButtonElement>(null);
  const dropRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((o) => o.value === value);
  const isPlaceholder = !value || (options[0]?.value === "" && value === "");

  // Close dropdown on outside click (non-modal only)
  useEffect(() => {
    if (modal) return;
    const handler = (e: MouseEvent) => {
      if (
        dropRef.current && !dropRef.current.contains(e.target as Node) &&
        btnRef.current && !btnRef.current.contains(e.target as Node)
      ) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [modal]);

  const openDrop = () => {
    if (!modal && btnRef.current) {
      const r = btnRef.current.getBoundingClientRect();
      const dropHeight = Math.min(options.length * 44 + 8, 260);
      const spaceBelow = window.innerHeight - r.bottom;
      const top = spaceBelow >= dropHeight ? r.bottom + 4 : r.top - dropHeight - 4;
      setDropPos({ top, left: r.left, width: r.width });
    }
    setOpen((o) => !o);
  };

  const handleSelect = (val: string) => {
    onChange(val);
    setOpen(false);
  };

  const triggerCls = `w-full flex items-center justify-between rounded-xl border px-4 py-3 text-sm bg-slate-50 focus:outline-none transition-all ${
    open
      ? "border-[#003cc3]/40 bg-white ring-4 ring-[#003cc3]/[0.06]"
      : "border-slate-200 hover:border-[#003cc3]/30"
  }`;

  return (
    <div className={`flex w-full flex-col gap-2 ${className ?? ""}`}>
      {label && (
        <label className="text-sm font-medium text-slate-600">{label}</label>
      )}
      <button ref={btnRef} type="button" onClick={openDrop} className={triggerCls}>
        <span className={isPlaceholder ? "text-slate-400" : "text-[#1e293b]"}>
          {selectedOption?.label ?? options[0]?.label ?? "Selecione"}
        </span>
        <ChevronDown
          className={`w-4 h-4 text-slate-400 transition-transform flex-shrink-0 ${!modal && open ? "rotate-180" : ""}`}
        />
      </button>

      {/* ── Inline portal dropdown (non-modal) ─────────────────────── */}
      {!modal && open && typeof document !== "undefined" &&
        createPortal(
          <div
            ref={dropRef}
            style={{ top: dropPos.top, left: dropPos.left, width: dropPos.width }}
            className="fixed z-[9999] bg-white rounded-xl border border-slate-200 shadow-xl max-h-64 overflow-y-auto py-1"
          >
            {options.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => handleSelect(opt.value)}
                className={`w-full flex items-center justify-between px-4 py-2.5 text-sm transition-colors ${
                  opt.value === value
                    ? "text-[#003cc3] font-semibold bg-blue-50/60"
                    : opt.value === ""
                    ? "text-slate-400 hover:bg-slate-50"
                    : "text-[#1e293b] hover:bg-slate-50"
                }`}
              >
                {opt.label}
                {opt.value === value && opt.value !== "" && (
                  <Check className="w-3.5 h-3.5 text-[#003cc3] flex-shrink-0" />
                )}
              </button>
            ))}
          </div>,
          document.body,
        )}

      {/* ── Centered modal overlay ──────────────────────────────────── */}
      {modal && typeof document !== "undefined" &&
        createPortal(
          <AnimatePresence>
            {open && (
              <motion.div
                key="select-modal-backdrop"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/50"
                onClick={() => setOpen(false)}
              >
                <motion.div
                  key="select-modal-panel"
                  initial={{ opacity: 0, scale: 0.95, y: 8 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 8 }}
                  transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
                  className="bg-white w-full max-w-sm rounded-[20px] shadow-[0_8px_40px_rgba(0,0,0,0.18)] overflow-hidden flex flex-col max-h-[70vh]"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 flex-shrink-0">
                    <h3 className="text-sm font-bold text-[#1e293b]">{label}</h3>
                    <button
                      type="button"
                      onClick={() => setOpen(false)}
                      className="w-8 h-8 flex items-center justify-center rounded-xl text-slate-400 hover:text-[#1e293b] hover:bg-slate-100 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="overflow-y-auto flex-1 py-2">
                    {options.map((opt) => (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => handleSelect(opt.value)}
                        className={`w-full flex items-center justify-between px-5 py-3.5 text-sm transition-colors ${
                          opt.value === value
                            ? "text-[#003cc3] font-semibold bg-blue-50/60"
                            : opt.value === ""
                            ? "text-slate-400 hover:bg-slate-50"
                            : "text-[#1e293b] hover:bg-slate-50"
                        }`}
                      >
                        {opt.label}
                        {opt.value === value && opt.value !== "" && (
                          <Check className="w-3.5 h-3.5 text-[#003cc3] flex-shrink-0" />
                        )}
                      </button>
                    ))}
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
};

export default Select;

