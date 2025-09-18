import React from 'react';
import { NoMovementIcon, SettingsIcon } from '@/src/constants/icons';
import { Document } from '@/src/types/button';

interface MovementSectionProps {
  documents: Document[];
}

const MovementSection: React.FC<MovementSectionProps> = ({ documents }) => {
  if (documents.length === 0) {
    return (
      <section className="flex flex-col flex-1 mb-2 h-full">
        <div className="bg-white rounded-xl my-4 mb-20 md:my-2 p-8 text-center justify-center shadow-sm flex flex-col items-center flex-1 h-full">
          <NoMovementIcon className="mx-auto mb-2 text-gray-600" />
          <p className="text-lg font-semibold text-gray-900">Nenhum movimento registrado.</p>
          <p className="text-sm text-gray-500">Toque no botão acima para começar.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="flex flex-col flex-1 mb-2 h-full">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-sm font-bold uppercase text-gray-900">Documentos Enviados</h2>
        <div className='border-2 rounded-full border-gray-300 bg-gray-300'>
          <SettingsIcon className="text-gray-600" />
        </div>
      </div>
      <div className="bg-white rounded-xl shadow-sm flex flex-col flex-1 h-full overflow-y-auto">
        {documents.map((doc, index) => (
          <div key={index} className="flex flex-1 items-center p-4 border-b border-gray-200 last:border-b-0">
            <div className="flex items-center space-x-4">
              {doc.type === 'image' ? <NoMovementIcon className="text-gray-600" /> : <NoMovementIcon className="text-gray-600" />}
              <p className="text-sm font-semibold text-gray-900">{doc.name}</p>
            </div>
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

export default MovementSection;