import { CategoryButtonProps } from "@/src/types/button";
import Plus from "../icons/Plus";

const CategoryButton = ({ label }: CategoryButtonProps) => (
  <button className="flex items-center justify-center gap-2 w-full bg-[#FFD700] text-[#0F2045] font-bold py-4 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
    <Plus className="w-6 h-6" />
    {label}
  </button>
);

export default CategoryButton