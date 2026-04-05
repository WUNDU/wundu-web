"use client";

export function Ring({ pct, done }: { pct: number; done: boolean }) {
  const r = 16;
  const c = 2 * Math.PI * r;
  const trackColor = "rgba(15,23,42,0.08)";
  const ringColor = done ? "#10b981" : "#003cc3";

  return (
    <svg width={40} height={40} viewBox="0 0 40 40" className="-rotate-90 flex-shrink-0">
      <circle cx={20} cy={20} r={r} strokeWidth={3.5} stroke={trackColor} fill="none" />
      <circle
        cx={20} cy={20} r={r}
        strokeWidth={3.5}
        strokeLinecap="round"
        stroke={ringColor}
        fill="none"
        style={{
          strokeDasharray: c,
          strokeDashoffset: c - (pct / 100) * c,
          transition: "stroke-dashoffset 1s cubic-bezier(0.22,1,0.36,1)",
        }}
      />
    </svg>
  );
}
