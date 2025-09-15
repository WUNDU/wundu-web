'use client';
import { HistoryIcon, IAIcon, PlusIcon } from '@/src/constants/icons';
import NavigationBack from '../atoms/NavigationBack';
import FinancialObjectiveCard from '../molecules/FinancialObjectiveCard';
import GreetingHeader from '../molecules/GreetingHeader';
import Sidebar from '../molecules/Sidebar';
import SidebarRight from '../molecules/SideBarRight';
import { ArrowsLeftIcon } from '@/src/constants/icons';
import { useRouter } from 'next/navigation';
import { ROUTES } from '@/src/constants/routes';
import React, { useState } from 'react';
import FinancialProgressCard from '../molecules/FinancialProgressCard';

const FinancialObjectiveScreen: React.FC = () => {
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isSidebarRightOpen, setIsSidebarRightOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const toggleSidebarRight = () => {
    setIsSidebarRightOpen(!isSidebarRightOpen);
  };

  const handleFinancialNewObjective = () => {
    router.push(ROUTES.FINANCIAL_NEW_OBJECTIVE);
  };

  const handleFinancialObjective = () => {
    router.push(ROUTES.FINANCIAL_OBJECTIVE);
  };

  const handleFinancialIAObjective = () => {
    router.push(ROUTES.FINANCIAL_NEW_OBJECTIVE);
  };

  const objectives = [
    { id: 1, title: 'Comprar carro', valorAlvo: '1.000.000,00kz', valorPoupado: '600.000,00kz', percentage: 60 },
    { id: 2, title: 'Comprar roupa', valorAlvo: '2.000.000,00kz', valorPoupado: '800.000,00kz', percentage: 40 },
    { id: 3, title: 'Comprar casa', valorAlvo: '5.000.000,00kz', valorPoupado: '5.000.000,00kz', percentage: 100 },
    { id: 4, title: 'Viagem', valorAlvo: '1.500.000,00kz', valorPoupado: '1.500.000,00kz', percentage: 100 },
    { id: 5, title: 'Comprar eletrônicos', valorAlvo: '900.000,00kz', valorPoupado: '300.000,00kz', percentage: 33 },
    { id: 6, title: 'Comprar carro', valorAlvo: '1.000.000,00kz', valorPoupado: '600.000,00kz', percentage: 60 },
    { id: 7, title: 'Comprar roupa', valorAlvo: '2.000.000,00kz', valorPoupado: '800.000,00kz', percentage: 40 },
    { id: 8, title: 'Comprar casa', valorAlvo: '5.000.000,00kz', valorPoupado: '5.000.000,00kz', percentage: 100 },
    { id: 9, title: 'Viagem', valorAlvo: '1.500.000,00kz', valorPoupado: '1.500.000,00kz', percentage: 100 },
    { id: 10, title: 'Comprar eletrônicos', valorAlvo: '900.000,00kz', valorPoupado: '300.000,00kz', percentage: 33 },
  ];

  const fulfilledObjectives = objectives.filter(obj => obj.percentage === 100);
  const unfulfilledObjectives = objectives.filter(obj => obj.percentage < 100);

  return (
    <div className="flex h-screen bg-gray-100 relative overflow-hidden font-sans antialiased text-gray-800">
      {/* Sidebar positioned absolutely */}
      <div
        className={`absolute left-0 top-0 h-full z-30 transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
      >
        <Sidebar />
      </div>

      {/* Main content with conditional margin for sidebar */}
      <div
        className={`flex-1 flex flex-col transition-all duration-300 ${isSidebarOpen ? 'md:ml-64' : 'md:ml-0'
          }`}
      >
        <GreetingHeader onToggleSidebar={toggleSidebarRight} />

        {/* Sidebar toggle button */}
        <button
          onClick={toggleSidebar}
          className={`hidden md:flex fixed my-12 -translate-y-1/2 cursor-pointer z-40 transition-all duration-300 ${isSidebarOpen ? 'left-58' : 'left-0'
            }`}
        >
          <ArrowsLeftIcon
            className={`w-8 h-8 bg-blue-950 ml-2 p-2 rounded-full border border-blue-950 transform transition-transform duration-300 ${isSidebarOpen ? '' : 'rotate-180'
              }`}
          />
        </button>

        <main className="p-4 space-y-6 flex-1 flex flex-col">
          <div className="md:hidden">
            <NavigationBack />
          </div>

          <div className="flex flex-col flex-1 bg-white md:bg-gray-100 rounded-2xl p-5 space-y-10">
            <h2 className="text-lg font-semibold text-gray-800 md:hidden">Objectivos financeiros</h2>
            <div className="space-y-4 md:space-x-0 grid grid-cols-1 md:grid-cols-3 gap-4 md:bg-white md:p-2 md:px-5 rounded-2xl">
              <div
                className="rounded-xl shadow-sm md:shadow-none mt-4 cursor-pointer transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] hover:shadow-md"
                onClick={handleFinancialNewObjective}
              >
                <FinancialObjectiveCard
                  icon={PlusIcon}
                  title="Crie um objecto financeiro"
                  description="são metas especificas relacionadas ao dinheiro ."
                  borderColor="border-l-yellow-400"
                  bgColor="bg-yellow-100 md:bg-white"
                  iconBgColor="bg-white md:bg-yellow-100"
                  iconColor="text-yellow-300"
                />
              </div>
              <div
                className="rounded-xl shadow-sm md:shadow-none mt-4 cursor-pointer transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] hover:shadow-md"
                onClick={handleFinancialObjective}
              >
                <FinancialObjectiveCard
                  icon={HistoryIcon}
                  title="Meus objectivos"
                  description="Visualizar todos os meus objectivos já criados aqui."
                  borderColor="border-l-red-400"
                  bgColor="bg-red-100 md:bg-white"
                  iconBgColor="bg-white md:bg-red-100"
                  iconColor="text-red-600"
                />
              </div>
              <div
                className="hidden md:block rounded-xl shadow-sm md:shadow-none mt-4 cursor-pointer transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] hover:shadow-md"
                onClick={handleFinancialIAObjective}
              >
                <FinancialObjectiveCard
                  icon={IAIcon}
                  title="Meus objectivos"
                  description="Visualizar todos os meus objectivos já criados aqui."
                  borderColor="border-l-purple-400"
                  bgColor="bg-purple-100 md:bg-white"
                  iconBgColor="bg-white md:bg-purple-100"
                  iconColor="text-purple-600"
                />
              </div>
            </div>

            <div className="md:hidden mt-8">
              <h2 className="text-lg font-semibold text-gray-400">Gerar o objectivo financeiro com AI</h2>
              <div
                className="rounded-xl shadow-sm mt-4 cursor-pointer transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] hover:shadow-md"
                onClick={handleFinancialIAObjective}
              >
                <FinancialObjectiveCard
                  icon={IAIcon}
                  title="Meus objectivos"
                  description="Visualizar todos os meus objectivos já criados aqui."
                  borderColor="border-l-purple-400"
                  bgColor="bg-purple-100"
                  iconBgColor="bg-white"
                  iconColor="text-purple-600"
                />
              </div>
            </div>
            <div className="hidden md:grid grid-cols-1 md:grid-cols-3 gap-8 mt-8 md:mt-0 rounded-2xl bg-white p-6 h-[calc(100%-200px)]">
              {/* Meus objetivos financeiros */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800">Meus objectivos financeiros</h3>
                <div className='max-h-[calc(50%-2rem)] overflow-y-auto space-y-2 p-2'>
                  {unfulfilledObjectives.map((obj) => (
                    <div key={obj.id} className="cursor-pointer transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]">
                      <FinancialProgressCard
                        title={obj.title}
                        valorAlvo={obj.valorAlvo}
                        valorPoupado={obj.valorPoupado}
                        percentage={obj.percentage}
                        iconColor="text-indigo-600"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Objectivos cumpridos */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800">Objectivos cumpridos</h3>
                <div className='max-h-[calc(50%-2rem)] overflow-y-auto space-y-4 p-1'>
                  {fulfilledObjectives.map((obj) => (
                    <div key={obj.id} className="cursor-pointer transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]">
                      <FinancialProgressCard
                        title={obj.title}
                        valorAlvo={obj.valorAlvo}
                        valorPoupado={obj.valorPoupado}
                        percentage={obj.percentage}
                        iconColor="text-green-600"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Objectivos por cumprir */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800">Objectivos por cumprir</h3>
                <div className='max-h-[calc(50%-2rem)] overflow-y-auto space-y-4 p-1'>
                  {unfulfilledObjectives.map((obj) => (
                    <div key={obj.id} className="cursor-pointer transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]">
                      <FinancialProgressCard
                        title={obj.title}
                        valorAlvo={obj.valorAlvo}
                        valorPoupado={obj.valorPoupado}
                        percentage={obj.percentage}
                        iconColor="text-red-600"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Right Sidebar */}
      <SidebarRight isOpen={isSidebarRightOpen} onClose={toggleSidebarRight} />
    </div>
  );
};

export default FinancialObjectiveScreen;