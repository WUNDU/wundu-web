"use client";
import { HistoryIcon, IAIcon, PlusIcon } from "@/src/constants/icons";
import NavigationBack from "../atoms/NavigationBack";
import FinancialObjectiveCard from "../molecules/FinancialObjectiveCard";
import GreetingHeader from "../molecules/GreetingHeader";
import Sidebar from "../molecules/Sidebar";
import SidebarRight from "../molecules/SideBarRight";
import { ArrowsLeftIcon } from "@/src/constants/icons";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/src/constants/routes";
import React, { useState } from "react";
import FinancialProgressCard from "../molecules/FinancialProgressCard";
import ObjectiveForm from "../organisms/ObjectiveForm"; // Ajuste o caminho conforme necessário
import SketchPanel from "../molecules/SketchPanel";
import { objectives } from "@/src/constants/mockData";
import EditModal from "../molecules/EditModal";

const FinancialObjectiveScreen: React.FC = () => {
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isSidebarRightOpen, setIsSidebarRightOpen] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedObjective, setSelectedObjective] = useState<any>(null);

  const handleEdit = (obj: any) => {
    setSelectedObjective({
      ...obj,
      categoria: "Viagem",
      prioridade: "Alta",
      dataLimite: "01/01/2026",
    });
    setIsModalOpen(true);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const toggleSidebarRight = () => {
    setIsSidebarRightOpen(!isSidebarRightOpen);
  };

  const handleFinancialNewObjective = () => {
    if (window.innerWidth >= 768) {
      setShowForm(true);
    } else {
      router.push(ROUTES.FINANCIAL_NEW_OBJECTIVE);
    }
  };

  const handleFinancialObjective = () => {
    if (window.innerWidth >= 768) {
      setShowForm(false);
    } else {
      router.push(ROUTES.FINANCIAL_OBJECTIVE);
    }
  };

  const handleFinancialIAObjective = () => {
    if (window.innerWidth >= 768) {
      setShowForm(true);
    } else {
      router.push(ROUTES.FINANCIAL_NEW_OBJECTIVE);
    }
  };

  const fulfilledObjectives = objectives.filter(
    (obj) => obj.percentage === 100
  );
  const unfulfilledObjectives = objectives.filter(
    (obj) => obj.percentage < 100
  );

  return (
    <div className="flex h-screen bg-gray-100 relative overflow-hidden font-sans antialiased text-gray-800 min-h-0">
      {/* Sidebar positioned absolutely */}
      <div
        className={`absolute left-0 top-0 h-full z-30 transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <Sidebar />
      </div>

      {/* Main content with conditional margin for sidebar */}
      <div
        className={`flex-1 flex flex-col transition-all duration-300 ml-0 ${
          isSidebarOpen ? "md:ml-64" : "md:ml-0"
        }`}
      >
        <GreetingHeader onToggleSidebar={toggleSidebarRight} />

        {/* Sidebar toggle button */}
        <button
          onClick={toggleSidebar}
          className={`hidden md:flex fixed my-12 -translate-y-1/2 cursor-pointer z-40 transition-all duration-300 ${
            isSidebarOpen ? "left-58" : "left-0"
          }`}
        >
          <ArrowsLeftIcon
            className={`w-8 h-8 bg-blue-950 ml-2 p-2 rounded-full border border-blue-950 transform transition-transform duration-300 ${
              isSidebarOpen ? "" : "rotate-180"
            }`}
          />
        </button>

        <main className="p-4 space-y-6 flex-1 overflow-y-auto min-h-0">
          <div className="md:hidden">
            <NavigationBack />
          </div>

          <div className="flex flex-col flex-1 bg-white md:bg-gray-100 rounded-2xl p-5 space-y-10">
            <h2 className="text-lg font-semibold text-gray-800 md:hidden">
              Objectivos financeiros
            </h2>
            <div className="space-y-4 md:space-y-0 md:space-x-0 grid grid-cols-1 md:grid-cols-2 gap-4 md:bg-white md:p-2 md:px-5 rounded-2xl">
              <div
                className={`rounded-xl shadow-sm md:shadow-none mt-4 cursor-pointer transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] hover:shadow-md`}
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
                className={`rounded-xl shadow-sm md:shadow-none mt-4 cursor-pointer transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] hover:shadow-md`}
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
            <div className="hidden md:block mt-8 md:mt-0 rounded-2xl h-full bg-white p-6 md:min-w-full">
              {showForm ? (
                <div className="flex gap-4 min-h-0">
                  <div className="w-2/3 h-full min-h-0">
                    <ObjectiveForm />
                  </div>
                  <div className="w-1/3 h-full min-h-0">
                    <SketchPanel />
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-3 gap-4 flex-1 min-h-0">
                  {/* Meus objetivos financeiros */}
                  <div className="space-y-4 flex-1">
                    <h3 className="text-lg font-semibold text-gray-800">
                      Meus objectivos financeiros
                    </h3>
                    <div className="flex flex-col gap-2 flex-1">
                      {unfulfilledObjectives.map((obj) => (
                        <div
                          key={obj.id}
                          className="cursor-pointer transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                        >
                          <FinancialProgressCard
                            title={obj.title}
                            valorAlvo={obj.valorAlvo}
                            valorPoupado={obj.valorPoupado}
                            percentage={obj.percentage}
                            iconColor="text-indigo-600"
                            onEdit={() => handleEdit(obj)}
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Objectivos cumpridos */}
                  <div className="space-y-4 flex-1">
                    <h3 className="text-lg font-semibold text-gray-800">
                      Objectivos cumpridos
                    </h3>
                    <div className="flex flex-col gap-2 flex-1">
                      {fulfilledObjectives.map((obj) => (
                        <div
                          key={obj.id}
                          className="cursor-pointer transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                        >
                          <FinancialProgressCard
                            title={obj.title}
                            valorAlvo={obj.valorAlvo}
                            valorPoupado={obj.valorPoupado}
                            percentage={obj.percentage}
                            iconColor="text-green-600"
                            onEdit={() => handleEdit(obj)}
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Objectivos por cumprir */}
                  <div className="space-y-4 flex-1">
                    <h3 className="text-lg font-semibold text-gray-800">
                      Objectivos por cumprir
                    </h3>
                    <div className="flex flex-col gap-2 flex-1">
                      {unfulfilledObjectives.map((obj) => (
                        <div
                          key={obj.id}
                          className="cursor-pointer transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                        >
                          <FinancialProgressCard
                            title={obj.title}
                            valorAlvo={obj.valorAlvo}
                            valorPoupado={obj.valorPoupado}
                            percentage={obj.percentage}
                            iconColor="text-red-600"
                            onEdit={() => handleEdit(obj)}
                          />
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
