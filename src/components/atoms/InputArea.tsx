import { SendIcon } from "@/src/constants/icons";
import React, { useState } from "react";

const InputArea: React.FC = () => {
  const [message, setMessage] = useState("");

  return (
    <div className="p-4 bg-white border-t border-gray-200">
      <div className="flex items-center bg-gray-50 rounded-full p-1">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Escrever"
          className="flex-1 bg-transparent p-3 focus:outline-none text-sm"
        />
        <button className="bg-gradient-to-b from-blue-600 to-blue-300 p-2 m-1 rounded-full">
          <SendIcon className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default InputArea;
