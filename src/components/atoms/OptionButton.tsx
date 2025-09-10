import { OptionButtonProps } from "@/src/types/button";

const OptionButton: React.FC<OptionButtonProps> = ({ icon: Icon, text, onClick }) => (
  <button className="flex items-center w-full p-4 space-x-4 bg-gray-100 rounded-lg shadow-sm text-left" onClick={onClick}>
    <div className="w-10 h-10 flex items-center justify-center rounded-full bg-yellow-400 text-white flex-shrink-0">
      <Icon size={24} />
    </div>
    <span className="text-base text-gray-700 font-medium">{text}</span>
  </button>
);

export default OptionButton