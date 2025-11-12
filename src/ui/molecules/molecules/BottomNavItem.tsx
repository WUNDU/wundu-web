"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BottomNavItemProps } from "@/src/types/bottom";

const BottomNavItem = ({ icon, label, href }: BottomNavItemProps) => {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link href={href}>
      <div
        className={`flex flex-col items-center transition-all duration-200 ${
          isActive ? "text-gray-600" : "text-gray-600"
        } hover:text-yellow-400 hover:scale-105`}
      >
        <div
          className={`${
            isActive ? "text-yellow-400" : "text-gray-600"
          } w-6 h-6`}
        >
          {/* O ícone agora recebe a classe CSS que define a cor */}
          {React.cloneElement(icon as React.ReactElement)}
        </div>
        <span className="text-xs mt-1">{label}</span>
      </div>
    </Link>
  );
};

export default BottomNavItem;
