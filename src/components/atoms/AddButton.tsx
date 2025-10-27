import { PlusIcon } from "@/src/constants/icons";
import { ROUTES } from "@/src/constants/routes";
import { useRouter } from "next/navigation";

const AddButton = () => {
  const route = useRouter();
  const handleAddButton = () => {
    route.push(ROUTES.FINANCIAL);
  };
  return (
    <div className="relative">
      <button
        className="bg-yellow-400 rounded-full p-4 shadow-lg hover:scale-110 transition-transform duration-200 active:scale-95"
        onClick={handleAddButton}
      >
        <PlusIcon className="text-white w-6 h-6" />
      </button>
    </div>
  );
};

export default AddButton;
