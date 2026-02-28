import React, { useState } from "react";
import UploadOptions from "@/shared/components/upload-option";
import { SentDocumentsSectionProps } from "@/shared/types/button";
import { NoMovementIcon } from "@/constants/icons";

type Item = {
  id: number;
  name: string;
  type: "doc" | "img" | "text";
};

const SentDocumentsSection: React.FC<SentDocumentsSectionProps> = ({
  documents,
  showOptions,
  onFileSelect,
  onManualClick,
}) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [items, setItems] = useState<Item[]>([
    { id: 1, name: "Manual", type: "text" },
    { id: 1, name: "Comprovativo-12", type: "doc" },
    { id: 2, name: "Imagem", type: "img" },
    { id: 3, name: "Extrato", type: "doc" },
  ]);

  const handleLoadMore = () => {
    setIsLoading(true);
    setTimeout(() => {
      const newItems: Item[] = [
        {
          id: items.length + 1,
          name: `Item Extra ${items.length + 1}`,
          type: "doc",
        },
        {
          id: items.length + 2,
          name: `Item Extra ${items.length + 2}`,
          type: "img",
        },
      ];
      setItems([...items, ...newItems]);
      setIsLoading(false);
    }, 1500);
  };

  if (showOptions) {
    return (
      <section className="flex flex-col flex-1 mb-2 items-center">
        <div className="flex justify-center mb-6 md:hidden">
          <h2 className="text-sm font-bold uppercase text-gray-900">
            Adicionar Transação
          </h2>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-sm flex flex-col justify-center flex-1 w-full max-w-md">
          <UploadOptions
            onFileSelect={onFileSelect}
            onManualClick={onManualClick}
          />
        </div>
      </section>
    );
  }

  if (documents.length === 0) {
    return (
      <section className="flex flex-col flex-1 mb-2">
        <div className="flex justify-center items-center mb-1 border-b-2 py-2 border-gray-200">
          <h2 className="text-sm font-bold uppercase text-gray-900">
            Adicionar Transação
          </h2>
        </div>
        <div className="bg-white rounded-xl my-4 mb-20 md:my-2 p-8 text-center justify-center shadow-sm flex flex-col items-center flex-1">
          <NoMovementIcon className="mx-auto mb-2 text-gray-600" />
          <p className="text-lg font-semibold text-gray-900">
            Nenhum movimento registrado.
          </p>
          <p className="text-sm text-gray-500">
            Toque no botão acima para começar.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="flex flex-col flex-1 mb-2">
      <div className="flex justify-center items-center mb-8">
        <h2 className="text-sm font-bold uppercase text-gray-900">
          Adicionar Transação
        </h2>
      </div>
      <div className="bg-white rounded-xl shadow-sm flex flex-col flex-1 justify-center">
        <UploadOptions
          onFileSelect={onFileSelect}
          onManualClick={onManualClick}
        />
      </div>
    </section>
  );
};

export default SentDocumentsSection;
