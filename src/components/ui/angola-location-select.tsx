"use client";

import React, { useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Check, X, Search, AlertTriangle } from "lucide-react";
import { useAngolaLocation } from "@/hooks/use-angola-location";
import { provinceEnumToSlug, provinceSlugToEnum } from "@/types/dtos/angola-location.dto";

export interface AngolaLocationSelectProps {
  /** enum backend, ex: "BENGO" */
  provinceValue: string;
  /** nome legível, ex: "Moçâmedes" */
  cityValue: string;
  onProvinceChange: (enumValue: string) => void;
  onCityChange: (name: string) => void;
  disabled?: boolean;
}

function Trigger({
  label,
  value,
  placeholder,
  disabled,
  onClick,
}: {
  label: string;
  value?: string;
  placeholder: string;
  disabled?: boolean;
  onClick: () => void;
}) {
  return (
    <div className="flex w-full flex-col gap-2">
      <label className="text-sm font-medium text-slate-600">{label}</label>
      <button
        type="button"
        disabled={disabled}
        onClick={onClick}
        className={`w-full flex items-center justify-between rounded-xl border px-4 py-3 text-sm bg-slate-50 focus:outline-none transition-all ${
          disabled
            ? "opacity-50 cursor-not-allowed border-slate-200"
            : "border-slate-200 hover:border-secondary/30"
        }`}
      >
        <span className={value ? "text-slate-900" : "text-slate-400"}>
          {value || placeholder}
        </span>
        <ChevronDown className="w-4 h-4 text-slate-400 flex-shrink-0" />
      </button>
    </div>
  );
}

function LocationPickerModal({
  open,
  title,
  items,
  selectedSlug,
  onSelect,
  onClose,
}: {
  open: boolean;
  title: string;
  items: { nome: string; slug: string }[];
  selectedSlug: string;
  onSelect: (slug: string) => void;
  onClose: () => void;
}) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    if (!query.trim()) return items;
    const q = query.trim().toLowerCase();
    return items.filter((i) => i.nome.toLowerCase().includes(q));
  }, [items, query]);

  if (typeof document === "undefined") return null;

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          key="loc-sel-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/50"
          onClick={onClose}
        >
          <motion.div
            key="loc-sel-panel"
            initial={{ opacity: 0, scale: 0.95, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 8 }}
            transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
            className="bg-white w-full max-w-sm rounded-[20px] shadow-[0_8px_40px_rgba(0,0,0,0.18)] overflow-hidden flex flex-col max-h-[70vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 flex-shrink-0">
              <h3 className="text-sm font-bold text-slate-900">{title}</h3>
              <button
                type="button"
                onClick={onClose}
                className="w-8 h-8 flex items-center justify-center rounded-xl text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="px-5 pt-3 pb-1 flex-shrink-0">
              <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
                <Search className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                <input
                  autoFocus
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Procurar..."
                  className="flex-1 min-w-0 bg-transparent text-sm outline-none placeholder:text-slate-400"
                />
              </div>
            </div>

            <div className="overflow-y-auto flex-1 py-2">
              {filtered.length === 0 && (
                <p className="px-5 py-6 text-center text-sm text-slate-400">Nenhum resultado.</p>
              )}
              {filtered.map((item) => {
                const selected = item.slug === selectedSlug;
                return (
                  <button
                    key={item.slug}
                    type="button"
                    onClick={() => onSelect(item.slug)}
                    className={`w-full flex items-center justify-between px-5 py-3 text-sm transition-colors ${
                      selected
                        ? "text-secondary font-semibold bg-blue-50/60"
                        : "text-slate-900 hover:bg-slate-50"
                    }`}
                  >
                    {item.nome}
                    {selected && <Check className="w-3.5 h-3.5 text-secondary flex-shrink-0" />}
                  </button>
                );
              })}
              <div className="h-2" />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}

export function AngolaLocationSelect({
  provinceValue,
  cityValue,
  onProvinceChange,
  onCityChange,
  disabled = false,
}: AngolaLocationSelectProps) {
  const initialSlug = provinceValue ? provinceEnumToSlug(provinceValue) : "";
  const {
    provinces,
    municipalities,
    selectedProvinceSlug,
    isLoading,
    usingFallback,
    selectProvince,
    selectMunicipality,
  } = useAngolaLocation(initialSlug);

  const [provinceOpen, setProvinceOpen] = useState(false);
  const [cityOpen, setCityOpen] = useState(false);

  const derivedProvinceSlug =
    selectedProvinceSlug || (provinceValue ? provinceEnumToSlug(provinceValue) : "");

  const derivedMunicipalitySlug =
    municipalities.find((m) => m.nome === cityValue)?.slug ?? "";

  // Município não tem enum no backend — se não há lista para a província
  // seleccionada (API em baixo ou província sem municípios carregados),
  // cai para texto livre em vez de bloquear o campo.
  const municipalityUnavailable =
    !isLoading && !!derivedProvinceSlug && municipalities.length === 0;

  return (
    <div className="flex flex-col gap-4">
      <Trigger
        label="Província"
        value={
          provinceValue ? provinces.find((p) => p.slug === derivedProvinceSlug)?.nome : undefined
        }
        placeholder={isLoading ? "A carregar províncias..." : "Seleciona a tua província"}
        disabled={disabled || isLoading}
        onClick={() => setProvinceOpen(true)}
      />

      {municipalityUnavailable ? (
        <div className="flex w-full flex-col gap-2">
          <label className="text-sm font-medium text-slate-600">Município</label>
          <input
            value={cityValue}
            onChange={(e) => onCityChange(e.target.value)}
            disabled={disabled}
            placeholder="Ex: Moçâmedes"
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-secondary/40"
          />
        </div>
      ) : (
        <Trigger
          label="Município"
          value={cityValue || undefined}
          placeholder={!derivedProvinceSlug ? "Seleciona primeiro a província" : "Seleciona o município"}
          disabled={disabled || isLoading || !derivedProvinceSlug}
          onClick={() => setCityOpen(true)}
        />
      )}

      {usingFallback && (
        <div className="flex items-center gap-1.5 -mt-2 text-amber-600">
          <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0" />
          <p className="text-xs">Lista oficial indisponível — a usar cópia offline. Município fica livre.</p>
        </div>
      )}

      <LocationPickerModal
        open={provinceOpen}
        title="Província"
        items={provinces}
        selectedSlug={derivedProvinceSlug}
        onClose={() => setProvinceOpen(false)}
        onSelect={(slug) => {
          selectProvince(slug);
          onProvinceChange(provinceSlugToEnum(slug));
          onCityChange("");
          setProvinceOpen(false);
        }}
      />
      <LocationPickerModal
        open={cityOpen}
        title="Município"
        items={municipalities}
        selectedSlug={derivedMunicipalitySlug}
        onClose={() => setCityOpen(false)}
        onSelect={(slug) => {
          selectMunicipality(slug);
          const mun = municipalities.find((m) => m.slug === slug);
          onCityChange(mun?.nome ?? "");
          setCityOpen(false);
        }}
      />
    </div>
  );
}

export default AngolaLocationSelect;
