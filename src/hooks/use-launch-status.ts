"use client";

import { useMemo } from "react";
import { useCountdown } from "./use-countdown";

export const useLaunchStatus = () => {
  const launchDate = useMemo(() => new Date("2025-11-19T19:00:00"), []);
  const { isLaunched, isLoading } = useCountdown(launchDate);

  return {
    isLaunched,
    isLoading,
    launchDate,
  };
};
