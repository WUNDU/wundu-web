'use client'
import React, { useState } from 'react';
import GreetingHeader from '../molecules/GreetingHeader';
import UploadSection from '../organisms/UploadSection';
import BottomNavigation from '../organisms/BottomNavigation';
import SentDocumentsSection from '../organisms/SendDocumentSection';
import { Document } from '@/src/types/button';
import LoadingSpinner from '../atoms/LoadingSpinner';
import DetailsModal from '../organisms/DetailsModal';
import Sidebar from '../molecules/Sidebar';
import StatsSection from '../molecules/StatsSection';
import SidebarRight from '../molecules/SideBarRight';
import { ArrowsLeftIcon } from '@/src/constants/icons';

const HomeScreen = () => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [showUploadOptions, setShowUploadOptions] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [showModal, setShowModal] = useState<boolean>(false)
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isSidebarRightOpen, setIsSidebarRightOpen] = useState(false);

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
      setShowUploadOptions(false);
      setShowModal(true)
    }
  };

  const handleCloseModal = () => {
    setShowModal(false)
  }

  return (
    <div className="flex min-h-screen bg-gray-100 relative h-full font-sans">
      {/* Sidebar agora posicionado de forma absoluta, não ocupando espaço no layout principal */}
      <div className={`absolute left-0 top-0 h-full z-30 transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <Sidebar />
      </div>

      {/* Container principal agora com margem esquerda condicional para compensar o sidebar */}
      <div className={`flex-1 flex flex-col transition-all duration-300 ${isSidebarOpen ? 'md:ml-64' : 'md:ml-0'}`}>
        <GreetingHeader onToggleSidebar={toggleSidebarRight} />
        {/* O botão agora é posicionado de forma fixa e se move com o sidebar */}
        <button onClick={toggleSidebar} className={`hidden md:flex fixed my-12 -translate-y-1/2 cursor-pointer z-40 transition-all duration-300 ${isSidebarOpen ? 'left-58' : 'left-0'}`}>
          <ArrowsLeftIcon className={`w-8 h-8 bg-blue-950 ml-2 p-2 rounded-full border border-blue-950 transform transition-transform duration-300 ${isSidebarOpen ? '' : 'rotate-180'}`} />
        </button>
        <main className="px-4 flex flex-col flex-1">
          {isLoading ? (
            <div className="flex flex-1 items-center justify-center">
              <LoadingSpinner />
            </div>
          ) : (
            <>
              <div className='md:grid md:grid-cols-3 md:gap-2 flex items-center justify-between m-4'>
                <div className='flex flex-col flex-1'><UploadSection onUploadClick={toggleUploadOptions} /></div>
                <div className='hidden md:flex items-center justify-center md:col-span-2'><StatsSection totalFiles={0} totalProofs={0} totalImages={0} /></div>
              </div>
              <div className='flex flex-col flex-1'>
                <SentDocumentsSection documents={documents} showOptions={showUploadOptions} onFileSelect={handleFileSelect} />
              </div>
            </>
          )}
        </main>
        <BottomNavigation />

        {showModal && <DetailsModal onClose={handleCloseModal} />}
      </div>
      <SidebarRight
        isOpen={isSidebarRightOpen}
        onClose={toggleSidebarRight}
      />
    </div>
  );
};

export default HomeScreen;