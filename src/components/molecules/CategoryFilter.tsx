import React from "react";
import { CategoryFilterProps } from "@/src/types/category";
import Button from "../atoms/Button";

const CategoryFilter: React.FC<CategoryFilterProps> = ({
  categories,
  activeCategory,
  onCategoryChange,
}) => {
  return (
    <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
      {categories.map((category) => (
        <Button
          key={category}
          label={category}
          active={activeCategory === category}
          onClick={() => onCategoryChange(category)}
        />
      ))}
    </div>
  );
};

export default CategoryFilter;
