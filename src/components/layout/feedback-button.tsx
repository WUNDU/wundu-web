"use client";

import { MessageCircle } from "lucide-react";

const FEEDBACK_URL = "https://tally.so/r/2E9KRA";

export default function FeedbackButton() {
  return (
    <a
      href={FEEDBACK_URL}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-full bg-slate-900 px-4 py-3 text-sm font-semibold text-white shadow-lg transition-all duration-200 hover:bg-slate-800 hover:shadow-xl hover:scale-105 active:scale-95"
      aria-label="Dar feedback"
    >
      <MessageCircle className="h-4 w-4" />
      <span className="hidden sm:inline">Feedback</span>
    </a>
  );
}
