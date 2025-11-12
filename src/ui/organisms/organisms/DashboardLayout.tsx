"use client";

import Sidebar from "@/src/components/molecules/Sidebar";
import { useState } from "react";
import { ArrowsLeftIcon } from "@/src/constants/icons";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      {/* Sidebar Fixo */}
      <div
        className={`hidden md:block h-full transition-all duration-300 ease-in-out ${
          isSidebarOpen ? "w-64" : "w-0"
        }`}
      >
        <Sidebar />
      </div>

      {/* Conteúdo Principal */}
      <div
        className={`flex-1 flex flex-col min-w-0 h-full transition-all duration-300 ${
          isSidebarOpen ? "" : "md:ml-0"
        }`}
      >
        {/* Botão de Toggle - MESMA POSIÇÃO DO SEU CÓDIGO ORIGINAL */}
        <button
          onClick={toggleSidebar}
          className={`hidden md:flex fixed my-12 -translate-y-1/2 cursor-pointer z-40 transition-all duration-300 ${
            isSidebarOpen ? "left-58" : "left-0"
          }`}
        >
          <ArrowsLeftIcon
            className={`w-8 h-8 bg-blue-950 ml-2 p-2 rounded-full border border-blue-950 text-white transform transition-transform duration-300 ${
              isSidebarOpen ? "" : "rotate-180"
            }`}
          />
        </button>

        {/* Children - conteúdo das páginas */}
        <div className="h-full overflow-auto">{children}</div>
      </div>
    </div>
  );
}
