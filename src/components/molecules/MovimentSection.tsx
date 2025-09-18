import React, { useState } from 'react';
import { NoMovementIcon, SettingsIcon } from '@/src/constants/icons';
import { Document } from '@/src/types/button';
import Button from '../atoms/Button';
import ArrowRotate from '../icons/ArrowRotate';
import MoreButton from '../atoms/MoreButton';

interface MovementSectionProps {
  documents: Document[];
}

type Item = {
  id: number;
  name: string;
  type: 'doc' | 'img';
};

const MovementSection: React.FC<MovementSectionProps> = ({ documents }) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [items, setItems] = useState<Item[]>([
    { id: 1, name: 'Comprovativo-12', type: 'doc' },
    { id: 2, name: 'Imagem', type: 'img' },
    { id: 3, name: 'Comprovativo', type: 'doc' },
    { id: 4, name: 'Imagem', type: 'img' },
  ]);

  const handleLoadMore = () => {
    setIsLoading(true);
    setTimeout(() => {
      const newItems: Item[] = [
        { id: items.length + 1, name: `Item Extra ${items.length + 1}`, type: 'doc' },
        { id: items.length + 2, name: `Item Extra ${items.length + 2}`, type: 'img' },
      ];
      setItems([...items, ...newItems]);
      setIsLoading(false);
    }, 1500);
  };

  if (documents.length === 0) {
    return (
      <section className="flex flex-col flex-1 mb-2 h-full">
        <div className="bg-white rounded-xl my-4 mb-20 md:my-2 p-8 text-center justify-center shadow-sm flex flex-col items-center flex-1 h-screen">
          <NoMovementIcon className="mx-auto mb-2 text-gray-600" />
          <p className="text-lg font-semibold text-gray-900">Nenhum movimento registrado.</p>
          <p className="text-sm text-gray-500">Toque no botão acima para começar.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="flex flex-col flex-1 mb-2 h-full">
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
      <div className="text-center">
        <div className="flex justify-center items-center p-4">
          <MoreButton onClick={handleLoadMore} isLoading={isLoading} />
        </div>
      </div>
    </section>
  );
};

export default MovementSection;