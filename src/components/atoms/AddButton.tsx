import { PlusIcon } from "@/src/constants/icons";

const AddButton = () => {
  return (
    <div className="relative">
      <button className="bg-yellow-400 rounded-full p-4 shadow-lg hover:scale-110 transition-transform duration-200 active:scale-95">
        <PlusIcon className="text-white w-6 h-6" />
      </button>
    </div>
  );
};

export default AddButton;