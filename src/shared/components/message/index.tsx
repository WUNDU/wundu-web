import { IAIcon } from "@/constants/icons";
import React from "react";

const Message: React.FC<{ text: string; isUser: boolean }> = ({
  text,
  isUser,
}) => {
  const UserAvatar = () => (
    <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
      <span className="text-sm">👤</span>
    </div>
  );

  if (isUser) {
    return (
      <div className="flex justify-end items-end mb-4 py-2.5">
        <div className="text-gray-600 p-3 rounded-2xl border border-gray-300 rounded-br-md max-w-xs mr-3">
          <p className="text-sm">{text}</p>
        </div>
        <UserAvatar />
      </div>
    );
  }

  return (
    <div className="flex items-start mb-4 py-2.5">
      <div className="w-8 h-8 mr-3 mt-1">
        <IAIcon />
      </div>
      <div className="bg-white p-3 rounded-2xl rounded-bl-none max-w-xs shadow-sm border border-[#6E68FF]">
        <p className="text-sm text-gray-800">{text}</p>
      </div>
    </div>
  );
};

export default Message;
