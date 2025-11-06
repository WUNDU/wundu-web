// src/components/templates/HomeScreenLayout.tsx
import React from "react";
import Sidebar from "../molecules/Sidebar";
import SidebarRight from "../molecules/SideBarRight";
import GreetingHeader from "../molecules/GreetingHeader";
import BottomNavigation from "../organisms/BottomNavigation";
import { ArrowsLeftIcon } from "@/src/constants/icons";

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
  onToggleSidebar,
  onToggleSidebarRight,
}) => {
  return (
    <div className="flex h-screen bg-gray-100 relative overflow-hidden font-sans antialiased text-gray-800">
      {/* Sidebar Esquerdo */}
      <aside
        className={`absolute left-0 top-0 h-full z-30 transition-transform duration-300 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <Sidebar />
      </aside>

      {/* Conteúdo Principal */}
      <div
        className={`flex-1 flex flex-col transition-all duration-300 ${
          isSidebarOpen ? "md:ml-64" : "md:ml-0"
        } h-full`}
      >
        <GreetingHeader onToggleSidebar={onToggleSidebarRight} />

        {/* Toggle Button Sidebar */}
        <button
          onClick={onToggleSidebar}
          className={`hidden md:flex fixed my-12 -translate-y-1/2 cursor-pointer z-40 transition-all duration-300 ${
            isSidebarOpen ? "left-58" : "left-0"
          }`}
          aria-label="Toggle sidebar"
        >
          <ArrowsLeftIcon
            className={`w-8 h-8 bg-blue-950 ml-2 p-2 rounded-full border border-blue-950 transform transition-transform duration-300 ${
              isSidebarOpen ? "" : "rotate-180"
            }`}
          />
        </button>

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
