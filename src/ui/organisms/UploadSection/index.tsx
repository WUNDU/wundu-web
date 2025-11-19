import React from "react";
import { UploadProps } from "@/types/button";
import { PlusFileIcon } from "@/constants/icons";

const UploadSection: React.FC<UploadProps> = ({ onUploadClick }) => {
  return (
    <div
      className="flex flex-col justify-center text-center p-4 m-2 sm:m-4 bg-white rounded-2xl shadow-xl w-full max-w-md mx-auto cursor-pointer transition-transform hover:-translate-y-0.5"
      onClick={onUploadClick}
      role="button"
      tabIndex={0}
    >
      <div className="p-4 border-2 border-dashed border-gray-400 rounded-xl h-full flex flex-col justify-center">
        <PlusFileIcon className="mx-auto mb-2 text-gray-600" />
        <p className="text-center text-sm text-gray-500 px-2">
          Comprovativos, imagens e documentos financeiros
        </p>
      </div>
    </div>
  );
};

export default UploadSection;
