import React from 'react';
import Image from '../icons/Image';
import { ChevronRight } from 'lucide-react';
import UploadOptions from '../molecules/UploadOption';
import { SentDocumentsSectionProps } from '@/src/types/button';
import { NoMovementIcon, SettingsIcon } from '@/src/constants/icons';


const SentDocumentsSection: React.FC<SentDocumentsSectionProps> = ({ documents, showOptions, onFileSelect }) => {
  if (showOptions) {
    return (
      <section className="flex flex-col flex-1 mb-2">
        <div className="flex justify-between items-center mb-8 border-b-2 py-2 border-gray-200">
          <h2 className="text-sm font-bold uppercase text-gray-900">Documentos Enviados</h2>
          <div className='border-2 rounded-full border-gray-300 bg-gray-300'>
            <SettingsIcon className="text-gray-600" />
          </div>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-sm flex flex-col justify-center flex-1">
          <UploadOptions onFileSelect={onFileSelect} />
        </div>
      </section>
    );
  }

  if (documents.length === 0) {
    return (
      <section className="flex flex-col flex-1 mb-2">
        <div className="flex justify-between items-center mb-1 border-b-2 py-2 border-gray-200">
          <h2 className="text-sm font-bold uppercase text-gray-900">Documentos Enviados</h2>
          <div className='border-2 rounded-full border-gray-300 bg-gray-300'>
            <SettingsIcon className="text-gray-600" />
          </div>
        </div>
        <div className="bg-white rounded-xl my-4 mb-20  md:my-2 p-8 text-center justify-center shadow-sm flex flex-col items-center flex-1">
          <NoMovementIcon className="mx-auto mb-2 text-gray-600" />
          <p className="text-lg font-semibold text-gray-900">Nenhum movimento registrado.</p>
          <p className="text-sm text-gray-500">Toque no botão acima para começar.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="flex flex-col flex-1 mb-2">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-sm font-bold uppercase text-gray-900">Documentos Enviados</h2>
        <div className='border-2 rounded-full border-gray-300 bg-gray-300'>
          <SettingsIcon className="text-gray-600" />
        </div>
      </div>
      <div className="bg-white rounded-xl shadow-sm flex flex-col flex-1">
        {documents.map((doc, index) => (
          <div key={index} className="flex flex-1 items-center p-4 border-b border-gray-200 last:border-b-0">
            <div className="flex items-center space-x-4">
              {doc.type === 'image' ? <Image className="text-gray-600" /> : <NoMovementIcon className="text-gray-600" />}
              <p className="text-sm font-semibold text-gray-900">{doc.name}</p>
            </div>
            <ChevronRight className="text-gray-400" size={20} />
          </div>
        ))}
      </div>
      <div className="text-center mt-4">
        <button className="text-sm text-gray-500 flex items-center justify-center space-x-1 mx-auto">
          <span>Ver mais</span>
          <span className="text-xs">↻</span>
        </button>
      </div>
    </section>
  );
};

export default SentDocumentsSection;