import { SendIcon } from "@/src/constants/icons";

const InitialInputArea: React.FC<{ onFocus: () => void }> = ({ onFocus }) => {
  return (
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
};

export default InitialInputArea;
