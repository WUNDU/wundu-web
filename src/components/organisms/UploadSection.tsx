import React from 'react';
import { UploadProps } from '@/src/types/button';
import { PlusFileIcon } from '@/src/constants/icons';

const UploadSection: React.FC<UploadProps> = ({ onUploadClick }) => {
  return (
    <div className='text-center p-4 m-4 bg-white rounded-2xl  shadow-xl' onClick={onUploadClick}>
      <div className="p-4 border-2 border-dashed border-gray-400 rounded-xl ">
        <div className='m-4'>
          <PlusFileIcon className="mx-auto mb-2 text-gray-600" />
          <p className="md:flex text-sm text-gray-500">Comprovativos, imagens e documentos financeiros</p>
        </div>
      </div>
    </div>
  );
};

export default UploadSection;