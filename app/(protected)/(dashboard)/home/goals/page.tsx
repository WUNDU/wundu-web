"use client";

import React, { useCallback, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Plus } from "lucide-react";
import { buildGoalCardData } from "@/store/goal-store";
import { useGoal } from "@/hooks/use-goal";
import { NoMovementIcon } from "@/constants/icons";
import EditModal from "@/components/ui/edit-modal";
import type { Goal } from "@/types/dtos/goal.dto";
import { GoalRow } from "@/components/goals/goal-row";
import { NewGoalModal } from "@/components/goals/new-goal-modal";

const EASE_OUT = [0.22, 1, 0.36, 1] as [number, number, number, number];

// ── Page ──────────────────────────────────────────────────────────────────────

export default function GoalsPage() {
  const { goals, isLoading, getGoals: fetch, refreshGoals: refresh } = useGoal();
  const [showNew, setShowNew]         = useState(false);
  const [editTarget, setEditTarget]   = useState<Goal | null>(null);

  const items = useMemo(() => goals.map(buildGoalCardData), [goals]);
  const active    = items.filter(g => !g.isCompleted);
  const completed = items.filter(g => g.isCompleted);

  const handleNewSuccess = useCallback(() => {
    setShowNew(false);
    refresh();
  }, [refresh]);

  const handleEditClose = useCallback(() => setEditTarget(null), []);
  const handleEditUpdated = useCallback(() => { setEditTarget(null); refresh(); }, [refresh]);

  return (
    <div className="w-full max-w-[1360px] mx-auto flex flex-col gap-3">

      {/* Page header — same style as home */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2, ease: EASE_OUT }}
        className="flex items-center justify-between"
      >
        <div>
          <h2 className="text-sm font-bold text-slate-900 tracking-tight">
            Objectivos Financeiros
          </h2>
          <p className="text-sm text-slate-500 font-medium">
            Acompanhe e gira os seus objectivos de poupança.
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => setShowNew(true)}
          className="flex items-center gap-1.5 bg-[#003cc3] text-white text-xs font-bold px-4 py-2.5 rounded-full shadow-sm hover:bg-[#0033a8] transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          Novo objectivo
        </motion.button>
      </motion.div>

      {/* Active goals */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2, ease: EASE_OUT, delay: 0.08 }}
      >
        <div className="bg-white rounded-[20px] shadow-[0_4px_16px_rgba(0,60,195,0.08)] overflow-hidden">
          {/* Section header */}
          <div className="flex items-center justify-between px-5 pt-5 pb-3">
            <h3 className="font-bold text-[#1e293b]" style={{ fontSize: 16 }}>
              Em andamento
            </h3>
            <span className="text-xs text-[#94a3b8]">
              {active.length} {active.length === 1 ? "objectivo" : "objectivos"}
            </span>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-12 gap-3">
              <div className="w-6 h-6 border-[2.5px] border-[#003cc3] border-t-transparent rounded-full animate-spin" />
              <span className="text-sm text-[#64748b]">A carregar...</span>
            </div>
          ) : active.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 gap-3 px-5 text-center pb-8">
              <NoMovementIcon className="w-10 h-10 text-slate-200" />
              <p className="text-sm font-semibold text-slate-700">Nenhum objectivo em andamento.</p>
              <p className="text-xs text-[#94a3b8]">Crie um objectivo para começar a poupar.</p>
            </div>
          ) : (
            <div className="pb-3">
              {active.map((g, i) => (
                <React.Fragment key={g.id}>
                  <GoalRow
                    data={g}
                    index={i}
                    onEdit={() => setEditTarget(g.goal)}
                  />
                  {i < active.length - 1 && (
                    <div className="h-px mx-5" style={{ backgroundColor: "rgba(0,33,107,0.05)" }} />
                  )}
                </React.Fragment>
              ))}
            </div>
          )}
        </div>
      </motion.div>

      {/* Completed goals */}
      {completed.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, ease: EASE_OUT, delay: 0.14 }}
        >
          <div className="bg-white rounded-[20px] shadow-[0_4px_16px_rgba(0,60,195,0.08)] overflow-hidden">
            <div className="flex items-center justify-between px-5 pt-5 pb-3">
              <h3 className="font-bold text-[#1e293b]" style={{ fontSize: 16 }}>
                Concluídos
              </h3>
              <span className="text-xs text-[#94a3b8]">
                {completed.length} {completed.length === 1 ? "objectivo" : "objectivos"}
              </span>
            </div>
            <div className="pb-3">
              {completed.map((g, i) => (
                <React.Fragment key={g.id}>
                  <GoalRow data={g} index={i} />
                  {i < completed.length - 1 && (
                    <div className="h-px mx-5" style={{ backgroundColor: "rgba(0,33,107,0.05)" }} />
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {/* Modals */}
      <AnimatePresence>
        {showNew && (
          <NewGoalModal onClose={() => setShowNew(false)} onSuccess={handleNewSuccess} />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {editTarget && (
          <EditModal
            isOpen={Boolean(editTarget)}
            onClose={handleEditClose}
            onUpdated={handleEditUpdated}
            objective={editTarget}
          />
        )}
      </AnimatePresence>

    </div>
  );
}
