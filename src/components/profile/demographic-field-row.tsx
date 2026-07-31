"use client";

import React, { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, X, Loader2, Pencil, Search } from "lucide-react";
import { useUserStore } from "@/store/user-store";
import { useUiStore } from "@/store/ui-store";
import { useAuth } from "@/hooks/use-auth";
import { useAngolaLocation } from "@/hooks/use-angola-location";
import { provinceEnumToSlug, provinceSlugToEnum } from "@/types/dtos/angola-location.dto";
import { validateAge18, getAgeErrorMessage } from "@/utils/validation";
import type { ProfileUpdateRequest } from "@/types/dtos/user.dto";
import type { Option } from "@/constants/profile-options";

const EASE = [0.22, 1, 0.36, 1] as [number, number, number, number];

type FieldKind = "chips" | "date" | "number" | "province" | "municipality";

export interface DemographicFieldRowProps {
  icon: React.ReactNode;
  label: string;
  fieldKey: keyof ProfileUpdateRequest;
  kind: FieldKind;
  rawValue: string | number | null | undefined;
  displayValue: string | null;
  options?: Option[];
  suffix?: string;
  isLast?: boolean;
}

export function DemographicFieldRow({
  icon,
  label,
  fieldKey,
  kind,
  rawValue,
  displayValue,
  options,
  suffix,
  isLast,
}: DemographicFieldRowProps) {
  const updateDemographics = useUserStore((s) => s.updateDemographics);
  const { user } = useAuth();
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [draft, setDraft] = useState(rawValue != null ? String(rawValue) : "");
  const [query, setQuery] = useState("");

  useEffect(() => {
    setDraft(rawValue != null ? String(rawValue) : "");
  }, [rawValue]);

  const openEdit = () => {
    setDraft(rawValue != null ? String(rawValue) : "");
    setQuery("");
    setEditing(true);
  };

  const closeEdit = () => {
    if (saving) return;
    setEditing(false);
    setQuery("");
  };

  const save = async (value: string | number) => {
    if (fieldKey === "birthDate" && typeof value === "string" && !validateAge18(new Date(value))) {
      useUiStore.getState().showNotification("error", "Data inválida", getAgeErrorMessage());
      return;
    }
    setSaving(true);
    const ok = await updateDemographics({ [fieldKey]: value } as ProfileUpdateRequest);
    setSaving(false);
    if (ok) {
      setEditing(false);
      setQuery("");
    }
  };

  // Localização: precisa da lista de províncias sempre (município deriva da
  // província actualmente gravada no user, não da que está a ser editada
  // noutra linha ao mesmo tempo — cada campo é independente por desenho).
  const needsLocation = kind === "province" || kind === "municipality";
  const provinceSlugForMunicipality = user?.province ? provinceEnumToSlug(user.province) : "";
  const { provinces, municipalities, isLoading: locLoading } = useAngolaLocation(
    kind === "municipality" ? provinceSlugForMunicipality : ""
  );

  const locationItems = useMemo(() => {
    const items = kind === "province" ? provinces : municipalities;
    if (!query.trim()) return items;
    const q = query.trim().toLowerCase();
    return items.filter((i) => i.nome.toLowerCase().includes(q));
  }, [kind, provinces, municipalities, query]);

  const municipalityNeedsFreeText =
    kind === "municipality" && !locLoading && (!user?.province || municipalities.length === 0);

  return (
    <div className={!isLast ? "border-b border-slate-50" : ""}>
      <div className="flex items-center gap-4 px-5 py-3.5">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-secondary/10">
          {icon}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-xs text-slate-400">{label}</p>
          <p className={`mt-0.5 text-sm font-medium ${displayValue ? "text-slate-800" : "text-slate-300"}`}>
            {displayValue || "Por preencher"}
          </p>
        </div>
        <button
          type="button"
          onClick={() => (editing ? closeEdit() : openEdit())}
          aria-label={`Editar ${label}`}
          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border transition-colors ${
            editing
              ? "border-secondary/30 bg-secondary/10 text-secondary"
              : "border-slate-200 text-slate-400 hover:border-secondary/30 hover:bg-secondary/5 hover:text-secondary"
          }`}
        >
          {editing ? <X className="h-3.5 w-3.5" /> : <Pencil className="h-3.5 w-3.5" />}
        </button>
      </div>

      <AnimatePresence initial={false}>
        {editing && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: EASE }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-4 pl-[3.75rem]">
              {kind === "chips" && (
                <div className="flex flex-wrap gap-2">
                  {options?.map((opt) => {
                    const selected = opt.value === rawValue;
                    return (
                      <button
                        key={opt.value}
                        type="button"
                        disabled={saving}
                        onClick={() => save(opt.value)}
                        className={`rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-colors disabled:opacity-50 ${
                          selected
                            ? "border-secondary bg-secondary text-white"
                            : "border-slate-200 bg-white text-slate-600 hover:border-secondary/40 hover:bg-secondary/5"
                        }`}
                      >
                        {opt.label}
                      </button>
                    );
                  })}
                  {saving && <Loader2 className="h-4 w-4 animate-spin text-secondary self-center" />}
                </div>
              )}

              {kind === "date" && (
                <div className="flex items-center gap-2">
                  <input
                    type="date"
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    max={new Date().toISOString().slice(0, 10)}
                    className="flex-1 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 outline-none focus:border-secondary/40"
                  />
                  <RowConfirmButtons saving={saving} onConfirm={() => save(draft)} onCancel={closeEdit} />
                </div>
              )}

              {kind === "number" && (
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    inputMode={fieldKey === "expectedMonthlyIncome" ? "decimal" : "numeric"}
                    value={draft}
                    onChange={(e) =>
                      setDraft(
                        e.target.value.replace(fieldKey === "expectedMonthlyIncome" ? /[^0-9.]/g : /[^0-9]/g, "")
                      )
                    }
                    placeholder="0"
                    autoFocus
                    className="flex-1 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 outline-none focus:border-secondary/40"
                  />
                  {suffix && <span className="text-xs font-medium text-slate-400">{suffix}</span>}
                  <RowConfirmButtons
                    saving={saving}
                    onConfirm={() => save(Number(draft))}
                    onCancel={closeEdit}
                  />
                </div>
              )}

              {needsLocation && !municipalityNeedsFreeText && (
                <div className="rounded-xl border border-slate-200 bg-slate-50 overflow-hidden">
                  <div className="flex items-center gap-2 px-3 py-2 border-b border-slate-200 bg-white">
                    <Search className="h-3.5 w-3.5 text-slate-400 flex-shrink-0" />
                    <input
                      autoFocus
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder={locLoading ? "A carregar..." : "Procurar..."}
                      className="flex-1 min-w-0 bg-transparent text-sm outline-none placeholder:text-slate-400"
                    />
                    {saving && <Loader2 className="h-3.5 w-3.5 animate-spin text-secondary" />}
                  </div>
                  <div className="max-h-52 overflow-y-auto">
                    {locationItems.length === 0 && (
                      <p className="px-3 py-4 text-center text-xs text-slate-400">Nenhum resultado.</p>
                    )}
                    {locationItems.map((item) => {
                      const selected =
                        kind === "province" ? item.slug === provinceEnumToSlug(String(rawValue ?? "")) : item.nome === rawValue;
                      return (
                        <button
                          key={item.slug}
                          type="button"
                          disabled={saving}
                          onClick={() =>
                            save(kind === "province" ? provinceSlugToEnum(item.slug) : item.nome)
                          }
                          className={`w-full flex items-center justify-between px-3 py-2.5 text-sm transition-colors disabled:opacity-50 ${
                            selected ? "text-secondary font-semibold bg-blue-50/60" : "text-slate-800 hover:bg-white"
                          }`}
                        >
                          {item.nome}
                          {selected && <Check className="h-3.5 w-3.5 text-secondary flex-shrink-0" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {municipalityNeedsFreeText && (
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    autoFocus
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    placeholder={!user?.province ? "Escolhe primeiro a província" : "Ex: Moçâmedes"}
                    disabled={!user?.province}
                    className="flex-1 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 outline-none focus:border-secondary/40 disabled:opacity-50"
                  />
                  <RowConfirmButtons
                    saving={saving}
                    disabled={!user?.province || !draft.trim()}
                    onConfirm={() => save(draft.trim())}
                    onCancel={closeEdit}
                  />
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function RowConfirmButtons({
  saving,
  disabled,
  onConfirm,
  onCancel,
}: {
  saving: boolean;
  disabled?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <div className="flex items-center gap-1.5 flex-shrink-0">
      <button
        type="button"
        onClick={onCancel}
        disabled={saving}
        className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-400 transition-colors hover:bg-slate-100 disabled:opacity-50"
      >
        <X className="h-3.5 w-3.5" />
      </button>
      <button
        type="button"
        onClick={onConfirm}
        disabled={saving || disabled}
        className="flex h-8 w-8 items-center justify-center rounded-lg bg-secondary text-white transition-opacity hover:opacity-90 disabled:opacity-40"
      >
        {saving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Check className="h-3.5 w-3.5" />}
      </button>
    </div>
  );
}
