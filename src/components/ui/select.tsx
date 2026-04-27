"use client";

import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { ChevronDown, Check } from "lucide-react";
import { SelectProps } from "@/types/ui";

const Select: React.FC<SelectProps> = ({
  label,
  value,
  onChange,
  options,
  className,
}) => {
  const [open, setOpen] = useState(false);
  const [dropPos, setDropPos] = useState({ top: 0, left: 0, width: 0 });
  const btnRef = useRef<HTMLButtonElement>(null);
  const dropRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((o) => o.value === value);
  const isPlaceholder = !value || (options[0]?.value === "" && value === "");

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        dropRef.current && !dropRef.current.contains(e.target as Node) &&
        btnRef.current && !btnRef.current.contains(e.target as Node)
      ) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const openDrop = () => {
    if (btnRef.current) {
      const r = btnRef.current.getBoundingClientRect();
      const dropHeight = Math.min(options.length * 44 + 8, 260);
      const spaceBelow = window.innerHeight - r.bottom;
      const top = spaceBelow >= dropHeight ? r.bottom + 4 : r.top - dropHeight - 4;
      setDropPos({ top, left: r.left, width: r.width });
    }
    setOpen((o) => !o);
  };

  return (
    <div className={`flex w-full flex-col gap-2 ${className ?? ""}`}>
      {label && (
        <label className="text-sm font-medium text-slate-600">{label}</label>
      )}
      <button
        ref={btnRef}
        type="button"
        onClick={openDrop}
        className={`w-full flex items-center justify-between rounded-xl border px-4 py-3 text-sm bg-slate-50 focus:outline-none transition-all ${
          open
            ? "border-[#003cc3]/40 bg-white ring-4 ring-[#003cc3]/[0.06]"
            : "border-slate-200 hover:border-[#003cc3]/30"
        }`}
      >
        <span className={isPlaceholder ? "text-slate-400" : "text-[#1e293b]"}>
          {selectedOption?.label ?? options[0]?.label ?? "Selecione"}
        </span>
        <ChevronDown
          className={`w-4 h-4 text-slate-400 transition-transform flex-shrink-0 ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && typeof document !== "undefined" &&
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
                onClick={() => { onChange(opt.value); setOpen(false); }}
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
    </div>
  );
};

export default Select;

