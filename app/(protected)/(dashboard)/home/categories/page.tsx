"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Tag, Plus, Loader2, Globe, User, FolderPlus } from "lucide-react";
import { useCategoryStore } from "@/store/category-store";
import { getCategoryStyle } from "@/utils/category-style";

export default function CategoriesPage() {
  const { categories, isLoading, hasFetched, fetchActive, create } = useCategoryStore();
  const [newName, setNewName] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (!hasFetched) fetchActive();
  }, [hasFetched, fetchActive]);

  const globalCategories = categories.filter((c) => !c.userId);
  const myCategories = categories.filter((c) => !!c.userId);

  const handleCreate = async () => {
    const name = newName.trim();
    if (!name) return;

    const exists = categories.some((c) => c.name.toLowerCase() === name.toLowerCase());
    if (exists) {
      setErrorMsg(`A categoria "${name}" já existe.`);
      return;
    }

    setIsCreating(true);
    setErrorMsg("");
    setSuccessMsg("");
    const created = await create({ name });
    setIsCreating(false);
    if (created) {
      setNewName("");
      setSuccessMsg(`Categoria "${created.name}" criada com sucesso.`);
      setTimeout(() => setSuccessMsg(""), 3000);
    } else {
      setErrorMsg("Não foi possível criar a categoria. Tente novamente.");
    }
  };

  return (
    <motion.div
      className="max-w-[800px] mx-auto px-4 pb-6 space-y-6"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.18, ease: "easeOut" }}
    >
      {/* Header */}
      <div className="flex items-center gap-3 pt-4">
        <div className="w-10 h-10 rounded-[13px] bg-gradient-to-br from-[#003cc3] to-[#001a66] flex items-center justify-center shadow-sm">
          <Tag className="w-5 h-5 text-[#ffd400]" />
        </div>
        <div>
          <h1 className="text-sm font-bold text-slate-900 tracking-tight">Categorias</h1>
          <p className="text-sm text-slate-500 font-medium">Gira as suas categorias de despesas</p>
        </div>
      </div>

      {/* Create custom category */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-[0_2px_12px_rgba(0,60,195,0.06)] p-5">
        <div className="flex items-center gap-2 mb-4">
          <FolderPlus className="w-4 h-4 text-[#003cc3]" />
          <h2 className="text-sm font-bold text-[#1e293b]">Nova categoria personalizada</h2>
        </div>
        <div className="flex flex-col xs:flex-row gap-2">
          <input
            type="text"
            value={newName}
            onChange={(e) => { setNewName(e.target.value); setErrorMsg(""); }}
            onKeyDown={(e) => e.key === "Enter" && handleCreate()}
            placeholder="Ex: Viagens, Animais..."
            className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-[#1e293b] placeholder:text-slate-400 focus:outline-none focus:border-[#003cc3]/40 focus:bg-white transition-all"
          />
          <button
            onClick={handleCreate}
            disabled={!newName.trim() || isCreating}
            className="flex items-center justify-center gap-1.5 px-4 py-2.5 bg-[#ffd400] text-[#1e293b] rounded-xl text-sm font-bold hover:bg-yellow-400 active:bg-yellow-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all whitespace-nowrap"
          >
            {isCreating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
            Criar
          </button>
        </div>
        {successMsg && <p className="text-green-600 text-xs mt-2">{successMsg}</p>}
        {errorMsg && <p className="text-red-500 text-xs mt-2">{errorMsg}</p>}
      </div>

      {/* Personal categories */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-[0_2px_12px_rgba(0,60,195,0.06)] p-5">
        <div className="flex items-center gap-2 mb-4">
          <User className="w-4 h-4 text-[#003cc3]" />
          <h2 className="text-sm font-bold text-[#1e293b]">Personalizadas</h2>
          <span className="ml-auto text-xs text-slate-400">{myCategories.length}</span>
        </div>
        {isLoading ? (
          <div className="flex justify-center py-6">
            <Loader2 className="w-5 h-5 animate-spin text-slate-400" />
          </div>
        ) : myCategories.length === 0 ? (
          <div className="flex flex-col items-center gap-2 py-8 text-slate-400">
            <FolderPlus className="w-8 h-8 opacity-30" />
            <p className="text-sm">Ainda não tem categorias personalizadas.</p>
          </div>
        ) : (
          <div className="flex flex-wrap gap-2">
            {myCategories.map((cat) => {
              const { icon: Icon, color, bg } = getCategoryStyle(cat.name);
              return (
                <span
                  key={cat.id}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium border"
                  style={{ backgroundColor: bg, color, borderColor: color + "33" }}
                >
                  <Icon className="w-3.5 h-3.5 flex-shrink-0" style={{ color }} />
                  {cat.name}
                </span>
              );
            })}
          </div>
        )}
      </div>

      {/* System categories */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-[0_2px_12px_rgba(0,60,195,0.06)] p-5">
        <div className="flex items-center gap-2 mb-4">
          <Globe className="w-4 h-4 text-slate-400" />
          <h2 className="text-sm font-bold text-[#1e293b]">Do sistema</h2>
          <span className="ml-auto text-xs text-slate-400">{globalCategories.length}</span>
          <span className="text-[10px] text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">Somente leitura</span>
        </div>
        {isLoading ? (
          <div className="flex justify-center py-6">
            <Loader2 className="w-5 h-5 animate-spin text-slate-400" />
          </div>
        ) : (
          <div className="flex flex-wrap gap-2">
            {globalCategories.map((cat) => {
              const { icon: Icon, color, bg } = getCategoryStyle(cat.name);
              return (
                <span
                  key={cat.id}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium border"
                  style={{ backgroundColor: bg, color, borderColor: color + "33" }}
                >
                  <Icon className="w-3.5 h-3.5 flex-shrink-0" style={{ color }} />
                  {cat.name}
                </span>
              );
            })}
          </div>
        )}
      </div>
    </motion.div>
  );
}
