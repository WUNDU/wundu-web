"use client";

import { useEffect, useRef, useState, useCallback, type ElementType } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import type { TutorialStep } from "@/types/dtos/tutorial.dto";

interface TutorialOverlayProps {
  step: TutorialStep;
  currentStepIndex: number;
  totalSteps: number;
  interactive?: boolean;
  onNext: () => void;
  onPrevious: () => void;
  onSkip: () => void;
}

interface SpotlightRect {
  top: number;
  left: number;
  width: number;
  height: number;
}

interface TooltipPosition {
  top: number;
  left: number;
  placement: "top" | "bottom" | "left" | "right";
}

const GAP = 12;
const VIEWPORT_PADDING = 16;

function clampToViewport(
  top: number,
  left: number,
  width: number,
  height: number
): { top: number; left: number } {
  const clampedTop = Math.max(VIEWPORT_PADDING, Math.min(top, window.innerHeight - height - VIEWPORT_PADDING));
  const clampedLeft = Math.max(VIEWPORT_PADDING, Math.min(left, window.innerWidth - width - VIEWPORT_PADDING));
  return { top: clampedTop, left: clampedLeft };
}

function calculateTooltipPosition(
  spotlight: SpotlightRect,
  placement: TutorialStep["placement"]
): TooltipPosition {
  const tooltipWidth = 320;
  const tooltipHeight = 180;

  let top = 0;
  let left = 0;
  let finalPlacement = placement ?? "bottom";

  switch (finalPlacement) {
    case "top":
      top = spotlight.top - tooltipHeight - GAP;
      left = spotlight.left + spotlight.width / 2 - tooltipWidth / 2;
      if (top < VIEWPORT_PADDING) {
        finalPlacement = "bottom";
        top = spotlight.top + spotlight.height + GAP;
      }
      break;
    case "bottom":
      top = spotlight.top + spotlight.height + GAP;
      left = spotlight.left + spotlight.width / 2 - tooltipWidth / 2;
      if (top + tooltipHeight > window.innerHeight - VIEWPORT_PADDING) {
        finalPlacement = "top";
        top = spotlight.top - tooltipHeight - GAP;
      }
      break;
    case "left":
      top = spotlight.top + spotlight.height / 2 - tooltipHeight / 2;
      left = spotlight.left - tooltipWidth - GAP;
      if (left < VIEWPORT_PADDING) {
        finalPlacement = "right";
        left = spotlight.left + spotlight.width + GAP;
      }
      break;
    case "right":
      top = spotlight.top + spotlight.height / 2 - tooltipHeight / 2;
      left = spotlight.left + spotlight.width + GAP;
      if (left + tooltipWidth > window.innerWidth - VIEWPORT_PADDING) {
        finalPlacement = "left";
        left = spotlight.left - tooltipWidth - GAP;
      }
      break;
  }

  const clamped = clampToViewport(top, left, tooltipWidth, tooltipHeight);

  return { ...clamped, placement: finalPlacement };
}

