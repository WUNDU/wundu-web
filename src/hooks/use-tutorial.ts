"use client";

import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import type { Tutorial, TutorialStep, TutorialState, UseTutorialReturn } from "@/types/dtos/tutorial.dto";

const STORAGE_PREFIX = "wundu_tutorial_";

function getCompletedFromStorage(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const keys = Object.keys(localStorage).filter((k) => k.startsWith(STORAGE_PREFIX));
    return keys.map((k) => k.replace(STORAGE_PREFIX, ""));
  } catch {
    return [];
  }
}

function markCompletedInStorage(tutorialId: string) {
  try {
    localStorage.setItem(`${STORAGE_PREFIX}${tutorialId}`, "completed");
  } catch {}
}

function removeCompletedFromStorage(tutorialId: string) {
  try {
    localStorage.removeItem(`${STORAGE_PREFIX}${tutorialId}`);
  } catch {}
}

export function useTutorial(tutorials: Tutorial[]): UseTutorialReturn {
  const [state, setState] = useState<TutorialState>({
    isActive: false,
    activeTutorialId: null,
    currentStepIndex: 0,
    completedTutorials: [],
  });

  const [isLoaded, setIsLoaded] = useState(false);
  const scrollLockRef = useRef<{ wheel: (e: Event) => void; touchmove: (e: Event) => void } | null>(null);

  const activeTutorial = tutorials.find((t) => t.id === state.activeTutorialId) ?? null;

  const currentStep: TutorialStep | null = activeTutorial?.steps[state.currentStepIndex] ?? null;

  const isCompleted = useCallback(
    (tutorialId: string) => state.completedTutorials.includes(tutorialId),
    [state.completedTutorials]
  );

  const lockScroll = useCallback(() => {
    if (typeof window === "undefined") return;

    const wheelHandler = (e: Event) => e.preventDefault();
    const touchmoveHandler = (e: Event) => e.preventDefault();

    window.addEventListener("wheel", wheelHandler, { passive: false });
    window.addEventListener("touchmove", touchmoveHandler, { passive: false });

    scrollLockRef.current = { wheel: wheelHandler, touchmove: touchmoveHandler };
  }, []);

  const unlockScroll = useCallback(() => {
    if (scrollLockRef.current) {
      window.removeEventListener("wheel", scrollLockRef.current.wheel);
      window.removeEventListener("touchmove", scrollLockRef.current.touchmove);
      scrollLockRef.current = null;
    }
  }, []);

  const scrollToElement = useCallback((selector: string) => {
    const el = document.querySelector(selector);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, []);

  const start = useCallback(
    (tutorialId: string) => {
      const tutorial = tutorials.find((t) => t.id === tutorialId);
      if (!tutorial) return;

      setState((prev) => ({
        ...prev,
        isActive: true,
        activeTutorialId: tutorialId,
        currentStepIndex: 0,
      }));

      if (tutorial.delay) {
        setTimeout(() => {
          scrollToElement(tutorial.steps[0].targetSelector);
        }, tutorial.delay);
      } else {
        scrollToElement(tutorial.steps[0].targetSelector);
      }

      lockScroll();
    },
    [tutorials, lockScroll, scrollToElement]
  );

  const stop = useCallback(() => {
    setState((prev) => ({
      ...prev,
      isActive: false,
      activeTutorialId: null,
      currentStepIndex: 0,
    }));
    unlockScroll();
  }, [unlockScroll]);

  const markCompleted = useCallback(
    (tutorialId: string) => {
      const tutorial = tutorials.find((t) => t.id === tutorialId);
      if (tutorial?.showOnce) {
        markCompletedInStorage(tutorialId);
      }

      setState((prev) => ({
        ...prev,
        completedTutorials: prev.completedTutorials.includes(tutorialId)
          ? prev.completedTutorials
          : [...prev.completedTutorials, tutorialId],
      }));
    },
    [tutorials]
  );

  const next = useCallback(() => {
    if (!activeTutorial) return;

    const nextIndex = state.currentStepIndex + 1;

    if (nextIndex >= activeTutorial.steps.length) {
      markCompleted(activeTutorial.id);
      stop();
      return;
    }

    setState((prev) => ({
      ...prev,
      currentStepIndex: nextIndex,
    }));

    scrollToElement(activeTutorial.steps[nextIndex].targetSelector);
  }, [activeTutorial, state.currentStepIndex, markCompleted, stop, scrollToElement]);

  const previous = useCallback(() => {
    if (!activeTutorial || state.currentStepIndex === 0) return;

    const prevIndex = state.currentStepIndex - 1;

    setState((prev) => ({
      ...prev,
      currentStepIndex: prevIndex,
    }));

    scrollToElement(activeTutorial.steps[prevIndex].targetSelector);
  }, [activeTutorial, state.currentStepIndex, scrollToElement]);

  const skip = useCallback(() => {
    if (!activeTutorial) return;
    markCompleted(activeTutorial.id);
    stop();
  }, [activeTutorial, markCompleted, stop]);

  const reset = useCallback(
    (tutorialId: string) => {
      removeCompletedFromStorage(tutorialId);
      setState((prev) => ({
        ...prev,
        completedTutorials: prev.completedTutorials.filter((id) => id !== tutorialId),
      }));
    },
    []
  );

  useEffect(() => {
    const completed = getCompletedFromStorage();
    setState((prev) => ({
      ...prev,
      completedTutorials: [...new Set([...prev.completedTutorials, ...completed])],
    }));
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (!state.isActive) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case "Escape":
          stop();
          break;
        case "ArrowRight":
        case "Enter":
          next();
          break;
        case "ArrowLeft":
          previous();
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [state.isActive, stop, next, previous]);

  useEffect(() => {
    return () => unlockScroll();
  }, [unlockScroll]);

  const returnValue = useMemo(() => ({
    state,
    activeTutorial,
    currentStep,
    start,
    stop,
    next,
    previous,
    skip,
    isCompleted,
    reset,
    isLoaded,
  }), [state, activeTutorial, currentStep, start, stop, next, previous, skip, isCompleted, reset, isLoaded]);

  return returnValue;
}
