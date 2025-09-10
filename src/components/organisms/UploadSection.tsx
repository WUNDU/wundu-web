import React from 'react';
import PlusFile from '../icons/PlusFile';

const UploadSection = () => {
  return (
    <div className="border-2 border-dashed border-gray-400 rounded-xl p-6 text-center bg-white">
      <PlusFile className="mx-auto mb-2 text-gray-600" />
      <p className="text-sm text-gray-500">Comprovativos, imagens e documentos financeiros</p>
    </div>
  );
};

export default UploadSection;