"use client";

import { useCallback, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Plus } from "lucide-react";
import { buildGoalCardData } from "@/store/goal-store";
import { useGoal } from "@/hooks/use-goal";
import { NoMovementIcon } from "@/constants/icons";
import EditModal from "@/components/ui/edit-modal";
import type { Goal } from "@/types/dtos/goal.dto";
import { GoalRow } from "@/components/goals/goal-row";
import { NewGoalModal } from "@/components/goals/new-goal-modal";
import { GoalDetailModal } from "@/components/goals/goal-detail-modal";

const EASE_OUT = [0.22, 1, 0.36, 1] as [number, number, number, number];

// ── Page ──────────────────────────────────────────────────────────────────────

export default function GoalsPage() {
  const { goals, isLoading, getGoals: fetch, refreshGoals: refresh } = useGoal();
  const [showNew, setShowNew]           = useState(false);
  const [editTarget, setEditTarget]     = useState<Goal | null>(null);
  const [detailTarget, setDetailTarget] = useState<Goal | null>(null);

  const items = useMemo(() => goals.map(buildGoalCardData), [goals]);
  const active    = items.filter(g => !g.isCompleted);
  const completed = items.filter(g => g.isCompleted);

  const handleNewSuccess = useCallback(() => {
    setShowNew(false);
    refresh();
  }, [refresh]);

  const handleEditClose = useCallback(() => setEditTarget(null), []);
  const handleEditUpdated = useCallback(() => { setEditTarget(null); refresh(); }, [refresh]);

  const handleDetailEdit = useCallback(() => {
    if (detailTarget) {
      setEditTarget(detailTarget);
      setDetailTarget(null);
    }
  }, [detailTarget]);

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
          className="flex items-center gap-1.5 bg-secondary text-white text-xs font-bold px-3 sm:px-4 py-2.5 rounded-full shadow-sm hover:bg-secondary-dark transition-colors"
        >
          <Plus className="w-3.5 h-3.5 flex-shrink-0" />
          <span className="hidden xs:inline sm:inline">Novo objectivo</span>
        </motion.button>
      </motion.div>

      {/* Active goals */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2, ease: EASE_OUT, delay: 0.08 }}
        className="flex flex-col gap-3"
      >
        {/* Section header */}
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900">Em andamento</h3>
          <span className="text-xs text-slate-400">
            {active.length} {active.length === 1 ? "objectivo" : "objectivos"}
          </span>
        </div>

        {isLoading ? (
          <div className="flex flex-col gap-3" aria-label="A carregar objectivos" aria-busy="true">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white rounded-[20px] p-[18px] animate-pulse shadow-[0_4px_16px_rgba(0,60,195,0.06)]">
                <div className="flex items-center gap-3.5">
                  <div className="w-[52px] h-[52px] rounded-[16px] bg-slate-100 flex-shrink-0" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-slate-100 rounded-full w-3/4" />
                    <div className="h-3 bg-slate-100 rounded-full w-1/2" />
                    <div className="h-[7px] bg-slate-100 rounded-full w-full" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : active.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 gap-3 px-5 text-center bg-white rounded-[20px] shadow-[0_4px_16px_rgba(0,60,195,0.06)]">
            <NoMovementIcon className="w-10 h-10 text-slate-200" />
            <p className="text-sm font-semibold text-slate-700">Nenhum objectivo em andamento.</p>
            <p className="text-xs text-slate-400">Crie um objectivo para começar a poupar.</p>
          </div>
        ) : (
          active.map((g, i) => (
            <GoalRow
              key={g.id}
              data={g}
              index={i}
              onEdit={() => setDetailTarget(g.goal)}
            />
          ))
        )}
      </motion.div>

      {/* Completed goals */}
      {completed.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, ease: EASE_OUT, delay: 0.14 }}
          className="flex flex-col gap-3"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900">Concluídos</h3>
            <span className="text-xs text-slate-400">
              {completed.length} {completed.length === 1 ? "objectivo" : "objectivos"}
            </span>
          </div>
          {completed.map((g, i) => (
            <GoalRow key={g.id} data={g} index={i} onEdit={() => setDetailTarget(g.goal)} />
          ))}
        </motion.div>
      )}

      {/* Modals */}
      <AnimatePresence>
        {showNew && (
          <NewGoalModal onClose={() => setShowNew(false)} onSuccess={handleNewSuccess} />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {detailTarget && (
          <GoalDetailModal
            goal={detailTarget}
            onClose={() => setDetailTarget(null)}
            onEdit={handleDetailEdit}
            onProgressAdded={() => { refresh(); }}
          />
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
