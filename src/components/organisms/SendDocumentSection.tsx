import React from 'react';
import NoMovement from '../icons/NoMovement';
import Settings from '../icons/Settings';


const SentDocumentsSection = () => {
  return (
    <section className="flex flex-col flex-1 mb-2">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-sm font-bold uppercase text-gray-900">Documentos Enviados</h2>
        <div className='border-2 rounded-full border-gray-300 bg-gray-300'>
          <Settings />
        </div>

      </div>
      <div className="bg-white rounded-xl p-8 text-center shadow-sm flex flex-col justify-center items-center flex-1">
        <NoMovement className="mx-auto mb-2 text-gray-600" />
        <p className="text-lg font-semibold text-gray-900">Nenhum movimento registrado.</p>
        <p className="text-sm text-gray-500">Toque no botão acima para começar.</p>
      </div>
    </section>
  );
};

export default SentDocumentsSection;