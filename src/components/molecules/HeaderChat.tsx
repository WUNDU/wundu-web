import { IAIcon } from "@/src/constants/icons";

const HeaderChat: React.FC = () => {
  return (
    <div className="md:hidden flex items-center justify-center p-4 border-b border-gray-200">
      <IAIcon />
      <h1 className="ml-3 text-lg font-semibold text-gray-800">Wundo AI</h1>
    </div>
  );
};

export default HeaderChat;
