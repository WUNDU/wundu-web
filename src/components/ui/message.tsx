import { IAIcon } from "@/constants/icons";
import React from "react";

const Message: React.FC<{ text: React.ReactNode; isUser: boolean }> = ({
  text,
  isUser,
}) => {
  if (isUser) {
    return (
      <div className="flex justify-end items-end gap-2.5 mb-1">
        <div className="bg-gradient-to-br from-[#003cc3] to-[#001a66] px-4 py-3 rounded-2xl rounded-br-sm max-w-[72%] shadow-sm">
          <p className="text-sm text-white leading-relaxed whitespace-pre-line">{text}</p>
        </div>
        <div className="w-8 h-8 flex-shrink-0 rounded-full bg-slate-200 flex items-center justify-center text-slate-500">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/>
          </svg>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-start gap-2.5 mb-1">
      <div className="w-8 h-8 flex-shrink-0 rounded-[10px] bg-gradient-to-br from-[#003cc3] to-[#001a66] flex items-center justify-center shadow-sm">
        <IAIcon className="w-4 h-4 text-white" />
      </div>
      <div className="bg-white px-4 py-3 rounded-2xl rounded-bl-sm max-w-[72%] shadow-[0_2px_8px_rgba(0,60,195,0.08)] border border-slate-100">
        <p className="text-sm text-slate-800 leading-relaxed whitespace-pre-line">{text}</p>
      </div>
    </div>
  );
};

export default Message;
