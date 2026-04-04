"use client";

import { motion } from "framer-motion";
import { TrendingUp, TrendingDown } from "lucide-react";
import { MoneyIcon } from "@/constants/icons";
import { formatAOA } from "@/lib/currency";

interface BalanceCardProps {
  totalBalance: number;
  trend?: number;
  currency?: string;
}

const BalanceCard: React.FC<BalanceCardProps> = ({
  totalBalance,
  trend,
  currency = "AOA",
}) => {
  const isPositiveTrend = trend ? trend > 0 : false;
  const trendAbsolute = trend ? Math.abs(trend) : 0;

  const formattedBalance = `${formatAOA(totalBalance)} Kz`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="relative overflow-hidden rounded-3xl border border-slate-100 bg-gradient-to-br from-[#003cc3] to-[#001a66] p-6 sm:p-8 shadow-md"
    >
      {/* Decorative gradient orb */}
      <div className="absolute right-0 top-0 -mr-20 -mt-20 h-40 w-40 rounded-full bg-[#ffd400] opacity-5 blur-3xl" />
      <div className="absolute bottom-0 left-0 -ml-12 -mb-12 h-32 w-32 rounded-full bg-white opacity-5 blur-3xl" />

      <div className="relative z-10">
        <div className="mb-6 flex items-center justify-between">
          <div className="rounded-full bg-white/10 p-3">
            <MoneyIcon className="h-6 w-6 text-[#ffd400]" />
          </div>
          {trend !== undefined && trend !== 0 && (
            <div
              className={`flex items-center gap-1 rounded-full px-3 py-1 ${
                isPositiveTrend
                  ? "bg-emerald-500/20 text-emerald-600"
                  : "bg-rose-500/20 text-rose-600"
              }`}
            >
              {isPositiveTrend ? (
                <TrendingUp className="h-4 w-4" />
              ) : (
                <TrendingDown className="h-4 w-4" />
              )}
              <span className="text-xs font-semibold">{trendAbsolute}%</span>
            </div>
          )}
        </div>

        <div>
          <p className="mb-2 text-sm font-medium text-white/70">
            Saldo Total
          </p>
          <h2 className="text-4xl font-bold text-white sm:text-5xl">
            {formattedBalance}
          </h2>
        </div>
      </div>
    </motion.div>
  );
};

export default BalanceCard;
