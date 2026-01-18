"use client";

import { useState } from "react";

export const useChatScreen = () => {
  const [showChat, setShowChat] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);
  const [isSidebarRightOpen, setIsSidebarRightOpen] = useState<boolean>(false);

  const toggleSidebar = () => setIsSidebarOpen((v) => !v);
  const toggleSidebarRight = () => setIsSidebarRightOpen((v) => !v);

  const prev = () => setShowChat(false);

  return {
    showChat,
    setShowChat,
    isSidebarOpen,
    isSidebarRightOpen,
    toggleSidebar,
    toggleSidebarRight,
    prev,
  };
};
