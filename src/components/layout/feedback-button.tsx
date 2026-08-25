"use client";

import { MessageCircle } from "lucide-react";

const FEEDBACK_URL = "https://tally.so/r/2E9KRA";

export default function FeedbackButton() {
  return (
    <a
      href={FEEDBACK_URL}
      target="_blank"
      rel="noopener noreferrer"
      className="group fixed bottom-6 right-6 z-50"
      aria-label="Dar feedback"
    >
      <span className="absolute inset-0 animate-ping rounded-full bg-yellow-400 opacity-30" />
      <span className="relative flex items-center gap-2 rounded-full bg-slate-900 px-4 py-3 text-sm font-semibold text-white shadow-lg transition-all duration-200 group-hover:bg-slate-800 group-hover:shadow-xl group-hover:scale-105 group-active:scale-95">
        <MessageCircle className="h-4 w-4" />
        <span className="hidden sm:inline">Feedback</span>
      </span>
    </a>
  );
}
