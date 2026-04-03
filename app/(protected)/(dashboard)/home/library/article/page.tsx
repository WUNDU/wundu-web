"use client";

import React, { useState } from "react";
import { investmentTypes } from "@/constants/mock-data";
import { DocumentIcon, DownloadIcon } from "@/constants/icons";
import { Button } from "@/components/ui";
import { InvestmentType, InvestmentContentProps } from "@/types/ui";
import { useRouter } from "next/navigation";

const NavigationBack: React.FC<{ prev?: () => void; color?: string }> = ({ prev, color }) => {
  const router = useRouter();
  return (
    <button
      onClick={prev ?? (() => router.back())}
      className={`p-2 -ml-2 ${color ?? "text-gray-700"} hover:bg-gray-100 rounded-full transition-colors`}
      aria-label="Voltar"
    >
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
      </svg>
    </button>
  );
};

const InvestmentTypeCard = ({ investmentType }: { investmentType: InvestmentType }) => (
  <div className="mb-6">
    <div className="flex items-center mb-2">
      <span className="font-semibold text-gray-900 mr-2">{investmentType.name}</span>
      <span className={`text-xs px-2 py-1 rounded-full ${investmentType.riskLevel}`}></span>
    </div>
    <p className="text-gray-600 text-sm mb-3">{investmentType.description}</p>
    <ul className="space-y-1">
      {investmentType.examples.map((example, index) => (
        <li key={index} className="text-sm text-gray-700 flex items-start">
          <span className="text-gray-400 mr-2">•</span>
          {example}
        </li>
      ))}
    </ul>
  </div>
);

const InvestmentContent: React.FC<InvestmentContentProps & { imageUrl?: string }> = ({ types, imageUrl }) => {
  const [isLoading, setIsLoading] = React.useState(false);

  const handleLoadMore = () => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 2000);
  };

  return (
    <div className="bg-white md:bg-gray-50 rounded-2xl -mt-6 relative p-6">
      <div className="mb-6">
        <div className="flex items-center mb-4">
          <span className="text-2xl mr-2">🚀</span>
          <h2 className="text-lg font-bold text-gray-900">O que é investimento?</h2>
          <div className="flex flex-col flex-1 items-end justify-end md:items-end-safe md:justify-end-safe">
            <div className="rounded-full p-2 border-2 border-gray-300 hover:border-gray-100 transition-colors md:fixed md:bottom-1 md:right-15 md:p-3 md:bg-gray-200 md:hover:bg-gray-400 md:rounded-full md:text-white md:transition-colors md:shadow-lg md:z-20 lg:block">
              <DownloadIcon className="h-5 w-5 text-gray-600" />
            </div>
          </div>
        </div>
        <p className="text-gray-600 text-sm leading-relaxed">
          Investir é colocar o teu dinheiro a trabalhar por ti, com o objetivo de multiplicá-lo ao longo do tempo.
          Em vez de deixá-lo parado (como debaixo do colchão ou numa conta sem juros), tu aplicas em algo que pode gerar retorno.
        </p>
      </div>
      {imageUrl && (
        <div className="mb-6">
          <img src={imageUrl} alt="Investment illustration" className="w-full h-48 object-cover rounded-tr-3xl rounded-bl-3xl" />
        </div>
      )}
      <div className="mb-6">
        <div className="flex items-center mb-4">
          <span className="text-2xl mr-2">🧠</span>
          <h2 className="text-lg font-bold text-gray-900">Tipos de investimento</h2>
        </div>
        <div className="space-y-4">
          {types.map((type) => (
            <InvestmentTypeCard key={type.id} investmentType={type} />
          ))}
        </div>
      </div>
      <div className="flex justify-center">
        <Button variant="more" label="Ler mais" onClick={handleLoadMore} loading={isLoading} color="bg-gray-100 hover:bg-gray-200" />
      </div>
    </div>
  );
};

const ArticleDetailScreen: React.FC = () => {
  const [showModal, setShowModal] = useState(false);

  const handleConfirmDownload = () => setShowModal(false);

  return (
    <>
      <div className="flex flex-col p-2 min-h-screen bg-gray-200 rounded-2xl md:hidden">
        <div className="flex-1 pb-6">
          <div className="relative rounded-t-2xl h-48 bg-gradient-to-br overflow-hidden">
            <img
              src="https://cdn.pixabay.com/photo/2016/11/27/21/42/stock-1863880_1280.jpg"
              alt="Article background"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t" />
            <div className="relative flex items-start justify-between p-4 pt-12">
              <NavigationBack color="text-white" />
            </div>
          </div>
          <InvestmentContent types={investmentTypes} />
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6">
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                  <DocumentIcon className="h-8 w-8 text-green-600" />
                </div>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Deseja voltar a sua leitura ?
              </h3>
              <p className="text-gray-600 text-sm mb-6">
                Retome sua leitura sobre investimentos e continue a construir seu futuro.
              </p>
              <div className="flex flex-row items-center justify-center gap-3">
                <Button
                  label="Sim"
                  variant="destructive"
                  onClick={() => {
                    handleConfirmDownload();
                    setShowModal(false);
                  }}
                />
                <Button label="Não" variant="destructive" onClick={() => setShowModal(false)} />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ArticleDetailScreen;
