import { CategoryButtonProps } from "@/src/types/button";
import { PlusIcon } from "lucide-react";

const CategoryButton = ({ label, onClick }: CategoryButtonProps) => (

  <button
    onClick={onClick}
    className="flex items-center justify-center gap-2 w-full bg-[#FFD700] text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
    <div className=" bg-gray-100/40 rounded-2xl p-2">
      <PlusIcon className="w-6 h-6 rounded-2xl border-2 border-gray-100 text-gray-100" />
    </div>
    {label}
  </button>
);

export default CategoryButton