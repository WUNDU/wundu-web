"use client";
import { objectives } from "@/constants/mockData";
import { NavigationBack } from "@/ui/atoms";
import FinancialProgressCard from "@/ui/molecules/FinancialProgressCard";
import { GreetingHeader } from "@/ui/molecules";
import EditModal from "@/ui/molecules/EditModal";
import { useFinancialProgressScreen } from "@/hooks/objective/useFinancialProgressScreen";

const FinancialProgressScreen: React.FC = () => {
  const { isModalOpen, setIsModalOpen, selectedObjective, handleEdit } =
    useFinancialProgressScreen();
  return (
    <div className="bg-gray-100 min-h-screen font-sans antialiased text-gray-800 flex flex-col">
      <GreetingHeader
        onToggleSidebar={function (): void {
          throw new Error("Function not implemented.");
        }}
      />
      <main className="p-4 space-y-6 flex-1 flex flex-col">
        <NavigationBack />
        <div className="flex flex-col flex-1 bg-white rounded-2xl p-5 space-y-10">
          <h2 className="text-lg font-semibold text-gray-800">
            Meus objectivos financeiros
          </h2>
          <div className="space-y-4">
            {objectives.map((obj) => (
              <div
                key={obj.id}
                className="rounded-xl shadow-sm cursor-pointer transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] hover:shadow-md"
              >
                <FinancialProgressCard
                  key={obj.id}
                  title={obj.title}
                  valorAlvo={obj.valorAlvo}
                  valorPoupado={obj.valorPoupado}
                  percentage={obj.percentage}
                  onEdit={() => handleEdit(obj)}
                />
              </div>
            ))}
          </div>
        </div>
      </main>
      <EditModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        objective={selectedObjective}
      />
    </div>
  );
};

export default FinancialProgressScreen;
