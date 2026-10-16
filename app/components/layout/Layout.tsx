"use client";

import { useState } from "react";
import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import Menu from "./Menu";
import TopBar from "./TopBar";
import BottomNav from "./BottomNav";
import CategoryActionProvider from "./CategoryActionProvider";
import TransactionActionProvider from "./TransactionActionProvider";

type LayoutProps = {
  children: ReactNode;
  className?: string;
};

export default function Layout({ children, className }: LayoutProps) {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname() ?? "";
  // Na Wundu IA o workspace traz o próprio header (como no protótipo):
  // TopBar e BottomNav escondem-se para o chat ocupar o ecrã.
  const isAi = pathname === "/home/ai" || pathname.startsWith("/home/ai/");

  return (
    <div className="flex h-screen overflow-hidden bg-(--bg-body)">
      <Menu
        collapsed={collapsed}
        onToggle={() => setCollapsed((value) => !value)}
        className="max-lg:hidden"
      />
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        {!isAi && (
          <TopBar
            collapsed={collapsed}
            onToggleMenu={() => setCollapsed((value) => !value)}
          />
        )}
        <main
          className={["min-h-0 flex-1 overflow-auto max-lg:bg-(--bg-card)", className]
            .filter(Boolean)
            .join(" ")}
        >
          <CategoryActionProvider>
            <TransactionActionProvider>
              <div className="h-full min-h-full">{children}</div>
            </TransactionActionProvider>
          </CategoryActionProvider>
        </main>
        {!isAi && <BottomNav />}
      </div>
    </div>
  );
}
