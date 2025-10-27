interface LegalTabsProps {
  activeTab: "privacy" | "cookies" | "terms";
  onTabChange: (tab: "privacy" | "cookies" | "terms") => void;
}

const LegalTabs: React.FC<LegalTabsProps> = ({ activeTab, onTabChange }) => {
  const tabs: { id: "privacy" | "cookies" | "terms"; label: string }[] = [
    { id: "privacy", label: "Política de Privacidade" },
    { id: "cookies", label: "Política de Cookies" },
    { id: "terms", label: "Termos de Uso" },
  ];

  return (
    <div className="flex flex-wrap mb-12 border-b border-gray-200">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`text-lg px-8 py-4 font-medium transition-all duration-300 relative ${
            activeTab === tab.id
              ? "text-blue-900 border-b-2 border-blue-900 font-semibold"
              : "text-gray-500 hover:text-blue-700"
          }`}
        >
          {tab.label}
          {activeTab === tab.id && (
            <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-blue-600 to-yellow-600 rounded-full"></div>
          )}
        </button>
      ))}
    </div>
  );
};

export default LegalTabs;
