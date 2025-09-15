'use client'
import NavigationBack from "../atoms/NavigationBack";
import FinancialProgressCard from "../molecules/FinancialProgressCard";
import GreetingHeader from "../molecules/GreetingHeader";

const FinancialProgressScreen: React.FC = () => {
  const objectives = [
    { id: 1, title: 'Comprar carro', valorAlvo: '1.000.000,00kz', valorPoupado: '600.000,00kz', percentage: 60 },
    { id: 2, title: 'Comprar roupa', valorAlvo: '2.000.000,00kz', valorPoupado: '800.000,00kz', percentage: 40 },
    { id: 3, title: 'Comprar casa', valorAlvo: '5.000.000,00kz', valorPoupado: '5.000.000,00kz', percentage: 100 },
    { id: 4, title: 'Viagem', valorAlvo: '1.500.000,00kz', valorPoupado: '1.500.000,00kz', percentage: 100 },
    { id: 5, title: 'Comprar eletrônicos', valorAlvo: '900.000,00kz', valorPoupado: '300.000,00kz', percentage: 33 },
  ];

  return (
    <div className="bg-gray-100 min-h-screen font-sans antialiased text-gray-800 flex flex-col">
      <GreetingHeader onToggleSidebar={function (): void {
        throw new Error("Function not implemented.");
      }} />
      <main className="p-4 space-y-6 flex-1 flex flex-col">
        <NavigationBack />
        <div className="flex flex-col flex-1 bg-white rounded-2xl p-5 space-y-10">
          <h2 className="text-lg font-semibold text-gray-800">Meus objectivos financeiros</h2>
          <div className="space-y-4">

            {objectives.map((obj) => (
              <div key={obj.id} className="rounded-xl shadow-sm cursor-pointer transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] hover:shadow-md">
                <FinancialProgressCard
                  key={obj.id}
                  title={obj.title}
                  valorAlvo={obj.valorAlvo}
                  valorPoupado={obj.valorPoupado}
                  percentage={obj.percentage}
                />
              </div>
            ))}

          </div>
        </div>
      </main>
    </div>
  );
};

export default FinancialProgressScreen;