import React from "react";
import Message from "../atoms/Message";

const ChatMessages: React.FC = () => {
  const messages = [
    { text: "Olá, Israel Manuel\nEm que posso ajudar ?", isUser: false },
    { text: "Preciso de 3 dicas de como economizar.", isUser: true },
    {
      text: "Claro, aqui está a 5 para economizar dinheiro, em resumo:\n\nOrçamento: Acompanhe receitas e despesas.\n\nMetas: Defina o quanto quer economizar.\n\nCortes: Reduza gastos desnecessários.",
      isUser: false,
    },
    { text: "Muito obrigado Wundo AI", isUser: true },
  ];

  return (
    <div className="flex-1 overflow-y-auto p-4">
      {messages.map((msg, index) => (
        <Message key={index} text={msg.text} isUser={msg.isUser} />
      ))}
    </div>
  );
};

export default ChatMessages;
