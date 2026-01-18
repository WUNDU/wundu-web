"use client";
import FinancialProgressCard from "@/ui/molecules/financial-progress-card";
import { GreetingHeader } from "@/ui/molecules";
import EditModal from "@/ui/molecules/edit-modal";
import { useFinancialProgressScreen } from "@/hooks/objective/use-financial-progress-screen";
import { BottomNavigation } from "@/ui/organisms";
import { LoadingSpinner } from "@/ui/atoms";
import { NotificationToast } from "@/ui/organisms/notification-toast";

const FinancialProgressScreen: React.FC = () => {
  const {
    isModalOpen,
    selectedObjective,
    handleEdit,
    unfulfilledObjectives,
    fulfilledObjectives,
    goalsStatus,
    goalsError,
    handleModalClose,
    handleModalUpdated,
  } = useFinancialProgressScreen();

  const isLoading = goalsStatus === "loading";
  const hasAnyGoal =
    unfulfilledObjectives.length > 0 || fulfilledObjectives.length > 0;

  return (
    <div className="bg-gradient-to-b from-slate-50 via-white to-slate-100 min-h-screen font-sans antialiased text-gray-800 flex flex-col">
      <GreetingHeader onToggleSidebar={() => {}} />
      <main className="p-4 pb-28 space-y-6 flex-1 flex flex-col">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">
            Meus objectivos
          </h2>
        </div>

        <div className="flex flex-col flex-1 bg-white rounded-2xl p-5 space-y-6 shadow-lg border border-gray-100">
          {goalsError && <p className="text-sm text-red-500">{goalsError}</p>}

          {isLoading ? (
            <div className="flex flex-1 items-center justify-center">
              <LoadingSpinner />
            </div>
          ) : hasAnyGoal ? (
            <div className="space-y-6">
              {[
                { title: "Em andamento", data: unfulfilledObjectives },
                { title: "Concluídos", data: fulfilledObjectives },
              ].map(({ title, data }) => (
                <section key={title} className="space-y-3">
                  <h3 className="text-base font-semibold text-gray-800">
                    {title}
                  </h3>
                  {data.length ? (
                    <div className="space-y-3">
                      {data.map((obj) => (
                        <div
                          key={obj.id}
                          className="rounded-2xl border border-gray-100 shadow-sm bg-gray-50/80 p-3 hover:bg-white transition-colors"
                        >
                          <FinancialProgressCard
                            title={obj.title}
                            valorAlvo={obj.valorAlvo}
                            valorPoupado={obj.valorPoupado}
                            percentage={obj.percentage}
                            onEdit={() => handleEdit(obj.goal)}
                          />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">
                      Nenhum objetivo {title.toLowerCase()}.
                    </p>
                  )}
                </section>
              ))}
            </div>
          ) : (
            <div className="flex flex-1 flex-col items-center justify-center text-center space-y-3">
              <p className="text-gray-500 text-sm">
                Ainda não há objetivos registados. Crie o seu primeiro objectivo
                financeiro!
              </p>
            </div>
          )}
        </div>
      </main>
      <EditModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onUpdated={handleModalUpdated}
        objective={selectedObjective}
      />
      <NotificationToast />
      <div className="md:hidden">
        <BottomNavigation />
      </div>
    </div>
  );
};

export default FinancialProgressScreen;
