import React from 'react';
import InvestmentTypeCard from '../molecules/InvestmentTypeCard';
import MoreButton from '../atoms/MoreButton';
import { InvestmentContentProps } from '@/src/types/article';
import { DownloadIcon } from '@/src/constants/icons';

const InvestmentContent: React.FC<InvestmentContentProps> = ({ types }) => {
  const [isLoading, setIsLoading] = React.useState(false);

  const handleLoadMore = () => {
    setIsLoading(true);
    // Simulate loading more content
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  };

  return (
    <div className="bg-white rounded-2xl -mt-6 relative p-6"> {/* Removido z-10 */}
      {/* Investment definition section */}
      <div className="mb-6">
        <div className="flex items-center mb-4">
          <span className="text-2xl mr-2">🚀</span>
          <h2 className="text-lg font-bold text-gray-900">
            O que é investimento?
          </h2>
          <div className='flex flex-col flex-1 items-end justify-end'>
            <div className='rounded-full border p-2 border-gray-500 hover:border-gray-100 transition-colors'>
              <DownloadIcon className="h-5 w-5 text-gray-600" /> {/* Cor corrigida */}
            </div>
          </div>
        </div>

        <p className="text-gray-600 text-sm leading-relaxed">
          Investir é colocar o teu dinheiro a trabalhar por ti, com o objetivo de
          multiplicá-lo ao longo do tempo. Em vez de deixá-lo parado (como debaixo do
          colchão ou numa conta sem juros), tu aplicas em algo que pode gerar retorno.
        </p>
      </div>

      {/* Investment types section */}
      <div className="mb-6">
        <div className="flex items-center mb-4">
          <span className="text-2xl mr-2">🧠</span>
          <h2 className="text-lg font-bold text-gray-900">
            Tipos de investimento
          </h2>
        </div>

        <div className="space-y-4">
          {types.map((type) => (
            <InvestmentTypeCard key={type.id} investmentType={type} />
          ))}
        </div>
      </div>

      {/* Load more button */}
      <div className="flex justify-center">
        <MoreButton
          label='Ler mais'
          onClick={handleLoadMore}
          isLoading={isLoading}
          color="bg-gray-100 hover:bg-gray-200"
        />
      </div>
    </div>
  );
};

export default InvestmentContent;