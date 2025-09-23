'use client'
import React, { useState } from 'react';
import HeaderChat from '../molecules/HeaderChat';
import ChatOptions from '../molecules/ChatOption';
import ChatMessages from '../molecules/ChatMessage';
import InputArea from '../atoms/InputArea';
import NavigationBack from '../atoms/NavigationBack';
import InitialInputArea from '../molecules/InitializeInputArea';


const ChatScreen: React.FC = () => {
  const [showChat, setShowChat] = useState(false);

  return (
    <div className="flex flex-1 flex-col h-screen rounded-2xl py-2 bg-gray-100">
      {/* Header com botão Voltar (fora do container) */}
      <NavigationBack />

      {/* Container principal branco com margem */}
      <div className="mx-4 my-4 h-full bg-white rounded-xl flex flex-col">
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
            <InputArea />
          </>
        )}
      </div>
    </div>
  );
};

export default ChatScreen;