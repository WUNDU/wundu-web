import type { ComponentType } from "react";

export interface TutorialStep {
  id: string;
  title: string;
  text: string;
  targetSelector: string;
  placement?: "top" | "bottom" | "left" | "right";
  icon?: ComponentType<{ size?: number; className?: string }>;
}

export interface Tutorial {
  id: string;
  name: string;
  description?: string;
  steps: TutorialStep[];
  delay?: number;
  showOnce?: boolean;
}

export interface TutorialState {
  isActive: boolean;
  activeTutorialId: string | null;
  currentStepIndex: number;
  completedTutorials: string[];
}

export interface UseTutorialReturn {
  state: TutorialState;
  activeTutorial: Tutorial | null;
  currentStep: TutorialStep | null;
  start: (tutorialId: string) => void;
  stop: () => void;
  next: () => void;
  previous: () => void;
  skip: () => void;
  isCompleted: (tutorialId: string) => boolean;
  reset: (tutorialId: string) => void;
  isLoaded: boolean;
}
