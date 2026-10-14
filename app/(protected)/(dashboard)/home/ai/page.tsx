"use client";

import WunduAI from "app/components/ai/WunduAI";

export default function AiPage() {
  return (
    <div className="flex h-full min-h-0 flex-1 flex-col bg-(--bg-card) px-0 lg:px-8 lg:py-6">
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden lg:rounded-2xl lg:border lg:border-(--card-barras)">
        <WunduAI />
      </div>
    </div>
  );
}
