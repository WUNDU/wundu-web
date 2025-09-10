import React from 'react';
import PlusFile from '../icons/PlusFile';
import { UploadProps } from '@/src/types/button';

const UploadSection: React.FC<UploadProps> = ({ onUploadClick }) => {
  return (
    <div className='text-center bg-white rounded-3xl' onClick={onUploadClick}>
      <div className="m-4 p-8 border-2 border-dashed border-gray-400 rounded-xl ">
        <PlusFile className="mx-auto mb-2 text-gray-600" />
        <p className="text-sm text-gray-500">Comprovativos, imagens e documentos financeiros</p>
      </div>
    </div>
  );
};

export default UploadSection;