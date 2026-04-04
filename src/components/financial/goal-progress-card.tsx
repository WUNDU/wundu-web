"use client";

import { motion } from "framer-motion";
import { Edit2, CheckCircle2 } from "lucide-react";
import { ObjectiveIcon } from "@/constants/icons";

interface GoalProgressCardProps {
  id?: string;
  title: string;
  targetAmount: string;
  savedAmount: string;
  percentage: number;
  isCompleted?: boolean;
  onEdit?: () => void;
}

const GoalProgressCard: React.FC<GoalProgressCardProps> = ({
  title,
  targetAmount,
  savedAmount,
  percentage,
  isCompleted = false,
  onEdit,
}) => {
  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;
  
  const ringColor = isCompleted ? "stroke-emerald-500" : "stroke-[#ffd400]";
  const progressTextColor = isCompleted ? "text-emerald-600" : "text-[#003cc3]";

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      whileHover={{ y: -2 }}
      className="group relative overflow-hidden rounded-2xl border border-slate-100 bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-md"
    >
      {/* Subtle gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50/50 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />

      <div className="relative z-10 flex flex-col gap-6">
        {/* Header: Icon + Title + Completion Badge */}
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3">
            <div className="mt-1 rounded-full bg-[#003cc3]/10 p-3 flex-shrink-0">
              <ObjectiveIcon className="h-5 w-5 text-[#003cc3]" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-semibold text-slate-900 leading-tight truncate">
                {title}
              </h3>
              <p className="text-xs text-slate-500 mt-1">Meta de poupança</p>
            </div>
          </div>
          {isCompleted && (
            <div className="flex-shrink-0 ml-2">
              <CheckCircle2 className="h-6 w-6 text-emerald-500" />
            </div>
          )}
        </div>

        {/* Progress Ring + Values */}
        <div className="flex items-center gap-6">
          {/* Ring */}
          <div className="relative flex-shrink-0 w-32 h-32">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120" fill="none">
              {/* Background ring */}
              <circle
                cx="60"
                cy="60"
                r={radius}
                strokeWidth="8"
                stroke="rgba(15, 23, 42, 0.08)"
                fill="transparent"
              />
              {/* Progress ring */}
              <circle
                cx="60"
                cy="60"
                r={radius}
                strokeWidth="8"
                strokeLinecap="round"
                className={ringColor}
                fill="transparent"
                style={{
                  strokeDasharray: circumference,
                  strokeDashoffset,
                  transition: "stroke-dashoffset 1.2s cubic-bezier(0.22, 1, 0.36, 1)",
                }}
              />
            </svg>
            {/* Percentage text */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <p className={`text-3xl font-bold ${progressTextColor}`}>
                  {percentage}%
                </p>
                <p className="text-xs text-slate-500 font-medium">completo</p>
              </div>
            </div>
          </div>

          {/* Values */}
          <div className="flex-1 space-y-4">
            {/* Saved Amount */}
            <div className="bg-emerald-50/50 rounded-lg p-4 border border-emerald-100/50">
              <p className="text-xs text-emerald-600 font-semibold uppercase tracking-wide mb-1">
                Poupado
              </p>
              <p className="text-2xl font-bold text-emerald-700">
                {savedAmount}
              </p>
            </div>

            {/* Target Amount */}
            <div className="bg-[#003cc3]/5 rounded-lg p-4 border border-[#003cc3]/10">
              <p className="text-xs text-[#003cc3] font-semibold uppercase tracking-wide mb-1">
                Meta
              </p>
              <p className="text-2xl font-bold text-[#003cc3]">
                {targetAmount}
              </p>
            </div>
          </div>
        </div>

        {/* Edit Button */}
        {!isCompleted && onEdit && (
          <motion.button
            onClick={onEdit}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full flex items-center justify-center gap-2 bg-[#003cc3]/8 hover:bg-[#003cc3]/12 text-[#003cc3] font-semibold py-3 rounded-lg transition-colors duration-200"
          >
            <Edit2 className="h-4 w-4" />
            Editar Objetivo
          </motion.button>
        )}
      </div>
    </motion.div>
  );
};

export default GoalProgressCard;
