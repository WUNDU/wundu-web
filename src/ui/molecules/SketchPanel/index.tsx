import { DocumentIcon, NoMovementIcon } from "@/constants/icons";
import { Button } from "@/ui/atoms";
import React from "react";

interface SketchPanelProps {
  hasDraft?: boolean;
  onContinueDraft?: () => void;
  onDiscardDraft?: () => void;
}

const SketchPanel: React.FC<SketchPanelProps> = ({
  hasDraft,
  onContinueDraft,
  onDiscardDraft,
}) => {
  const IconComponent = hasDraft ? DocumentIcon : NoMovementIcon;

  return (
    <div className="flex h-full w-full items-center justify-center rounded-3xl border border-gray-100 bg-white p-6 shadow-lg">
      <div className="w-full text-center space-y-4">
        <div
          className={`mx-auto flex h-16 w-16 items-center justify-center rounded-full text-gray-500 transition-colors ${
            hasDraft ? "bg-yellow-100 text-yellow-500" : "bg-gray-50"
          }`}
        >
          <IconComponent className="h-8 w-8" />
        </div>
        {hasDraft ? (
          <div className="space-y-4">
            <div>
              <h3 className="text-base font-semibold text-gray-800">
                Você tem um rascunho salvo.
              </h3>
              <p className="text-sm text-gray-500">
                Continue de onde parou ou descarte para começar novamente.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
              <Button variant="warning" onClick={onContinueDraft}>
                Continuar rascunho
              </Button>
              <Button variant="secondary" onClick={onDiscardDraft}>
                Descartar
              </Button>
            </div>
          </div>
        ) : (
          <div>
            <h3 className="text-base font-semibold text-gray-700">Sem rascunhos.</h3>
            <p className="text-sm text-gray-500">
              Todos os seus rascunhos irão aparecer aqui.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SketchPanel;
