import { NoMovementIcon } from "@/constants/icons";
import React from "react";

const SketchPanel: React.FC = () => {
  return (
    <div className="flex h-full w-full items-center justify-center rounded-3xl border border-gray-100 bg-white p-6 shadow-lg">
      <div className="w-full text-center space-y-4">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gray-50 text-gray-500">
          <NoMovementIcon className="h-8 w-8" />
        </div>
        <div>
          <h3 className="text-base font-semibold text-gray-700">Sem rascunhos.</h3>
          <p className="text-sm text-gray-500">
            Todos os seus rascunhos irão aparecer aqui.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SketchPanel;
