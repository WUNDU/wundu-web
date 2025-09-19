import { ModalHeaderProps } from "@/src/types/modal";
import { CloseIcon } from "@/src/constants/icons";

const ModalHeader = ({ title, onClose }: ModalHeaderProps) => (
  <div className="flex justify-between items-center p-4">
    <h1 className="text-xl text-center font-bold text-[#0F2045]">{title}</h1>
    <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100 transition-colors">
      <CloseIcon />
    </button>
  </div>
);

export default ModalHeader