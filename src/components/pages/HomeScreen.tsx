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
import UploadOptions from '../molecules/UploadOption';
import { ArrowLeft } from 'lucide-react';
import ArrowsLeft from '../icons/ArrowsLeft';

const HomeScreen = () => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [showUploadOptions, setShowUploadOptions] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [showModal, setShowModal] = useState<boolean>(false)

  const toggleUploadOptions = () => {
    setShowUploadOptions(!showUploadOptions);
  };

  const handleFileSelect = async (file: File, type: 'image' | 'document') => {
    setIsLoading(true); // Inicia o loading

    try {
      await new Promise(resolve => setTimeout(resolve, 2000)); // Espera 2 segundos

      setDocuments(prevDocs => [...prevDocs, { name: file.name, type }]);

    } catch (error) {
      console.error('Erro ao fazer upload do arquivo:', error);
    } finally {
      setIsLoading(false); // Finaliza o loading
      setShowUploadOptions(false);
      setShowModal(true)
    }
  };

  const handleCloseModal = () => {
    setShowModal(false)
  }

  return (
    <div className="flex min-h-screen bg-gray-100 relative h-full font-sans">
      <Sidebar />
      <div className='flex-1 flex flex-col'>
        <GreetingHeader />
        <div className="hidden md:absolute md:flex my-12 transform -translate-x-1/2 -translate-y-1/2 z-10">
          <ArrowsLeft className="w-8 h-8 bg-blue-900 ml-2 p-2 rounded-full border border-blue-950" />
        </div>
        {/* <main className="p-4 pb-20 flex flex-col flex-1">
          {isLoading ? (
            <div className="flex flex-1 items-center justify-center">
              <LoadingSpinner />
            </div>
          ) : (
            <>
              <div className='md:grid md:grid-cols-3 md: md:gap-2 flex items-center justify-between'>
                <div><UploadSection onUploadClick={toggleUploadOptions} /></div>
                <div className='hidden md:flex md:col-span-2'><StatsSection totalFiles={0} totalProofs={0} totalImages={0} /></div>
              </div> */}
        {/* <div className='md:grid md:grid-cols-3 md:grid-rows-1 md:gap-2 md:items-center md:justify-between'> */}
        {/* <div> */}
        {/* <div className="hidden bg-white rounded-xl p-5 shadow-sm md:flex flex-col justify-center flex-1">
                  <UploadOptions onFileSelect={() => { }} />
                </div> */}
        {/* </div> */}
        {/* <div className='md:flex md:col-span-2'> */}

        {/* </div> */}
        {/* </div> */}
        {/* <div className='flex flex-col flex-1'>
                <SentDocumentsSection documents={documents} showOptions={showUploadOptions} onFileSelect={handleFileSelect} />
              </div>
            </>


          )}
        </main> */}
        <main className="px-4 flex flex-col flex-1">
          {isLoading ? (
            <div className="flex flex-1 items-center justify-center">
              <LoadingSpinner />
            </div>
          ) : (
            <>
              <div className='md:grid md:grid-cols-3 md:gap-2 flex items-center justify-between mb-4'>
                <div className='flex flex-col flex-1'><UploadSection onUploadClick={toggleUploadOptions} /></div>
                <div className='hidden md:flex md:col-span-2'><StatsSection totalFiles={0} totalProofs={0} totalImages={0} /></div>
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
    </div>
  );
};

export default HomeScreen
