"use client";

import React, { useState } from "react";
import { useRouter as useNavRouter } from "next/navigation";
const NavigationBack: React.FC<{ prev?: () => void; color?: string }> = ({ prev, color }) => {
  const router = useNavRouter();
  return (
    <button onClick={prev ?? (() => router.back())} className={`p-2 -ml-2 ${color ?? "text-gray-700"} hover:bg-gray-100 rounded-full transition-colors`} aria-label="Voltar">
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
    </button>
  );
};
import { SendIcon } from "@/constants/icons";

const InitialInputArea: React.FC<{ onFocus: () => void }> = ({ onFocus }) => (
  <div className="p-4">
    <div className="flex items-center bg-gray-50 rounded-2xl border border-gray-200 p-1">
      <input
        type="text"
        placeholder="Pergunte alguma coisa"
        className="flex-1 bg-transparent p-3 focus:outline-none text-sm"
        onFocus={onFocus}
      />
      <button className="bg-gradient-to-b from-blue-600 to-blue-300 p-2 m-1 rounded-full">
        <SendIcon className="w-5 h-5" />
      </button>
    </div>
  </div>
);
import { Input as ChatInput, Message } from "@/components/ui";
import {
  IAIcon,
  CoinIcon,
  MoneyBagIcon,
  MoneyManagerIcon,
  MoneyPotIcon,
  MoneySignIcon,
} from "@/constants/icons";

const Chat: React.FC = () => {
  const [showChat, setShowChat] = useState(false);
  const [isSidebarOpen] = useState<boolean>(true);

  const prev = () => setShowChat(false);

  const chatOptions = [
    { label: "Investimentos", color: "bg-red-50 text-red-600", icon: <MoneyBagIcon /> },
    { label: "Finanças", color: "bg-orange-50 text-orange-600", icon: <CoinIcon /> },
    { label: "Poupanças", color: "bg-blue-50 text-blue-600", icon: <MoneyManagerIcon /> },
    { label: "Gestão", color: "bg-green-50 text-green-600", icon: <MoneyPotIcon /> },
    { label: "Dinheiro", color: "bg-teal-50 text-teal-600", icon: <MoneySignIcon /> },
  ];

  const chatMessages = [
    { text: "Olá, Israel Manuel\nEm que posso ajudar ?", isUser: false },
    { text: "Preciso de 3 dicas de como economizar.", isUser: true },
    {
      text: "Claro, aqui está a 5 para economizar dinheiro, em resumo:\n\nOrçamento: Acompanhe receitas e despesas.\n\nMetas: Defina o quanto quer economizar.\n\nCortes: Reduza gastos desnecessários.",
      isUser: false,
    },
    { text: "Muito obrigado Wundo AI", isUser: true },
  ];

  const ChatOptionsPanel = ({ onOptionSelect }: { onOptionSelect: () => void }) => (
    <div className="flex flex-col items-center justify-center flex-1 p-6">
      <div className="w-full max-w-sm mt-16">
        <h3 className="text-center text-gray-700 font-medium mb-6">Como posso ajudar?</h3>
        <p className="text-center text-gray-600 text-sm mb-6">Deseja falar sobre:</p>
        <div className="flex flex-wrap gap-5">
          {chatOptions.map((option, index) => (
            <button
              key={index}
              onClick={onOptionSelect}
              className={`flex items-center justify-center p-3 rounded-xl ${option.color} transition-all hover:scale-105`}
            >
              <span className="mr-2">{option.icon}</span>
              <span className="text-sm font-medium wrap-break-word whitespace-normal text-left grow">
                {option.label}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  const ChatMessagesPanel = () => (
    <div className="flex-1 overflow-y-auto p-4">
      {chatMessages.map((msg, index) => (
        <Message key={index} text={msg.text} isUser={msg.isUser} />
      ))}
    </div>
  );

  const HeaderChatPanel = () => (
    <div className="md:hidden flex items-center justify-center p-4 border-b border-gray-200">
      <IAIcon />
      <h1 className="ml-3 text-lg font-semibold text-gray-800">Wundo AI</h1>
    </div>
  );

  return (
    <>
      {/* Layout Mobile */}
      <div className="flex flex-col h-screen rounded-2xl py-2 bg-gray-100 md:hidden">
        {showChat ? <NavigationBack prev={prev} /> : <NavigationBack />}
        <div className="mx-4 my-4 flex-1 bg-white rounded-xl flex flex-col">
          <HeaderChatPanel />
          {!showChat ? (
            <>
              <ChatOptionsPanel onOptionSelect={() => setShowChat(true)} />
              <InitialInputArea onFocus={() => setShowChat(true)} />
            </>
          ) : (
            <>
              <ChatMessagesPanel />
              <ChatInput />
            </>
          )}
        </div>
      </div>

      {/* Layout Desktop */}
      <div className="hidden md:flex h-screen bg-gray-50 relative overflow-hidden font-sans antialiased text-gray-800">
        <div
          className={`flex-1 flex flex-col transition-all duration-300 ${
            isSidebarOpen ? "" : "md:ml-0"
          } h-full`}
        >
          <main className="flex-1 px-4 m-5 pb-4 flex h-full overflow-hidden">
            <div className="flex flex-1 h-full">
              <div className="flex-1 bg-white rounded-2xl overflow-hidden flex flex-col">
                <div className="border-b border-gray-200">
                  <HeaderChatPanel />
                </div>
                <div className="flex-1 flex flex-col">
                  {!showChat ? (
                    <>
                      <ChatOptionsPanel onOptionSelect={() => setShowChat(true)} />
                      <InitialInputArea onFocus={() => setShowChat(true)} />
                    </>
                  ) : (
                    <>
                      <ChatMessagesPanel />
                      <ChatInput showSendButton />
                    </>
                  )}
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </>
  );
};

export default Chat;
