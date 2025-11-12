"use client";

import { useCallback, useState } from "react";

export const useSidebar = (initialLeftOpen = true, initialRightOpen = false) => {
  const [isLeftOpen, setIsLeftOpen] = useState<boolean>(initialLeftOpen);
  const [isRightOpen, setIsRightOpen] = useState<boolean>(initialRightOpen);

  const toggleLeft = useCallback(() => setIsLeftOpen((v) => !v), []);
  const openLeft = useCallback(() => setIsLeftOpen(true), []);
  const closeLeft = useCallback(() => setIsLeftOpen(false), []);

  const toggleRight = useCallback(() => setIsRightOpen((v) => !v), []);
  const openRight = useCallback(() => setIsRightOpen(true), []);
  const closeRight = useCallback(() => setIsRightOpen(false), []);

  return {
    isLeftOpen,
    isRightOpen,
    toggleLeft,
    openLeft,
    closeLeft,
    toggleRight,
    openRight,
    closeRight,
  };
};
