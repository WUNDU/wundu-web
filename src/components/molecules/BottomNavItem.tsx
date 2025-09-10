'use client'
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BottomNavItemProps } from '@/src/types/bottom';

const BottomNavItem = ({ icon, label, href }: BottomNavItemProps) => {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link href={href}>
      <div
        className={`flex flex-col items-center transition-all duration-200 ${isActive ? 'text-yellow-400 scale-130' : 'text-gray-600'
          } hover:text-yellow-400 hover:scale-105`}
      >
        <div className={`${isActive ? 'text-yellow-400' : 'text-gray-600'} w-6 h-6`}>
          {React.cloneElement(icon as React.ReactElement)}
        </div>
        <span className="text-xs mt-1">{label}</span>
      </div>
    </Link>
  );
};

export default BottomNavItem;