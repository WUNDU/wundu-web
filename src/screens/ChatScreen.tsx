"use client";

import React, { useState } from "react";
import HeaderChat from "../molecules/HeaderChat";
import ChatOptions from "../molecules/ChatOption";
import ChatMessages from "../molecules/ChatMessage";
import NavigationBack from "../atoms/NavigationBack";
import InitialInputArea from "../molecules/InitializeInputArea";
import GreetingHeader from "../molecules/GreetingHeader";
import SidebarRight from "../molecules/SideBarRight";
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

        {/* Conteúdo Principal */}
        <div
          className={`flex-1 flex flex-col transition-all duration-300 ${
            isSidebarOpen ? "" : "md:ml-0"
          } h-full`}
        >
          <GreetingHeader onToggleSidebar={toggleSidebarRight} />

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
