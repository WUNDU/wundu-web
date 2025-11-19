"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BottomNavItemProps } from "@/types/bottom";

const BottomNavItem = ({ icon, label, href }: BottomNavItemProps) => {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link href={href}>
      <div className="flex min-w-[64px] flex-col items-center gap-1 text-center">
        <div
          className={`flex h-10 w-10 items-center justify-center rounded-2xl border transition-all duration-200 ${
            isActive
              ? "bg-slate-900 text-white border-slate-900 shadow-lg"
              : "bg-white/80 text-slate-500 border-transparent"
          }`}
        >
          {React.cloneElement(icon as React.ReactElement)}
        </div>
        <span
          className={`text-[11px] font-semibold leading-tight tracking-wide ${
            isActive ? "text-slate-900" : "text-slate-500"
          }`}
        >
          {label}
        </span>
      </div>
    </Link>
  );
};

export default BottomNavItem;
