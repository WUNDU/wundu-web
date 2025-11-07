"use client";

import Sidebar from "@/src/components/molecules/Sidebar";
import { useState } from "react";

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
      {/* Sidebar com transição suave */}
      <div
        className={`hidden md:flex h-full transition-all duration-300 ease-in-out ${
          isSidebarOpen ? "w-64" : "w-0 opacity-0"
        }`}
      >
        <div
          className={`${
            isSidebarOpen ? "w-64" : "w-0"
          } transition-all duration-300`}
        >
          <Sidebar />
        </div>
      </div>

      {/* Conteúdo Principal */}
      <div className="flex-1 flex flex-col min-w-0 h-full">
        {/* Botão de toggle do sidebar */}
        <button
          onClick={toggleSidebar}
          className="hidden md:flex fixed top-6 left-4 z-50 cursor-pointer transition-all duration-300"
        >
          <svg
            className={`w-6 h-6 bg-blue-950 p-1 rounded-full border border-blue-950 text-white transform transition-transform duration-300 ${
              isSidebarOpen ? "rotate-0" : "rotate-180"
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>

        {/* Children com margem condicional */}
        <div
          className={`h-full transition-all duration-300 ${
            isSidebarOpen ? "md:ml-0" : "md:ml-0"
          }`}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
