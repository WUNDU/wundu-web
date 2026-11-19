"use client";

import React from "react";

/* Inline: **bold**, *italic*, `code` — só React elements (sem HTML injectado). */
function renderInline(text: string): React.ReactNode[] {
  const parts = text.split(/(\*\*[^*\n]+\*\*|\*[^*\n]+\*|`[^`\n]+`)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**") && part.length > 4) {
      return <strong key={i}>{part.slice(2, -2)}</strong>;
    }
    if (part.startsWith("`") && part.endsWith("`") && part.length > 2) {
      return <code key={i}>{part.slice(1, -1)}</code>;
    }
    if (part.startsWith("*") && part.endsWith("*") && part.length > 2) {
      return <em key={i}>{part.slice(1, -1)}</em>;
    }
    return <React.Fragment key={i}>{part.replace(/\*\*/g, "")}</React.Fragment>;
  });
}

/**
 * Markdown do subconjunto usado pela IA (### títulos, listas -/1., **bold**).
 * Estilos em `.ai-md` (wundu-ai.css) com os tokens do tema + ritmo justo.
 */
export function MarkdownContent({ text }: { text: string }) {
  const lines = text.split("\n");
  return (
    <div className="ai-md">
      {lines.map((line, i) => {
        if (line.trim() === "") return <div key={i} className="ai-md-gap" aria-hidden="true" />;
        if (line.trim() === "---" || line.trim() === "___") {
          return <hr key={i} className="ai-md-hr" />;
        }
        const h3 = line.match(/^###\s+(.+)$/);
        const h2 = line.match(/^##\s+(.+)$/);
        const h1 = line.match(/^#\s+(.+)$/);
        if (h3) {
          return (
            <div key={i} className="ai-md-h3">
              {renderInline(h3[1])}
            </div>
          );
        }
        if (h2 || h1) {
          return (
            <div key={i} className="ai-md-h2">
              {renderInline((h2 ?? h1)![1])}
            </div>
          );
        }
        const numMatch = line.match(/^(\d+)[.)]\s+(.+)$/);
        if (numMatch) {
          return (
            <div key={i} className="ai-md-li">
              <span className="ai-md-num">{numMatch[1]}.</span>
              <span>{renderInline(numMatch[2])}</span>
            </div>
          );
        }
        if (line.startsWith("- ") || line.startsWith("• ")) {
          return (
            <div key={i} className="ai-md-li">
              <span className="ai-md-dot" aria-hidden="true">
                •
              </span>
              <span>{renderInline(line.slice(2))}</span>
            </div>
          );
        }
        return (
          <div key={i} className="ai-md-p">
            {renderInline(line)}
          </div>
        );
      })}
    </div>
  );
}
