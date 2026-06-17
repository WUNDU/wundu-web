"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { X, User as UserIcon, Mail, Phone, Lock, Loader2, Eye, EyeOff } from "lucide-react";
import { useUserStore } from "@/store/user-store";
import type { User } from "@/types/dtos/auth.dto";
import type { UserRequest } from "@/types/dtos/user.dto";

const EASE = [0.22, 1, 0.36, 1] as [number, number, number, number];

// Backend: ^(\+244)?\s?(9\d{8}|2\d{8})$
const PHONE_RE = /^(\+244)?\s?(9\d{8}|2\d{8})$/;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export interface EditProfileModalProps {
  user: User;
  onClose: () => void;
}

export function EditProfileModal({ user, onClose }: EditProfileModalProps) {
  const updateProfile = useUserStore((s) => s.updateProfile);

  const [name, setName] = useState(user.name ?? "");
  const [email, setEmail] = useState(user.email ?? "");
  const [phone, setPhone] = useState(user.phoneNumber ?? "");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = (): boolean => {
    const e: Record<string, string> = {};
    const n = name.trim();
    if (n.length < 2 || n.length > 100) e.name = "Nome deve ter entre 2 e 100 caracteres.";
    if (!EMAIL_RE.test(email.trim())) e.email = "Email inválido.";
    if (!PHONE_RE.test(phone.replace(/\s+/g, ""))) e.phone = "Telefone inválido (ex: 9XXXXXXXX).";
    if (password && (password.length < 8 || password.length > 12))
      e.password = "Palavra-passe deve ter entre 8 e 12 caracteres.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = async () => {
    if (saving || !validate()) return;
    setSaving(true);
    const payload: Partial<UserRequest> = {
      name: name.trim(),
      email: email.trim(),
      phoneNumber: phone.replace(/\s+/g, ""),
    };
    if (password) payload.password = password;
    const ok = await updateProfile(payload);
    setSaving(false);
    if (ok) onClose();
  };

  const fields: {
    key: string;
    icon: React.ReactNode;
    label: string;
    value: string;
    setter: (v: string) => void;
    type?: string;
    placeholder?: string;
    hint?: string;
  }[] = [
    { key: "name", icon: <UserIcon className="w-4 h-4 text-secondary" />, label: "Nome completo", value: name, setter: setName, placeholder: "O seu nome" },
    { key: "email", icon: <Mail className="w-4 h-4 text-secondary" />, label: "Endereço de email", value: email, setter: setEmail, type: "email", placeholder: "nome@email.com" },
    { key: "phone", icon: <Phone className="w-4 h-4 text-secondary" />, label: "Número de telefone", value: phone, setter: setPhone, type: "tel", placeholder: "9XXXXXXXX" },
  ];

  return (
    <div
      className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center bg-black/55 p-0 sm:p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, y: 48 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 48 }}
        transition={{ duration: 0.28, ease: EASE }}
        className="relative w-full sm:max-w-md bg-white sm:rounded-[26px] rounded-t-[28px] shadow-2xl max-h-[92dvh] sm:max-h-[94vh] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drag handle */}
        <div className="flex-shrink-0 flex justify-center pt-3 sm:hidden">
          <div className="w-9 h-1 rounded-full bg-slate-200" />
        </div>

        {/* ── Hero ── */}
        <div
          className="flex-shrink-0 relative overflow-hidden px-5 sm:px-6 pt-4 sm:pt-5 pb-5"
          style={{ background: "linear-gradient(135deg, #0048f0 0%, #002db8 55%, #001880 100%)" }}
        >
          <div className="pointer-events-none absolute -top-12 -right-12 w-48 h-48 rounded-full" style={{ backgroundColor: "rgba(255,255,255,0.03)" }} />
          <div className="pointer-events-none absolute -bottom-8 -left-8 w-36 h-36 rounded-full" style={{ backgroundColor: "rgba(255,212,0,0.05)" }} />

          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full flex items-center justify-center transition-colors"
            style={{ backgroundColor: "rgba(255,255,255,0.12)" }}
          >
            <X className="w-4 h-4 text-white/75" />
          </button>

          <p className="text-[9px] uppercase tracking-[1.6px] font-bold text-white/40 mb-1">Editar perfil</p>
          <h2 className="text-base sm:text-[18px] font-black text-white leading-tight">Os seus dados</h2>
          <p className="text-[11px] text-white/45 mt-1">Actualize as suas informações pessoais e de acesso</p>
        </div>

        {/* ── Body ── */}
        <div className="flex-1 min-h-0 overflow-y-auto bg-white px-5 py-5 space-y-3.5">
          {fields.map((f) => (
            <div key={f.key}>
              <label className="text-[9px] font-bold uppercase tracking-[1.2px] text-slate-400 mb-1.5 block">{f.label}</label>
              <div
                className={`flex items-center gap-3 rounded-2xl px-4 py-3 border transition-colors ${errors[f.key] ? "border-red-300 bg-red-50/40" : "border-slate-100 bg-[#f8fafc] focus-within:border-secondary/40"}`}
              >
                <div className="w-9 h-9 rounded-[11px] flex items-center justify-center flex-shrink-0" style={{ backgroundColor: "rgba(0,60,195,0.07)" }}>
                  {f.icon}
                </div>
                <input
                  type={f.type ?? "text"}
                  value={f.value}
                  onChange={(e) => f.setter(e.target.value)}
                  placeholder={f.placeholder}
                  className="flex-1 min-w-0 text-sm font-semibold text-slate-900 bg-transparent outline-none placeholder:text-slate-300 placeholder:font-medium"
                />
              </div>
              {errors[f.key] && <p className="text-[11px] text-red-500 font-medium mt-1 ml-1">{errors[f.key]}</p>}
            </div>
          ))}

          {/* Password (optional) */}
          <div>
            <label className="text-[9px] font-bold uppercase tracking-[1.2px] text-slate-400 mb-1.5 block">Nova palavra-passe</label>
            <div
              className={`flex items-center gap-3 rounded-2xl px-4 py-3 border transition-colors ${errors.password ? "border-red-300 bg-red-50/40" : "border-slate-100 bg-[#f8fafc] focus-within:border-secondary/40"}`}
            >
              <div className="w-9 h-9 rounded-[11px] flex items-center justify-center flex-shrink-0" style={{ backgroundColor: "rgba(0,60,195,0.07)" }}>
                <Lock className="w-4 h-4 text-secondary" />
              </div>
              <input
                type={showPwd ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Deixe em branco para manter"
                autoComplete="new-password"
                className="flex-1 min-w-0 text-sm font-semibold text-slate-900 bg-transparent outline-none placeholder:text-slate-300 placeholder:font-medium"
              />
              <button type="button" onClick={() => setShowPwd((v) => !v)} className="flex-shrink-0 text-slate-400 hover:text-secondary transition-colors">
                {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {errors.password && <p className="text-[11px] text-red-500 font-medium mt-1 ml-1">{errors.password}</p>}
          </div>
        </div>

        {/* ── Footer ── */}
        <div className="flex-shrink-0 px-5 py-3 border-t border-slate-100 flex gap-2 bg-white">
          <button
            onClick={onClose}
            className="flex-1 py-3 rounded-xl text-xs font-bold text-slate-500 bg-slate-100 hover:bg-slate-200 transition-colors"
          >
            Cancelar
          </button>
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={handleSave}
            disabled={saving}
            className="flex-[1.4] py-3 rounded-xl text-xs font-black text-white flex items-center justify-center gap-2 transition-opacity disabled:opacity-40"
            style={{ background: "linear-gradient(135deg, #003cc3 0%, #001a66 100%)" }}
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : "Guardar alterações"}
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}
