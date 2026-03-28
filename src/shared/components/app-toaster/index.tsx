"use client";

import { Toaster } from "sonner";

const SuccessIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2.5}
    strokeLinecap="round"
    strokeLinejoin="round"
    className="h-4 w-4 text-green-600"
  >
    <path d="M20 6L9 17l-5-5" />
  </svg>
);

const ErrorIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2.5}
    strokeLinecap="round"
    strokeLinejoin="round"
    className="h-4 w-4 text-red-500"
  >
    <circle cx={12} cy={12} r={10} />
    <path d="M15 9l-6 6M9 9l6 6" />
  </svg>
);

const InfoIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2.5}
    strokeLinecap="round"
    strokeLinejoin="round"
    className="h-4 w-4 text-slate-700"
  >
    <circle cx={12} cy={12} r={10} />
    <path d="M12 16v-4M12 8h.01" />
  </svg>
);

const WarningIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2.5}
    strokeLinecap="round"
    strokeLinejoin="round"
    className="h-4 w-4 text-yellow-500"
  >
    <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
    <path d="M12 9v4M12 17h.01" />
  </svg>
);

const LoadingIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2.5}
    strokeLinecap="round"
    className="h-4 w-4 animate-spin text-slate-400"
  >
    <path d="M12 2a10 10 0 0 1 10 10" />
  </svg>
);

const AppToaster = () => {
  return (
    <Toaster
      position="top-right"
      closeButton
      gap={8}
      offset={20}
      icons={{
        success: <SuccessIcon />,
        error: <ErrorIcon />,
        info: <InfoIcon />,
        warning: <WarningIcon />,
        loading: <LoadingIcon />,
      }}
      toastOptions={{
        duration: 4000,
        unstyled: true,
        classNames: {
          /* ── Base container ── */
          toast: [
            "group relative flex w-full items-start gap-3",
            "overflow-hidden rounded-2xl border border-slate-200 bg-white",
            "px-4 py-3.5",
            "shadow-[0_2px_8px_rgba(0,0,0,0.04),0_8px_24px_rgba(0,0,0,0.06)]",
            "font-[var(--font-inter)] text-sm",
            "transition-all duration-200",
          ].join(" "),

          /* ── Type accents via left border ── */
          success: "border-l-[3px] border-l-green-500",
          error: "border-l-[3px] border-l-red-500",
          info: "border-l-[3px] border-l-slate-700",
          warning: "border-l-[3px] border-l-yellow-400",

          /* ── Inner structure ── */
          icon: "mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center",
          content: "flex flex-1 min-w-0 flex-col gap-0.5",
          title:
            "text-[13px] font-semibold leading-snug tracking-tight text-slate-900",
          description: "text-[11px] font-medium leading-relaxed text-slate-500",

          /* ── Actions ── */
          actionButton:
            "mt-2 inline-flex items-center rounded-xl bg-slate-900 px-3 py-1.5 text-[11px] font-bold text-white transition-colors hover:bg-slate-700 active:scale-[0.97]",
          cancelButton:
            "mt-2 inline-flex items-center rounded-xl bg-slate-100 px-3 py-1.5 text-[11px] font-bold text-slate-600 transition-colors hover:bg-slate-200 active:scale-[0.97]",

          /* ── Close button ── */
          closeButton: [
            "absolute right-3 top-3",
            "flex h-5 w-5 items-center justify-center",
            "rounded-full border border-slate-200 bg-white text-slate-400",
            "opacity-0 transition-all duration-150",
            "group-hover:opacity-100",
            "hover:border-slate-300 hover:bg-slate-100 hover:text-slate-700",
          ].join(" "),

          loader: "text-slate-400",
        },
      }}
    />
  );
};

export default AppToaster;
