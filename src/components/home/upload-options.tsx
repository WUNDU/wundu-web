"use client";

import React, { useRef } from "react";
import { CardIcon, EditIcon } from "@/constants/icons";

interface UploadOptionsProps {
  onFileSelect: (file: File, type: "image" | "document") => void;
  onManualClick?: () => void;
}

const UploadOptions: React.FC<UploadOptionsProps> = ({ onFileSelect, onManualClick }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleButtonClick = () => {
    if (fileInputRef.current) fileInputRef.current.click();
  };

  const handleFileChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    type: "image" | "document",
  ) => {
    const files = event.target.files;
    if (files && files.length > 0) onFileSelect(files[0], type);
  };

  const handleManualButtonClick = () => {
    if (onManualClick) onManualClick();
    else handleButtonClick();
  };

  return (
    <div className="flex flex-col gap-3 sm:gap-4">
      <button
        type="button"
        onClick={handleButtonClick}
        className="flex items-center gap-2 sm:gap-3 p-3 sm:p-4 border-2 border-dashed border-[rgba(0,60,195,0.15)] bg-[rgba(0,60,195,0.025)] rounded-xl text-left hover:bg-[rgba(0,60,195,0.04)] transition-colors"
      >
        <div className="flex-shrink-0 w-11 h-11 sm:w-14 sm:h-14 flex items-center justify-center bg-gradient-to-br from-[#003cc3] to-[#001a66] rounded-[13px] sm:rounded-[15px]">
          <CardIcon className="w-6 h-6 text-[#ffd400]" />
        </div>
        <div>
          <p className="text-sm font-bold text-slate-900">Enviar Comprovativo</p>
          <p className="text-xs text-slate-400">PDF, JPG ou PNG do seu banco</p>
        </div>
      </button>

      <div className="flex items-center gap-3">
        <div className="flex-1 h-px bg-slate-200" />
        <span className="text-xs text-slate-400 font-medium">ou</span>
        <div className="flex-1 h-px bg-slate-200" />
      </div>

      <button
        type="button"
        onClick={handleManualButtonClick}
        className="flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-xl p-3 text-left hover:bg-slate-100 transition-colors"
      >
        <EditIcon className="w-5 h-5 text-slate-500" />
        <div>
          <p className="text-sm font-bold text-slate-900">Lançamento Manual</p>
          <p className="text-xs text-slate-400">Registar manualmente</p>
        </div>
      </button>

      <input
        type="file"
        ref={fileInputRef}
        accept="application/pdf,image/jpeg,image/png"
        onChange={(e) => handleFileChange(e, "document")}
        style={{ display: "none" }}
      />
    </div>
  );
};

export default UploadOptions;
