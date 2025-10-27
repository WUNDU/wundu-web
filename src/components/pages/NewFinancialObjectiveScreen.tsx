"use client";
import NavigationBack from "../atoms/NavigationBack";
import ObjectiveForm from "../organisms/ObjectiveForm";

const NewFinancialObjectiveScreen: React.FC = () => {
  return (
    <div className="bg-gray-100 min-h-screen font-sans antialiased text-gray-800 flex flex-col">
      <main className="p-4 space-y-6 flex-1 flex flex-col">
        <NavigationBack />
        <div className="flex flex-col flex-1 bg-white rounded-2xl p-5 space-y-10 justify-center">
          <ObjectiveForm />
        </div>
      </main>
    </div>
  );
};

export default NewFinancialObjectiveScreen;
