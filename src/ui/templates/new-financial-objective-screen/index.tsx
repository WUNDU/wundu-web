"use client";
import { NavigationBack } from "@/ui/atoms";
import { ObjectiveForm } from "@/ui/organisms";
import { NotificationToast } from "@/ui/organisms/notification-toast";

const NewFinancialObjectiveScreen: React.FC = () => {
  return (
    <div className="bg-gray-100 min-h-screen font-sans antialiased text-gray-800 flex flex-col">
      <main className="p-4 pb-28 space-y-6 flex-1 flex flex-col">
        <NavigationBack />
        <div className="flex-1">
          <ObjectiveForm />
        </div>
      </main>
      <NotificationToast />
    </div>
  );
};

export default NewFinancialObjectiveScreen;
