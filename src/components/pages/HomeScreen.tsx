import React from 'react';
import GreetingHeader from '../molecules/GreetingHeader';
import UploadSection from '../organisms/UploadSection';
import BottomNavigation from '../organisms/BottomNavigation';
import SentDocumentsSection from '../organisms/SendDocumentSection';

const HomeScreen = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-100 relative h-full">
      <GreetingHeader />
      <main className="p-4 pb-20 flex flex-col space-y-4 flex-1">
        <UploadSection />
        <SentDocumentsSection />
      </main>
      <BottomNavigation />
    </div>
  );
};

export default HomeScreen;