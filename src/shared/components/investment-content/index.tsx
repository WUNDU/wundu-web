import React from "react";
import { InvestmentTypeCard } from "@/shared/components";
import { InvestmentContentProps } from "@/shared/types/article";
import { DownloadIcon } from "@/constants/icons";
import { Button } from "@/shared/components";

const InvestmentContent: React.FC<
  InvestmentContentProps & { imageUrl?: string }
> = ({ types, imageUrl }) => {
  const [isLoading, setIsLoading] = React.useState(false);

  const handleLoadMore = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  };

  return (
    <div className="bg-white md:bg-gray-50 rounded-2xl -mt-6 relative p-6">
      {/* Investment definition section */}
      <div className="mb-6">
        <div className="flex items-center mb-4">
          <span className="text-2xl mr-2">🚀</span>
          <h2 className="text-lg font-bold text-gray-900">
            O que é investimento?
          </h2>
          <div className="flex flex-col flex-1 items-end justify-end md:items-end-safe md:justify-end-safe">
            <div className="rounded-full  p-2 border-2 border-gray-300 hover:border-gray-100 transition-colors md:fixed md:bottom-1 md:right-15 md:p-3 md:bg-gray-200 md:hover:bg-gray-400 md:rounded-full md:text-white md:transition-colors md:shadow-lg md:z-20 lg:block">
              <DownloadIcon className="h-5 w-5 text-gray-600" />
            </div>
          </div>
        </div>

        <p className="text-gray-600 text-sm leading-relaxed">
          Investir é colocar o teu dinheiro a trabalhar por ti, com o objetivo
          de multiplicá-lo ao longo do tempo. Em vez de deixá-lo parado (como
          debaixo do colchão ou numa conta sem juros), tu aplicas em algo que
          pode gerar retorno.
        </p>
      </div>

      {/* Imagem no meio com bordas arredondadas específicas */}
      {imageUrl && (
        <div className="mb-6">
          <img
            src={imageUrl}
            alt="Investment illustration"
            className="w-full h-48 object-cover rounded-tr-3xl rounded-bl-3xl"
          />
        </div>
      )}

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
        <Button
          variant="more"
          label="Ler mais"
          onClick={handleLoadMore}
          loading={isLoading}
          color="bg-gray-100 hover:bg-gray-200"
        />
      </div>
    </div>
  );
};

export default InvestmentContent;
