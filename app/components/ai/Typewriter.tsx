"use client";

import { useEffect, useState } from "react";

export type TypewriterProps = {
  words: string[];
  speed?: number;
  delayBetweenWords?: number;
  cursor?: boolean;
  cursorChar?: string;
  loop?: boolean;
  onComplete?: () => void;
};

function prefersReducedMotion() {
  if (typeof window === "undefined" || !window.matchMedia) return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function Typewriter({
  words,
  speed = 100,
  delayBetweenWords = 2000,
  cursor = true,
  cursorChar = "|",
  loop = true,
  onComplete,
}: TypewriterProps) {
  const [state, setState] = useState({ word: 0, char: 0, deleting: false });
  const current = words[state.word % Math.max(1, words.length)] || "";
  const complete = !loop && state.char >= current.length;

  useEffect(() => {
    if (!words.length) return;
    if (prefersReducedMotion() || complete) {
      onComplete?.();
      return;
    }
    const atEnd = !state.deleting && state.char >= current.length;
    const timeout = setTimeout(
      () => {
        if (atEnd) setState((s) => ({ ...s, deleting: true }));
        else if (state.deleting && state.char === 0)
          setState((s) => ({
            word: (s.word + 1) % words.length,
            char: 0,
            deleting: false,
          }));
        else setState((s) => ({ ...s, char: s.char + (s.deleting ? -1 : 1) }));
      },
      atEnd ? Math.max(0, delayBetweenWords) : Math.max(1, state.deleting ? speed / 2 : speed),
    );
    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state, current, words.length, speed, delayBetweenWords, complete]);

  return (
    <span className="inline-block whitespace-pre-wrap">
      {prefersReducedMotion() ? current : current.substring(0, state.char)}
      {cursor && !complete && (
        <span className="wundu-typewriter-cursor ml-1" aria-hidden="true">
          {cursorChar}
        </span>
      )}
    </span>
  );
}
