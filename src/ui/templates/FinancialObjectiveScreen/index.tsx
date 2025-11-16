"use client";
import { HistoryIcon, IAIcon, PlusIcon } from "@/constants/icons";
import { NavigationBack } from "@/ui/atoms";
import FinancialObjectiveCard from "@/ui/molecules/FinancialObjectiveCard";
import { GreetingHeader } from "@/ui/molecules";
import SidebarRight from "@/ui/molecules/SideBarRight";
import React from "react";
import FinancialProgressCard from "@/ui/molecules/FinancialProgressCard";
import { ObjectiveForm } from "@/ui/organisms";
import SketchPanel from "@/ui/molecules/SketchPanel";
import { objectives } from "@/constants/mockData";
import EditModal from "@/ui/molecules/EditModal";
import { useFinancialObjectiveScreen } from "@/hooks/objective/useFinancialObjectiveScreen";

const FinancialObjectiveScreen: React.FC = () => {
  const {
    isSidebarOpen,
    isSidebarRightOpen,
    toggleSidebarRight,
    showForm,
    isModalOpen,
    setIsModalOpen,
    selectedObjective,
    handleEdit,
    handleFinancialNewObjective,
    handleFinancialObjective,
  } = useFinancialObjectiveScreen();

  const fulfilledObjectives = objectives.filter(
    (obj) => obj.percentage === 100
  );
  const unfulfilledObjectives = objectives.filter(
    (obj) => obj.percentage < 100
  );

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-50 via-slate-100 to-slate-200 relative overflow-hidden font-sans antialiased text-gray-800 min-h-0">
      {/* Sidebar positioned absolutely */}

      {/* Main content with conditional margin for sidebar */}
      <div
        className={`flex-1 flex flex-col transition-all duration-500 ease-out ml-0 animate-fade-in ${
          isSidebarOpen ? "" : "md:ml-0"
        }`}
      >
        <GreetingHeader onToggleSidebar={toggleSidebarRight} />

        <main className="p-4 space-y-6 flex-1 overflow-y-auto min-h-0 animate-slide-up">
          <div className="md:hidden">
            <NavigationBack />
          </div>

          <div className="flex flex-col flex-1 bg-white/95 backdrop-blur-xl md:bg-transparent rounded-2xl p-5 space-y-10 shadow-lg border border-white/20 transition-all duration-500 ease-out hover:shadow-xl">
            <h2 className="text-lg font-semibold text-gray-800 md:hidden animate-slide-up" style={{animationDelay: '0.2s'}}>
              Objectivos financeiros
            </h2>
            <div className="space-y-4 md:space-y-0 md:space-x-0 grid grid-cols-1 md:grid-cols-2 gap-4 md:bg-white/95 md:backdrop-blur-xl md:p-2 md:px-5 rounded-2xl shadow-lg border border-white/20 transition-all duration-500 ease-out animate-slide-up" style={{animationDelay: '0.3s'}}>
              <div
                className={`rounded-xl shadow-sm md:shadow-none mt-4 cursor-pointer transition-all duration-500 ease-out hover:scale-[1.02] active:scale-[0.98] hover:shadow-lg hover:-translate-y-1`}
                onClick={handleFinancialNewObjective}
              >
                <FinancialObjectiveCard
                  icon={PlusIcon}
                  title="Crie um objecto financeiro"
                  description="são metas específicas relacionadas ao dinheiro."
                  borderColor="border-l-yellow-400"
                  bgColor={`bg-yellow-100 ${
                    showForm ? "md:bg-yellow-50 md:bg-blue-50" : "md:bg-white"
                  }`}
                  iconBgColor="bg-white md:bg-yellow-100"
                  iconColor="text-yellow-300"
                />
              </div>
              <div
                className={`rounded-xl shadow-sm md:shadow-none mt-4 cursor-pointer transition-all duration-500 ease-out hover:scale-[1.02] active:scale-[0.98] hover:shadow-lg hover:-translate-y-1`}
                onClick={handleFinancialObjective}
              >
                <FinancialObjectiveCard
                  icon={HistoryIcon}
                  title="Meus objectivos"
                  description="Visualizar todos os meus objectivos já criados aqui."
                  borderColor="border-l-red-400"
                  bgColor={`bg-red-100 ${
                    !showForm ? "md:bg-red-50 md:bg-blue-50" : "md:bg-white"
                  }`}
                  iconBgColor="bg-white md:bg-red-100"
                  iconColor="text-red-600"
                />
              </div>
              {/* <div
                className={`hidden md:block rounded-xl shadow-sm md:shadow-none mt-4 cursor-pointer transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] hover:shadow-md`}
                onClick={handleFinancialIAObjective}
              >
                <FinancialObjectiveCard
                  icon={IAIcon}
                  title="Gerar objetivo com AI"
                  description="Peça à AI que ajude você a criar os seus objetivos"
                  borderColor="border-l-purple-400"
                  bgColor="bg-purple-100 md:bg-white"
                  iconBgColor="bg-white md:bg-purple-100"
                  iconColor="text-purple-600"
                />
              </div> */}
            </div>

            {/* <div className="md:hidden mt-8">
              <h2 className="text-lg font-semibold text-gray-400">Gerar o objectivo financeiro com AI</h2>
              <div
                className="rounded-xl shadow-sm mt-4 cursor-pointer transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] hover:shadow-md"
                onClick={handleFinancialIAObjective}
              >
                <FinancialObjectiveCard
                  icon={IAIcon}
                  title="Gerar objetivo com AI"
                  description="Peça à AI que ajude você a criar os seus objetivos"
                  borderColor="border-l-purple-400"
                  bgColor="bg-purple-100"
                  iconBgColor="bg-white"
                  iconColor="text-purple-600"
                />
              </div>
            </div> */}
            <div className="hidden md:block mt-8 md:mt-0 rounded-2xl h-full bg-white/95 backdrop-blur-xl p-6 md:min-w-full shadow-lg border border-white/20 transition-all duration-500 ease-out hover:shadow-xl animate-slide-up" style={{animationDelay: '0.4s'}}>
              {showForm ? (
                <div className="flex gap-4 min-h-0 animate-fade-in">
                  <div className="w-2/3 h-full min-h-0">
                    <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-4 shadow-md border border-white/10 transition-all duration-500 ease-out hover:shadow-lg hover:-translate-y-1">
                      <ObjectiveForm />
                    </div>
                  </div>
                  <div className="w-1/3 h-full min-h-0">
                    <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-4 shadow-md border border-white/10 transition-all duration-500 ease-out hover:shadow-lg hover:-translate-y-1">
                      <SketchPanel />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-3 gap-4 flex-1 min-h-0">
                  {/* Meus objetivos financeiros */}
                  <div className="space-y-4 flex-1 animate-slide-up" style={{animationDelay: '0.5s'}}>
                    <h3 className="text-lg font-semibold text-gray-800 transition-all duration-300 ease-out">
                      Meus objectivos financeiros
                    </h3>
                    <div className="flex flex-col gap-3 flex-1">
                      {unfulfilledObjectives.map((obj, index) => (
                        <div
                          key={obj.id}
                          className="cursor-pointer transition-all duration-500 ease-out hover:scale-[1.02] active:scale-[0.98] hover:shadow-md hover:-translate-y-1"
                          style={{animationDelay: `${0.6 + index * 0.1}s`}}
                        >
                          <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-3 shadow-md border border-white/10 transition-all duration-300 ease-out hover:shadow-lg">
                            <FinancialProgressCard
                              title={obj.title}
                              valorAlvo={obj.valorAlvo}
                              valorPoupado={obj.valorPoupado}
                              percentage={obj.percentage}
                              iconColor="text-indigo-600"
                              onEdit={() => handleEdit(obj)}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Objectivos cumpridos */}
                  <div className="space-y-4 flex-1 animate-slide-up" style={{animationDelay: '0.7s'}}>
                    <h3 className="text-lg font-semibold text-gray-800 transition-all duration-300 ease-out">
                      Objectivos cumpridos
                    </h3>
                    <div className="flex flex-col gap-3 flex-1">
                      {fulfilledObjectives.map((obj, index) => (
                        <div
                          key={obj.id}
                          className="cursor-pointer transition-all duration-500 ease-out hover:scale-[1.02] active:scale-[0.98] hover:shadow-md hover:-translate-y-1"
                          style={{animationDelay: `${0.8 + index * 0.1}s`}}
                        >
                          <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-3 shadow-md border border-white/10 transition-all duration-300 ease-out hover:shadow-lg">
                            <FinancialProgressCard
                              title={obj.title}
                              valorAlvo={obj.valorAlvo}
                              valorPoupado={obj.valorPoupado}
                              percentage={obj.percentage}
                              iconColor="text-green-600"
                              onEdit={() => handleEdit(obj)}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Objectivos por cumprir */}
                  <div className="space-y-4 flex-1 animate-slide-up" style={{animationDelay: '0.9s'}}>
                    <h3 className="text-lg font-semibold text-gray-800 transition-all duration-300 ease-out">
                      Objectivos por cumprir
                    </h3>
                    <div className="flex flex-col gap-3 flex-1">
                      {unfulfilledObjectives.map((obj, index) => (
                        <div
                          key={obj.id}
                          className="cursor-pointer transition-all duration-500 ease-out hover:scale-[1.02] active:scale-[0.98] hover:shadow-md hover:-translate-y-1"
                          style={{animationDelay: `${1.0 + index * 0.1}s`}}
                        >
                          <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-3 shadow-md border border-white/10 transition-all duration-300 ease-out hover:shadow-lg">
                            <FinancialProgressCard
                              title={obj.title}
                              valorAlvo={obj.valorAlvo}
                              valorPoupado={obj.valorPoupado}
                              percentage={obj.percentage}
                              iconColor="text-red-600"
                              onEdit={() => handleEdit(obj)}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
      <EditModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        objective={selectedObjective}
      />
      {/* Right Sidebar */}
      <SidebarRight isOpen={isSidebarRightOpen} onClose={toggleSidebarRight} />
    </div>
  );
};

export default FinancialObjectiveScreen;
