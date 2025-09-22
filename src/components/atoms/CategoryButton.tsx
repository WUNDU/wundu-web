import React from 'react';

interface CategoryButtonProps {
  label: string;
  isActive: boolean;
  onClick: () => void;
}

const CategoryButton: React.FC<CategoryButtonProps> = ({ label, isActive, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 whitespace-nowrap ${isActive
        ? 'bg-black text-white'
        : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-200'
        }`}
    >
      {label}
    </button>
  );
};

export default CategoryButton;