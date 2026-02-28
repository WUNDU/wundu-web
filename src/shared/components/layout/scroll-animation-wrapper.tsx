"use client";

import React, { useRef, useEffect, useState } from "react";

interface ScrollAnimationWrapperProps {
  children: React.ReactNode;
  className?: string;
  animation?: string;
  duration?: number;
  delay?: number;
}

export default function ScrollAnimationWrapper({
  children,
  className = "",
  animation = "animate-in fade-in slide-in-from-bottom-8",
  duration = 700,
  delay = 0,
}: ScrollAnimationWrapperProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`${className} ${
        isVisible ? animation : "opacity-0"
      } transition-all ease-out`}
      style={{
        transitionDuration: `${duration}ms`,
        transitionDelay: `${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}
