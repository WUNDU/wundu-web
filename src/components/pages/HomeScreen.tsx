'use client';

import React, { useState } from 'react';
import GreetingHeader from '../molecules/GreetingHeader';
import UploadSection from '../organisms/UploadSection';
import BottomNavigation from '../organisms/BottomNavigation';
import SentDocumentsSection from '../organisms/SendDocumentSection';
import { Document } from '@/src/types/button';
import LoadingSpinner from '../atoms/LoadingSpinner';
import Sidebar from '../molecules/Sidebar';
import StatsSection from '../molecules/StatsSection';
import SidebarRight from '../molecules/SideBarRight';
import { ArrowsLeftIcon } from '@/src/constants/icons';
import { CategoryProvider, useCategoryContext } from '@/src/contexts/CategoryContext';
import CategoryScreen from './CategoryScreen';
import MovementSection from '../molecules/MovimentSection';
import DetailsModal from '../organisms/DetailsModal';

const HomeScreen = () => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [showUploadOptions, setShowUploadOptions] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);
  const [isSidebarRightOpen, setIsSidebarRightOpen] = useState<boolean>(false);

  const toggleUploadOptions = () => {
    setShowUploadOptions(!showUploadOptions);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const toggleSidebarRight = () => {
    setIsSidebarRightOpen(!isSidebarRightOpen);
  };

  const handleFileSelect = async (file: File, type: 'image' | 'document') => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      setDocuments(prevDocs => [...prevDocs, { name: file.name, type }]);
    } catch (error) {
      console.error('Erro ao fazer upload do arquivo:', error);
    } finally {
      setIsLoading(false);
      // Não setar showUploadOptions para false aqui, para manter o layout side-by-side
      setShowModal(true);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleCategoryCloseOrSuccess = () => {
    setShowUploadOptions(false); // Fechar o layout side-by-side ao fechar/salvar categoria
  };

  return (
    <div className="flex h-screen bg-gray-100 relative overflow-hidden font-sans antialiased text-gray-800">
      {/* Sidebar Esquerdo */}
      <div className={`absolute left-0 top-0 h-full z-30 transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <Sidebar />
      </div>

      {/* Conteúdo Principal */}
      <div className={`flex-1 flex flex-col transition-all duration-300 ${isSidebarOpen ? 'md:ml-64' : 'md:ml-0'} h-full`}>
        <GreetingHeader onToggleSidebar={toggleSidebarRight} />
        <button
          onClick={toggleSidebar}
          className={`hidden md:flex fixed my-12 -translate-y-1/2 cursor-pointer z-40 transition-all duration-300 ${isSidebarOpen ? 'left-58' : 'left-0'}`}
        >
          <ArrowsLeftIcon
            className={`w-8 h-8 bg-blue-950 ml-2 p-2 rounded-full border border-blue-950 transform transition-transform duration-300 ${isSidebarOpen ? '' : 'rotate-180'}`}
          />
        </button>

        <main className="flex-1 mb-0 px-4 flex flex-col h-full overflow-y-auto">
          {isLoading ? (
            <div className="flex flex-1 items-center justify-center h-full">
              <LoadingSpinner />
            </div>
          ) : (
            <>
              {/* Seção Superior */}
              <div className="md:grid md:grid-cols-3 md:gap-2 flex items-center justify-between m-0 h-auto">
                <div className="flex flex-col flex-1">
                  <UploadSection onUploadClick={toggleUploadOptions} />
                </div>
                <div className="hidden md:flex items-center justify-center md:col-span-2">
                  <StatsSection totalFiles={0} totalProofs={0} totalImages={0} />
                </div>
              </div>

              {/* Seção Principal */}
              <CategoryProvider onClose={handleCloseModal}>
                <MainContent
                  documents={documents}
                  showUploadOptions={showUploadOptions}
                  showModal={showModal}
                  handleCloseModal={handleCloseModal}
                  handleFileSelect={handleFileSelect}
                  onCategoryCloseOrSuccess={handleCategoryCloseOrSuccess}
                />
              </CategoryProvider>
            </>
          )}
        </main>
        <BottomNavigation />
      </div>

      {/* Sidebar Direito */}
      <SidebarRight isOpen={isSidebarRightOpen} onClose={toggleSidebarRight} />
    </div>
  );
};

// Componente auxiliar para o conteúdo principal
const MainContent = ({
  documents,
  showUploadOptions,
  showModal,
  handleCloseModal,
  handleFileSelect,
  onCategoryCloseOrSuccess,
}: {
  documents: Document[];
  showUploadOptions: boolean;
  showModal: boolean;
  handleCloseModal: () => void;
  handleFileSelect: (file: File, type: 'image' | 'document') => void;
  onCategoryCloseOrSuccess: () => void;
}) => {
  const { isCategoryModalOpen } = useCategoryContext();

  const rightContentDesktop = showModal ? (
    <DetailsModal onClose={handleCloseModal} />
  ) : isCategoryModalOpen ? (
    <CategoryScreen />
  ) : (
    <MovementSection documents={documents} />
  );

  return (
    <>
      <div className={`flex flex-col flex-1  ${showUploadOptions && 'md:grid md:grid-cols-4 md:gap-4 md:h-full'}`}>
        {!showUploadOptions ? (
          <div className='flex flex-col flex-1 h-full'>
            {/* Mobile: Sempre MovementSection ou modais como overlay */}
            <div className="md:hidden flex flex-1 flex-col">
              <MovementSection documents={documents} />
            </div>
            {/* Desktop: Substitui por modais se ativos, full width quando !showUploadOptions */}
            <div className="hidden md:block flex-col flex-1 h-full">
              {rightContentDesktop}
            </div>
          </div>
        ) : (
          <>
            {/* Mobile: SentDocumentsSection full */}
            <div className='flex flex-col flex-1 h-full md:hidden'>
              <SentDocumentsSection documents={[]} showOptions={true} onFileSelect={handleFileSelect} />
            </div>
            {/* Desktop: SentDocumentsSection sempre visível à esquerda */}
            <div className='md:flex items-start mt-2 h-full hidden'>
              <SentDocumentsSection documents={[]} showOptions={true} onFileSelect={handleFileSelect} />
            </div>
            {/* Desktop: Área direita (substituição da MovementSection) */}
            <div className='sm:flex flex-col flex-1 h-full hidden col-span-3 md:block'>
              {rightContentDesktop}
            </div>
          </>
        )}
      </div>

      {/* Mobile: Modais como overlay */}
      <div className="md:hidden">
        {showModal && <DetailsModal onClose={handleCloseModal} />}
        {isCategoryModalOpen && <CategoryScreen onCloseOrSuccess={onCategoryCloseOrSuccess} />}
      </div>
    </>
  );
};

export default HomeScreen;