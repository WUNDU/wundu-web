"use client";

import React, { useState } from "react";
import HeaderChat from "../molecules/HeaderChat";
import ChatOptions from "../molecules/ChatOption";
import ChatMessages from "../molecules/ChatMessage";
import NavigationBack from "../atoms/NavigationBack";
import InitialInputArea from "../molecules/InitializeInputArea";
import GreetingHeader from "../molecules/GreetingHeader";
import SidebarRight from "../molecules/SideBarRight";
import { ArrowsLeftIcon } from "@/src/constants/icons";
import Sidebar from "../molecules/Sidebar";
import Input from "../atoms/Input";

const ChatScreen: React.FC = () => {
  const [showChat, setShowChat] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);
  const [isSidebarRightOpen, setIsSidebarRightOpen] = useState<boolean>(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const toggleSidebarRight = () => {
    setIsSidebarRightOpen(!isSidebarRightOpen);
  };

  const prev = () => {
    setShowChat(false);
  };

  return (
    <>
      {/* Layout Mobile - Mantém exatamente igual */}
      <div className="flex flex-col h-screen rounded-2xl py-2 bg-gray-100 md:hidden">
        {/* Header com botão Voltar (fora do container) */}

        {showChat ? <NavigationBack prev={prev} /> : <NavigationBack />}

        {/* Container principal branco com margem */}
        <div className="mx-4 my-4 flex-1 bg-white rounded-xl flex flex-col">
          {/* Header do Wundo AI (dentro do container) */}
          <HeaderChat />

          {!showChat ? (
            <>
              <ChatOptions onOptionSelect={() => setShowChat(true)} />
              <InitialInputArea onFocus={() => setShowChat(true)} />
            </>
          ) : (
            <>
              <ChatMessages />
              <Input />
            </>
          )}
        </div>
      </div>

      {/* Layout Desktop - Seguindo o padrão do LibraryScreen */}
      <div className="hidden md:flex h-screen bg-gray-50 relative overflow-hidden font-sans antialiased text-gray-800">
        {/* Sidebar Esquerdo */}
        <div
          className={`absolute left-0 top-0 h-full z-30 transition-transform duration-300 ease-in-out ${
            isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <Sidebar />
        </div>

        {/* Conteúdo Principal */}
        <div
          className={`flex-1 flex flex-col transition-all duration-300 ${
            isSidebarOpen ? "md:ml-64" : "md:ml-0"
          } h-full`}
        >
          <GreetingHeader onToggleSidebar={toggleSidebarRight} />

          {/* Botão de toggle do sidebar */}
          <button
            onClick={toggleSidebar}
            className={`hidden md:flex fixed my-12 -translate-y-1/2 cursor-pointer z-40 transition-all duration-300 ${
              isSidebarOpen ? "left-58" : "left-0"
            }`}
          >
            <ArrowsLeftIcon
              className={`w-8 h-8 bg-blue-950 ml-2 p-2 rounded-full border border-blue-950 transform transition-transform duration-300 ${
                isSidebarOpen ? "" : "rotate-180"
              }`}
            />
          </button>

          {/* Container principal do chat */}
          <main className="flex-1 px-4 m-5 pb-4 flex h-full overflow-hidden">
            <div className="flex flex-1 h-full">
              {/* Área principal do chat */}
              <div className="flex-1 bg-white rounded-2xl overflow-hidden flex flex-col">
                {/* Header do Chat */}
                <div className="border-b border-gray-200">
                  <HeaderChat />
                </div>

                {/* Conteúdo do Chat */}
                <div className="flex-1 flex flex-col">
                  {!showChat ? (
                    <>
                      <ChatOptions onOptionSelect={() => setShowChat(true)} />
                      <InitialInputArea onFocus={() => setShowChat(true)} />
                    </>
                  ) : (
                    <>
                      <ChatMessages />
                      <Input showSendButton />
                    </>
                  )}
                </div>
              </div>
            </div>
          </main>
        </div>

        {/* Sidebar Direito */}
        <SidebarRight
          isOpen={isSidebarRightOpen}
          onClose={toggleSidebarRight}
        />
      </div>
    </>
  );
};

export default ChatScreen;
