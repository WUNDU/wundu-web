// src/components/templates/HomeScreenLayout.tsx
import React from "react";
import SidebarRight from "../molecules/SideBarRight";
import GreetingHeader from "../molecules/GreetingHeader";
import BottomNavigation from "../organisms/BottomNavigation";

interface HomeScreenLayoutProps {
  children: React.ReactNode;
  isSidebarOpen: boolean;
  isSidebarRightOpen: boolean;
  onToggleSidebar: () => void;
  onToggleSidebarRight: () => void;
}

export const HomeScreenLayout: React.FC<HomeScreenLayoutProps> = ({
  children,
  isSidebarOpen,
  isSidebarRightOpen,
  onToggleSidebarRight,
}) => {
  return (
    <div className="flex h-screen bg-gray-100 relative overflow-hidden font-sans antialiased text-gray-800">
      {/* Conteúdo Principal */}
      <div
        className={`flex-1 flex flex-col transition-all duration-300 ${
          isSidebarOpen ? "" : "md:ml-0"
        } h-full`}
      >
        <GreetingHeader onToggleSidebar={onToggleSidebarRight} />

        {/* Container principal */}
        <main className="flex-1 mb-0 px-4 pb-20 md:pb-0 flex flex-col h-full overflow-y-auto">
          {children}
        </main>

        {/* BottomNavigation - apenas no mobile */}
        <BottomNavigation />
      </div>

      {/* Sidebar Direito */}
      <SidebarRight
        isOpen={isSidebarRightOpen}
        onClose={onToggleSidebarRight}
      />
    </div>
  );
};
