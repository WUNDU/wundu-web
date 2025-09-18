import { CategoryButtonProps } from "@/src/types/button";
import { PlusIcon } from "lucide-react";

const CategoryButton = ({ label, onClick }: CategoryButtonProps) => (
  <button
    onClick={onClick}
    className="flex items-center justify-center gap-2 w-full bg-[#FFD700] text-[#0F2045] font-bold py-4 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
    <PlusIcon className="w-6 h-6" />
    {label}
  </button>
);

export default CategoryButton