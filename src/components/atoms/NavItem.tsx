import React from 'react';

interface NavItemProps {
  href: string;
  children: React.ReactNode;
}

const NavItem: React.FC<NavItemProps> = ({ href, children }) => {
  return (
    <a href={href} className="text-gray-700 hover:text-blue-900 transition-all duration-300 hover:scale-105">
      {children}
    </a>
  );
};

export default NavItem;