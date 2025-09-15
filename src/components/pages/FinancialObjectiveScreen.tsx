'use client'
import { HistoryIcon, IAIcon, PlusIcon } from "@/src/constants/icons";
import NavigationBack from "../atoms/NavigationBack";
import FinancialObjectiveCard from "../molecules/FinancialObjectiveCard";
import GreetingHeader from "../molecules/GreetingHeader";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/src/constants/routes";

const FinancialObjectiveScreen: React.FC = () => {
  const route = useRouter()
  const handleFinancialNewObjective = () => {
    route.push(ROUTES.FINANCIAL_NEW_OBJECTIVE)
  }
  const handleFinancialObjective = () => {
    route.push(ROUTES.FINANCIAL_OBJECTIVE)
  }
  const handleFinancialIAObjective = () => {
    route.push(ROUTES.FINANCIAL_NEW_OBJECTIVE)
  }
  return (
    <div className="bg-gray-100 min-h-screen font-sans antialiased text-gray-800 flex flex-col">
      <GreetingHeader onToggleSidebar={function (): void {
        throw new Error("Function not implemented.");
      }} />
      <main className="p-4 space-y-6 flex-1 flex flex-col">
        <NavigationBack />

        <div className="flex flex-col flex-1 bg-white rounded-2xl p-5 space-y-10">
          <h2 className="text-lg font-semibold text-gray-800">Objectivos financeiros</h2>
          <div className="space-y-4">
            <div className="rounded-xl shadow-sm mt-4 cursor-pointer transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] hover:shadow-md" onClick={handleFinancialNewObjective}>
              <FinancialObjectiveCard
                icon={PlusIcon}
                title="Crie um objecto financeiro"
                description="são metas especificas relacionadas ao dinheiro ."
                borderColor="border-l-yellow-400"
                bgColor="bg-yellow-100"
                iconBgColor="bg-white"
                iconColor="text-yellow-300"
              />
            </div>
            <div className="rounded-xl shadow-sm mt-4 cursor-pointer transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] hover:shadow-md" onClick={handleFinancialObjective}>
              <FinancialObjectiveCard
                icon={HistoryIcon}
                title="Meus objectivos"
                description="Visualizar todos os meus objectivos já criados aqui."
                borderColor="border-l-red-400"
                bgColor="bg-red-100"
                iconBgColor="bg-white"
                iconColor="text-red-600"
              />
            </div>
          </div>

          <div className="mt-8">
            <h2 className="text-lg font-semibold text-gray-400">Gerar o objectivo financeiro com AI</h2>
            <div className="rounded-xl shadow-sm mt-4 cursor-pointer transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] hover:shadow-md">
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
        </div>
      </main>
    </div>
  );
};

export default FinancialObjectiveScreen;