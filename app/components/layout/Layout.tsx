"use client";

import { useState } from "react";
import type { ReactNode } from "react";
import Menu from "./Menu";
import TopBar from "./TopBar";
import BottomNav from "./BottomNav";

type LayoutProps = {
  children: ReactNode;
  className?: string;
};

export default function Layout({ children, className }: LayoutProps) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-(--bg-body)">
      <Menu
        collapsed={collapsed}
        onToggle={() => setCollapsed((value) => !value)}
        className="max-lg:hidden"
      />
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <TopBar
          collapsed={collapsed}
          onToggleMenu={() => setCollapsed((value) => !value)}
        />
        <main
          className={["min-h-0 flex-1 overflow-auto", className]
            .filter(Boolean)
            .join(" ")}
        >
          <div className="h-full min-h-full">
            {children}
          </div>
        </main>
        <BottomNav />
      </div>
    </div>
  );
}
