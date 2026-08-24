"use client";

import { useState, useCallback } from "react";
import Sidebar from "@/components/layout/sidebar";
import TopBar from "@/components/layout/top-bar";
import SidebarRight from "@/components/layout/sidebar-right";
import FeedbackButton from "@/components/layout/feedback-button";

export default function HomeDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [rightOpen, setRightOpen] = useState(false);

  const handleToggleSidebar = useCallback(() => {
    if (typeof window !== "undefined" && window.innerWidth < 1024) {
      setMobileOpen((v) => !v);
    } else {
      setCollapsed((v) => !v);
    }
  }, []);

  const handleCloseMobile = useCallback(() => {
    setMobileOpen(false);
  }, []);

  return (
    <div className="app-viewport flex overflow-hidden bg-slate-100">
      <Sidebar
        collapsed={collapsed}
        mobileOpen={mobileOpen}
        onCloseMobile={handleCloseMobile}
      />

      <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
        <TopBar
          onToggleSidebar={handleToggleSidebar}
          onOpenProfile={() => setRightOpen(true)}
        />
        <main className="relative min-h-0 flex-1 overflow-hidden bg-slate-100">
          <div className="pointer-events-none absolute left-0 right-0 top-0 h-32 bg-gradient-to-b from-secondary/[0.02] to-transparent" />
          <div className="relative mx-auto flex h-full min-h-0 w-full max-w-[1280px] flex-col px-2 py-2 sm:px-3 sm:py-3 lg:px-4 lg:py-4">
            <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain touch-pan-y [-webkit-overflow-scrolling:touch]" style={{ touchAction: "pan-y" }}>{children}</div>
          </div>
        </main>
      </div>

      <SidebarRight isOpen={rightOpen} onClose={() => setRightOpen(false)} />
      <FeedbackButton />
    </div>
  );
}
