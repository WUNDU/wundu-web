"use client";
import { HistoryIcon, IAIcon, PlusIcon } from "@/constants/icons";
import FinancialObjectiveCard from "@/shared/components/financial-objective-card";
import SidebarRight from "@/shared/components/side-bar-right";
import React from "react";
import FinancialProgressCard from "@/shared/components/financial-progress-card";
import SketchPanel from "@/shared/components/sketch-panel";
import EditModal from "@/shared/components/edit-modal";
import { useFinancialObjectiveScreen } from "@/hooks/objective/use-financial-objective-screen";
import { NotificationToast } from "@/modules/dashboard/components/notification-toast";
import { BottomNavigation, GreetingHeader, ObjectiveForm } from "@/shared/components";

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
    fulfilledObjectives,
    unfulfilledObjectives,
    goalsStatus,
    goalsError,
    refreshGoals,
    hasDraft,
    handleDraftContinue,
    handleDraftDiscard,
    handleModalClose,
    handleModalUpdated,
  } = useFinancialObjectiveScreen();

  const isLoadingGoals = goalsStatus === "loading";

  return (
    <div className="flex h-screen bg-linear-to-br from-slate-50 via-slate-100 to-slate-200 relative overflow-x-hidden overflow-y-auto font-sans antialiased text-gray-800 min-h-0">
      {/* Sidebar positioned absolutely */}

      {/* Main content with conditional margin for sidebar */}
      <div
        className={`flex-1 flex flex-col transition-all duration-500 ease-out ml-0 animate-fade-in ${
          isSidebarOpen ? "" : "md:ml-0"
        }`}
      >
        <GreetingHeader onToggleSidebar={toggleSidebarRight} />

        <main className="p-4 pb-28 md:pb-6 space-y-6 flex-1 min-h-0 animate-slide-up">
          <div className="flex flex-col flex-1 min-h-0 rounded-2xl p-5 space-y-10">
            <h2
              className="text-lg font-semibold text-gray-800 md:hidden animate-slide-up"
              style={{ animationDelay: "0.2s" }}
            >
              Objectivos financeiros
            </h2>
            <div
              className="space-y-4 md:space-y-0 md:space-x-0 grid grid-cols-1 md:grid-cols-2 gap-3 animate-slide-up"
              style={{ animationDelay: "0.3s" }}
            >
              <div
                className={`rounded-2xl bg-transparent p-0.5 md:p-2 cursor-pointer transition-all duration-300 ease-out hover:scale-[1.01] active:scale-[0.99] ${
                  showForm ? "ring-1 ring-yellow-200 bg-yellow-50/60" : ""
                }`}
                onClick={handleFinancialNewObjective}
              >
                <FinancialObjectiveCard
                  icon={PlusIcon}
                  title="Crie um objectivo financeiro"
                  description="São metas específicas relacionadas ao dinheiro."
                  borderColor="border-l-yellow-400"
                  bgColor="bg-yellow-50"
                  iconBgColor="bg-white"
                  iconColor="text-yellow-400"
                />
              </div>
              <div
                className={`rounded-2xl bg-transparent p-0.5 md:p-2 cursor-pointer transition-all duration-300 ease-out hover:scale-[1.01] active:scale-[0.99] ${
                  !showForm ? "ring-1 ring-rose-200 bg-rose-50/60" : ""
                }`}
                onClick={handleFinancialObjective}
              >
                <FinancialObjectiveCard
                  icon={HistoryIcon}
                  title="Meus objectivos"
                  description="Visualize todos os seus objectivos criados."
                  borderColor="border-l-rose-400"
                  bgColor="bg-rose-50"
                  iconBgColor="bg-white"
                  iconColor="text-rose-500"
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
            <div
              className="hidden md:flex mt-8 md:mt-0 rounded-2xl h-full min-h-130 p-2 pb-6 md:min-w-full animate-slide-up"
              style={{ animationDelay: "0.4s" }}
            >
              {showForm ? (
                <div className="flex flex-1 gap-6 min-h-0 w-full animate-fade-in">
                  <div className="flex flex-[1.5] min-h-0 w-full">
                    <ObjectiveForm onSuccess={refreshGoals} />
                  </div>
                  <div className="flex flex-1 min-h-0 w-full">
                    <SketchPanel
                      hasDraft={hasDraft}
                      onContinueDraft={handleDraftContinue}
                      onDiscardDraft={handleDraftDiscard}
                    />
                  </div>
                </div>
              ) : (
                <div className="flex flex-1 w-full min-h-0">
                  <div className="flex flex-1 flex-col rounded-3xl bg-white p-6 mb-5 pb-8 shadow-lg border border-gray-100 min-h-0 max-h-[calc(100vh-220px)] overflow-hidden">
                    <div className="flex-1 pr-2 min-h-0">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-800">
                            Objectivos
                          </h3>
                          {goalsError && (
                            <p className="text-sm text-red-500 mt-1">
                              {goalsError}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full min-h-0">
                        {/* Meus objetivos financeiros */}
                        <div
                          className="flex h-full flex-col gap-4 animate-slide-up min-h-0"
                          style={{ animationDelay: "0.5s" }}
                        >
                          <h3 className="text-lg font-semibold text-gray-800 transition-all duration-300 ease-out">
                            Meus objectivos financeiros
                          </h3>
                          <div className="flex-1 min-h-0 space-y-3 overflow-y-auto px-3 py-4">
                            {isLoadingGoals &&
                            unfulfilledObjectives.length === 0 ? (
                              <p className="text-sm text-gray-500">
                                Carregando objetivos...
                              </p>
                            ) : unfulfilledObjectives.length ? (
                              unfulfilledObjectives.map((obj, index) => (
                                <div
                                  key={obj.id}
                                  className="cursor-pointer transition-all duration-500 ease-out hover:scale-[1.02] active:scale-[0.98] hover:shadow-md hover:-translate-y-1"
                                  style={{
                                    animationDelay: `${0.6 + index * 0.1}s`,
                                  }}
                                >
                                  <div className="rounded-2xl p-3 transition-all duration-300 ease-out">
                                    <FinancialProgressCard
                                      title={obj.title}
                                      valorAlvo={obj.valorAlvo}
                                      valorPoupado={obj.valorPoupado}
                                      percentage={obj.percentage}
                                      iconColor="text-indigo-600"
                                      onEdit={() => handleEdit(obj.goal)}
                                    />
                                  </div>
                                </div>
                              ))
                            ) : (
                              <p className="text-sm text-gray-500">
                                Nenhum objetivo em andamento.
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Objectivos cumpridos */}
                        <div
                          className="flex h-full flex-col gap-4 animate-slide-up min-h-0"
                          style={{ animationDelay: "0.7s" }}
                        >
                          <h3 className="text-lg font-semibold text-gray-800 transition-all duration-300 ease-out">
                            Objectivos cumpridos
                          </h3>
                          <div className="flex-1 min-h-0 space-y-3 overflow-y-auto px-3 py-4">
                            {isLoadingGoals &&
                            fulfilledObjectives.length === 0 ? (
                              <p className="text-sm text-gray-500">
                                Carregando objetivos...
                              </p>
                            ) : fulfilledObjectives.length ? (
                              fulfilledObjectives.map((obj, index) => (
                                <div
                                  key={obj.id}
                                  className="cursor-pointer transition-all duration-500 ease-out hover:scale-[1.02] active:scale-[0.98] hover:shadow-md hover:-translate-y-1"
                                  style={{
                                    animationDelay: `${0.8 + index * 0.1}s`,
                                  }}
                                >
                                  <div className="rounded-2xl p-3 transition-all duration-300 ease-out">
                                    <FinancialProgressCard
                                      title={obj.title}
                                      valorAlvo={obj.valorAlvo}
                                      valorPoupado={obj.valorPoupado}
                                      percentage={obj.percentage}
                                      iconColor="text-green-600"
                                      onEdit={() => handleEdit(obj.goal)}
                                    />
                                  </div>
                                </div>
                              ))
                            ) : (
                              <p className="text-sm text-gray-500">
                                Nenhum objetivo cumprido.
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Objectivos por cumprir */}
                        <div
                          className="flex h-full flex-col gap-4 animate-slide-up min-h-0"
                          style={{ animationDelay: "0.9s" }}
                        >
                          <h3 className="text-lg font-semibold text-gray-800 transition-all duration-300 ease-out">
                            Objectivos por cumprir
                          </h3>
                          <div className="flex-1 min-h-0 space-y-3 overflow-y-auto px-3 py-4">
                            {isLoadingGoals &&
                            unfulfilledObjectives.length === 0 ? (
                              <p className="text-sm text-gray-500">
                                Carregando objetivos...
                              </p>
                            ) : unfulfilledObjectives.length ? (
                              unfulfilledObjectives.map((obj, index) => (
                                <div
                                  key={obj.id}
                                  className="cursor-pointer transition-all duration-500 ease-out hover:scale-[1.02] active:scale-[0.98] hover:shadow-md hover:-translate-y-1"
                                  style={{
                                    animationDelay: `${1.0 + index * 0.1}s`,
                                  }}
                                >
                                  <div className="rounded-2xl p-3 transition-all duration-300 ease-out">
                                    <FinancialProgressCard
                                      title={obj.title}
                                      valorAlvo={obj.valorAlvo}
                                      valorPoupado={obj.valorPoupado}
                                      percentage={obj.percentage}
                                      iconColor="text-red-600"
                                      onEdit={() => handleEdit(obj.goal)}
                                    />
                                  </div>
                                </div>
                              ))
                            ) : (
                              <p className="text-sm text-gray-500">
                                Nenhum objetivo pendente.
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
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
        onClose={handleModalClose}
        onUpdated={handleModalUpdated}
        objective={selectedObjective}
      />
      {/* Right Sidebar */}
      <SidebarRight isOpen={isSidebarRightOpen} onClose={toggleSidebarRight} />
      <NotificationToast />
      <div className="md:hidden">
        <BottomNavigation />
      </div>
    </div>
  );
};

export default FinancialObjectiveScreen;
