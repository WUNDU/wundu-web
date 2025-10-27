import { MoreButtonProps } from "@/src/types/button";
import ArrowRotate from "../icons/ArrowRotate";

const MoreButton: React.FC<MoreButtonProps> = ({
  onClick,
  isLoading,
  color,
  label,
}) => {
  return (
    <button
      onClick={onClick}
      disabled={isLoading}
      className={`inline-flex items-center justify-center px-4 py-2 text-sm font-medium rounded-lg shadow-sm ${
        color ? color : "bg-white"
      } text-gray-700 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 w-auto min-w-fit`}
    >
      <span>{label}</span>
      {isLoading ? (
        <ArrowRotate className="h-4 w-4 animate-spin text-gray-700 ml-2" />
      ) : (
        <ArrowRotate className="h-4 w-4 text-gray-700 ml-2" />
      )}
    </button>
  );
};

export default MoreButton;
