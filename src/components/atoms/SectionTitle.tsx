import React from 'react';

interface SectionTitleProps {
  children: React.ReactNode;
  className?: string;
}

const SectionTitle: React.FC<SectionTitleProps> = ({ children, className = '' }) => {
  return (
    <h2 className={`text-3xl md:text-4xl font-bold text-gray-900 ${className}`}>
      {children}
    </h2>
  );
};

export default SectionTitle;