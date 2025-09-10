'use client'
import React, { useState } from 'react';
import GreetingHeader from '../molecules/GreetingHeader';
import UploadSection from '../organisms/UploadSection';
import BottomNavigation from '../organisms/BottomNavigation';
import SentDocumentsSection from '../organisms/SendDocumentSection';
import { Document } from '@/src/types/button';
import LoadingSpinner from '../atoms/LoadingSpinner';

const HomeScreen = () => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [showUploadOptions, setShowUploadOptions] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false)

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
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100 relative h-full font-sans">
      <GreetingHeader />
      <main className="p-4 pb-20 flex flex-col space-y-4 flex-1">
        {isLoading ? (
          <div className="flex flex-1 items-center justify-center">
            <LoadingSpinner />
          </div>
        ) : (
          <>
            <UploadSection onUploadClick={toggleUploadOptions} />
            <SentDocumentsSection documents={documents} showOptions={showUploadOptions} onFileSelect={handleFileSelect} />
          </>
        )}
      </main>
      <BottomNavigation />
    </div>
  );
};

export default HomeScreen
