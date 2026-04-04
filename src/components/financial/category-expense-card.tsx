"use client";

import { motion } from "framer-motion";

interface CategoryExpenseCardProps {
  categoryName: string;
  icon?: React.ReactNode;
  percentage: number;
  amount: string;
  color?: string;
  backgroundColor?: string;
}

const CategoryExpenseCard: React.FC<CategoryExpenseCardProps> = ({
  categoryName,
  icon,
  percentage,
  amount,
  color = "#003cc3",
  backgroundColor = "rgba(0, 60, 195, 0.08)",
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      whileHover={{ y: -1 }}
      className="group overflow-hidden rounded-xl border border-slate-100 bg-white p-4 shadow-sm transition-all duration-300 hover:shadow-md"
    >
      <div className="flex items-start justify-between gap-3 mb-4">
        {icon && (
          <div
            style={{ backgroundColor }}
            className="rounded-lg p-2 flex-shrink-0"
          >
            {icon}
          </div>
        )}
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-semibold text-slate-900 truncate">
            {categoryName}
          </h4>
        </div>
      </div>

      {/* Percentage Bar */}
      <div className="mb-3">
        <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
            style={{ backgroundColor: color }}
            className="h-full rounded-full"
          />
        </div>
      </div>

      {/* Amount and Percentage */}
      <div className="flex items-center justify-between">
        <p className="text-xl font-bold text-slate-900">{amount}</p>
        <div
          style={{ backgroundColor: `${color}20`, color }}
          className="px-3 py-1 rounded-full text-xs font-semibold"
        >
          {percentage.toFixed(1)}%
        </div>
      </div>
    </motion.div>
  );
};

export default CategoryExpenseCard;
