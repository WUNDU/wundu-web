'use client'
import React, { useState } from 'react';
import GreetingHeader from '../molecules/GreetingHeader';
import UploadSection from '../organisms/UploadSection';
import BottomNavigation from '../organisms/BottomNavigation';
import SentDocumentsSection from '../organisms/SendDocumentSection';
import { Document } from '@/src/types/button';

const HomeScreen = () => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [showUploadOptions, setShowUploadOptions] = useState<boolean>(false);

  const toggleUploadOptions = () => {
    setShowUploadOptions(true);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100 relative h-full font-sans">
      <GreetingHeader />
      <main className="p-4 pb-20 flex flex-col space-y-4 flex-1">
        <UploadSection onUploadClick={toggleUploadOptions} />
        <SentDocumentsSection documents={documents} showOptions={showUploadOptions} />
      </main>
      <BottomNavigation />
    </div>
  );
};

export default HomeScreen
