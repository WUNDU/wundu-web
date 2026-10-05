"use client";

import {
  Children,
  useRef,
  useState,
  type ReactNode,
  type UIEvent,
} from "react";

const SLIDE_GAP = 12;

export default function AnalysisCarousel({
  children,
  label,
  className,
}: {
  children: ReactNode;
  label: string;
  className?: string;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const slides = Children.toArray(children);
  const count = slides.length;

  function handleScroll(event: UIEvent<HTMLDivElement>) {
    const track = trackRef.current;
    if (!track || count === 0) return;
    const width = track.clientWidth + SLIDE_GAP;
    const next = Math.round(event.currentTarget.scrollLeft / width);
    setIndex(Math.min(count - 1, Math.max(0, next)));
  }

  if (count === 0) return null;

  return (
    <div className={["flex flex-col items-stretch gap-3", className].filter(Boolean).join(" ")} role="group" aria-label={label}>
      <div
        ref={trackRef}
        onScroll={handleScroll}
        className="flex snap-x snap-mandatory gap-3 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {slides.map((slide, slideIndex) => (
          <div key={slideIndex} className="min-w-full snap-center">
            {slide}
          </div>
        ))}
      </div>
      <div
        className="flex items-center justify-start gap-1.5 overflow-hidden"
        aria-hidden="true"
      >
        {slides.map((_, dotIndex) => (
          <span
            key={dotIndex}
            className={
              dotIndex === index
                ? "h-1.5 w-5 rounded-[3px] bg-primary-300"
                : "size-1.5 rounded-[3px] bg-(--text-description)"
            }
          />
        ))}
      </div>
    </div>
  );
}
