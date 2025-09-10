import React from 'react';
import PlusFile from '../icons/PlusFile';

const UploadSection = () => {
  return (
    <div className='text-center bg-white rounded-3xl'>
      <div className="m-4 p-2 border-2 border-dashed border-gray-400 rounded-xl ">
        <PlusFile className="mx-auto mb-2 text-gray-600" />
        <p className="text-sm text-gray-500">Comprovativos, imagens e documentos financeiros</p>
      </div>
    </div>
  );
};

export default UploadSection;