import React from 'react';
import CategoryButton from '../atoms/CategoryButton';
import { CategoryFilterProps } from '@/src/types/category';

const CategoryFilter: React.FC<CategoryFilterProps> = ({
  categories,
  activeCategory,
  onCategoryChange
}) => {
  return (
    <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
      {categories.map((category) => (
        <CategoryButton
          key={category}
          label={category}
          isActive={activeCategory === category}
          onClick={() => onCategoryChange(category)}
        />
      ))}
    </div>
  );
};

export default CategoryFilter;
