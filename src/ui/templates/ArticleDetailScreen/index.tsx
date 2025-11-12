"use client";

import React from "react";
import { investmentTypes } from "@/constants/mockData";
import { ArticleHeader } from "@/ui/organisms";
import { InvestmentContent } from "@/ui/organisms";
import Modal from "@/ui/organisms/LibraryModal";
import { BottomNavigation } from "@/ui/organisms";
import { useArticleDetailScreen } from "@/hooks/article/useArticleDetailScreen";

const ArticleDetailScreen: React.FC = () => {
  const { showModal, setShowModal, handleBack, handleDownload, handleConfirmDownload } =
    useArticleDetailScreen();

  return (
    <>
      <div className="flex flex-col p-2 min-h-screen bg-gray-200 rounded-2xl md:hidden">
        {/* Conteúdo principal com padding bottom para o nav */}
        <div className="flex-1 pb-20">
          {" "}
          {/* Adicionado pb-20 aqui */}
          <ArticleHeader
            onBack={handleBack}
            onDownload={handleDownload}
            backgroundImage="https://cdn.pixabay.com/photo/2016/11/27/21/42/stock-1863880_1280.jpg"
          />
          <InvestmentContent types={investmentTypes} />
        </div>
      </div>

      {/* BottomNavigation fora do container principal para garantir visibilidade */}
      <BottomNavigation />

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Deseja voltar a sua leitura ?"
        message="Retome sua leitura sobre investimentos e continue a construir seu futuro."
        confirmText="Sim"
        cancelText="Não"
        onConfirm={handleConfirmDownload}
      />
    </>
  );
};

export default ArticleDetailScreen;
