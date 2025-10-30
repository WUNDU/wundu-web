import { OptionButtonProps } from "@/src/types/button";

const OptionButton: React.FC<OptionButtonProps> = ({
  icon: Icon,
  text,
  onClick,
}) => (
  <button
    className="flex items-center w-full p-4 space-x-4 bg-gray-100 rounded-lg shadow-sm text-left transition-all duration-300 ease-in-out hover:bg-gray-200 hover:shadow-md hover:scale-105 transform group"
    onClick={onClick}
  >
    <div className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-200 text-gray-900 flex-shrink-0 transition-all duration-300 ease-in-out group-hover:bg-gray-300 group-hover:scale-110">
      <Icon
        size={24}
        className="transition-transform duration-300 ease-in-out group-hover:scale-110"
      />
    </div>
    <span className="text-base text-gray-700 font-medium transition-all duration-300 ease-in-out group-hover:text-gray-900">
      {text}
    </span>
  </button>
);

export default OptionButton;
