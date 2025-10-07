'use client'

import { InvestmentType } from '@/src/types/article';
import React, { useState } from 'react';
import ArticleHeader from '../organisms/ArticleHeader';
import InvestmentContent from '../organisms/InvestmentContent';
import Modal from '../organisms/LibraryModal';
import BottomNavigation from '../organisms/BottomNavigation';
import { investmentTypes } from '@/src/constants/mockData';

const ArticleDetailScreen: React.FC = () => {
  const [showModal, setShowModal] = useState(false);


  const handleBack = () => {
    window.history.back();
  };

  const handleDownload = () => {
    setShowModal(true);
  };

  const handleConfirmDownload = () => {
    console.log('Download confirmed');
    setShowModal(false);
  };

  return (
    <>
      <div className="flex flex-col p-2 min-h-screen bg-gray-200 rounded-2xl md:hidden">
        {/* Conteúdo principal com padding bottom para o nav */}
        <div className="flex-1 pb-20"> {/* Adicionado pb-20 aqui */}
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