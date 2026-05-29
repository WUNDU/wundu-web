"use client";

import React from "react";
import { motion } from "framer-motion";
import { PlusFileIcon } from "@/constants/icons";

const EASE_OUT: [number, number, number, number] = [0.22, 1, 0.36, 1];

const SECTION_ENTER = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.2, ease: EASE_OUT as [number, number, number, number] },
};

const UploadSection: React.FC<{ onUploadClick: () => void; isUploading?: boolean }> = ({
  onUploadClick,
  isUploading = false,
}) => (
  <motion.div
    {...SECTION_ENTER}
    whileHover={{ transition: { duration: 0.18, ease: EASE_OUT } }}
    className="group relative flex flex-col items-center justify-center p-3 sm:p-4 bg-white rounded-xl border border-slate-100 shadow-sm hover:shadow-md hover:border-[#ffd400]/60 transition-colors duration-300 cursor-pointer w-full h-full min-h-0 sm:min-h-[140px] overflow-hidden"
    onClick={isUploading ? undefined : onUploadClick}
    onKeyDown={(e) => {
      if (!isUploading && (e.key === "Enter" || e.key === " ")) {
        e.preventDefault();
        onUploadClick();
      }
    }}
    role="button"
    tabIndex={0}
    aria-disabled={isUploading}
  >
    <div className="absolute inset-0 bg-gradient-to-br from-[#ffd400]/12 via-transparent to-[#003cc3]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    <div className="relative z-10 flex flex-col items-center gap-2 sm:gap-3">
      {isUploading ? (
        <>
          <div className="relative p-3 bg-[#003cc3]/10 rounded-xl shadow-sm">
            <div className="w-6 h-6 border-2 border-[#003cc3]/20 border-t-[#003cc3] rounded-full animate-spin" />
          </div>
          <p className="text-sm font-semibold text-slate-500 tracking-tight">
            A enviar…
          </p>
        </>
      ) : (
        <>
          <div className="relative p-3 bg-[#ffd400]/18 rounded-xl group-hover:bg-[#ffd400]/24 transition-colors duration-300 shadow-sm">
            <PlusFileIcon className="w-6 h-6 text-[#003cc3]" />
          </div>
          <p className="text-sm font-semibold text-slate-900 tracking-tight">
            Adicionar Transação
          </p>
        </>
      )}
    </div>
  </motion.div>
);

export default UploadSection;