export function TutorialOverlay({
  step,
  currentStepIndex,
  totalSteps,
  interactive = false,
  onNext,
  onPrevious,
  onSkip,
}: TutorialOverlayProps) {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [spotlight, setSpotlight] = useState<SpotlightRect | null>(null);
  const [tooltipPos, setTooltipPos] = useState<TooltipPosition | null>(null);
  const retryCountRef = useRef(0);
  const maxRetries = 10;

  const updatePosition = useCallback(() => {
    const elements = document.querySelectorAll(step.targetSelector);
    let el: Element | null = null;

    for (const candidate of elements) {
      const rect = candidate.getBoundingClientRect();
      const style = window.getComputedStyle(candidate);
      if (
        rect.width > 0 &&
        rect.height > 0 &&
        style.display !== "none" &&
        style.visibility !== "hidden" &&
        style.opacity !== "0"
      ) {
        el = candidate;
        break;
      }
    }

    if (!el) {
      if (retryCountRef.current < maxRetries) {
        retryCountRef.current++;
        setTimeout(updatePosition, 100);
      }
      return;
    }

    retryCountRef.current = 0;
    const rect = el.getBoundingClientRect();
    const spotlightRect: SpotlightRect = {
      top: rect.top,
      left: rect.left,
      width: rect.width,
      height: rect.height,
    };

    // Scroll element into view if it's outside the viewport
    if (rect.top < 0 || rect.bottom > window.innerHeight || rect.left < 0 || rect.right > window.innerWidth) {
      el.scrollIntoView({ behavior: "smooth", block: "center", inline: "center" });
      // Recalculate after scroll
      requestAnimationFrame(() => {
        const newRect = el!.getBoundingClientRect();
        const newSpotlight: SpotlightRect = {
          top: newRect.top,
          left: newRect.left,
          width: newRect.width,
          height: newRect.height,
        };
        setSpotlight(newSpotlight);
        setTooltipPos(calculateTooltipPosition(newSpotlight, step.placement));
      });
      return;
    }

    setSpotlight(spotlightRect);
    setTooltipPos(calculateTooltipPosition(spotlightRect, step.placement));
  }, [step.targetSelector, step.placement]);

  useEffect(() => {
    retryCountRef.current = 0;
    updatePosition();
    buttonRef.current?.focus();

    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", updatePosition, true);

    return () => {
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition, true);
    };
  }, [updatePosition]);

  if (!spotlight || !tooltipPos) return null;

  const isFirst = currentStepIndex === 0;
  const isLast = currentStepIndex === totalSteps - 1;

  const tooltipArrowClass = {
    top: "bottom-0 left-1/2 -translate-x-1/2 translate-y-full",
    bottom: "top-0 left-1/2 -translate-x-1/2 -translate-y-full",
    left: "right-0 top-1/2 -translate-y-1/2 translate-x-full",
    right: "left-0 top-1/2 -translate-y-1/2 -translate-x-full",
  }[tooltipPos.placement];

  return (
    <div className="fixed inset-0 z-[200] pointer-events-none" role="dialog" aria-modal="true" aria-label="Tutorial">
      <div className="absolute inset-0 bg-black/50 pointer-events-none md:pointer-events-auto" onClick={onSkip} />

      <div
        className={`absolute z-10 rounded-lg border-2 border-[var(--color-brand-yellow)] pointer-events-none ${
          interactive ? "" : ""
        }`}
        style={{
          top: spotlight.top - 4,
          left: spotlight.left - 4,
          width: spotlight.width + 8,
          height: spotlight.height + 8,
        }}
      >
        <div className="absolute inset-0 animate-pulse-ring text-[var(--color-brand-yellow)]" />
      </div>

      <div
        className="absolute z-20 w-80 rounded-xl bg-white p-5 shadow-2xl animate-[tooltipIn_0.2s_ease-out] pointer-events-auto touch-pan-y"
        style={{ top: tooltipPos.top, left: tooltipPos.left, touchAction: "pan-y" }}
      >
        <div className={`absolute ${tooltipArrowClass}`}>
          <div className="h-3 w-3 rotate-45 bg-white" />
        </div>

        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {step.icon && (() => {
              const Icon = step.icon as ElementType;
              return (
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--color-brand-yellow)]/10">
                  <Icon size={20} className="text-[var(--color-brand-yellow-dark)]" />
                </div>
              );
            })()}
            <div>
              <h3 className="font-semibold text-gray-900">{step.title}</h3>
              <span className="text-xs text-gray-500">
                Passo {currentStepIndex + 1} de {totalSteps}
              </span>
            </div>
          </div>
          <button
            onClick={onSkip}
            className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
            aria-label="Fechar tutorial"
          >
            <X size={16} />
          </button>
        </div>

        <p className="mb-5 text-sm leading-relaxed text-gray-600">{step.text}</p>

        <div className="flex items-center justify-between">
          <div className="flex gap-1.5">
            {Array.from({ length: totalSteps }).map((_, i) => (
              <div
                key={i}
                className={`h-1.5 rounded-full transition-all ${
                  i === currentStepIndex
                    ? "w-6 bg-[var(--color-brand-yellow)]"
                    : i < currentStepIndex
                      ? "w-1.5 bg-[var(--color-brand-yellow)]/60"
                      : "w-1.5 bg-gray-200"
                }`}
              />
            ))}
          </div>

          <div className="flex gap-2">
            {!isFirst && (
              <button
                onClick={onPrevious}
                className="flex items-center gap-1 rounded-lg px-3 py-1.5 text-sm text-gray-600 transition-colors hover:bg-gray-100"
              >
                <ChevronLeft size={14} />
                Anterior
              </button>
            )}
            {isLast ? (
              <button
                ref={buttonRef}
                onClick={onNext}
                className="rounded-lg bg-[var(--color-brand-yellow)] px-4 py-1.5 text-sm font-medium text-gray-900 transition-colors hover:bg-[var(--color-brand-yellow-dark)]"
              >
                Concluir
              </button>
            ) : (
              <button
                ref={buttonRef}
                onClick={onNext}
                className="flex items-center gap-1 rounded-lg bg-[var(--color-brand-yellow)] px-4 py-1.5 text-sm font-medium text-gray-900 transition-colors hover:bg-[var(--color-brand-yellow-dark)]"
              >
                Próximo
                <ChevronRight size={14} />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
