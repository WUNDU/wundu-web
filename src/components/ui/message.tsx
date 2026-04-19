import { IAIcon } from "@/constants/icons";
import React from "react";

// ─── Inline markdown: **bold**, *italic*, `code` ──────────────────────────────
function renderInline(text: string): React.ReactNode[] {
  const parts = text.split(/(\*\*[^*\n]+\*\*|\*[^*\n]+\*|`[^`\n]+`)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**") && part.length > 4) {
      return (
        <strong key={i} className="font-semibold text-slate-900">
          {part.slice(2, -2)}
        </strong>
      );
    }
    if (part.startsWith("`") && part.endsWith("`") && part.length > 2) {
      return (
        <code key={i} className="px-1 rounded bg-slate-100 font-mono text-[12px] text-slate-700">
          {part.slice(1, -1)}
        </code>
      );
    }
    if (part.startsWith("*") && part.endsWith("*") && part.length > 2) {
      return <em key={i}>{part.slice(1, -1)}</em>;
    }
    // Strip orphaned ** that didn't match any pattern
    return <React.Fragment key={i}>{part.replace(/\*\*/g, "")}</React.Fragment>;
  });
}

// ─── Full markdown block renderer ────────────────────────────────────────────
function MarkdownContent({ text }: { text: string }) {
  const lines = text.split("\n");
  return (
    <div className="text-sm leading-relaxed">
      {lines.map((line, i) => {
        if (line === "") return <div key={i} className="h-2" />;
        if (line === "---" || line === "___") {
          return <hr key={i} className="border-slate-200 my-2" />;
        }

        // Headings: ###, ##, #
        const h3 = line.match(/^###\s+(.+)$/);
        const h2 = line.match(/^##\s+(.+)$/);
        const h1 = line.match(/^#\s+(.+)$/);
        if (h3) {
          return (
            <div key={i} className="font-bold text-[#003cc3] text-[13px] mt-3 mb-1 first:mt-0">
              {renderInline(h3[1])}
            </div>
          );
        }
        if (h2 || h1) {
          const content = (h2 ?? h1)![1];
          return (
            <div key={i} className="font-bold text-slate-900 text-sm mt-3 mb-1 first:mt-0">
              {renderInline(content)}
            </div>
          );
        }

        // Numbered list: 1. 2. 3. …
        const numMatch = line.match(/^(\d+)[.)]\s+(.+)$/);
        if (numMatch) {
          return (
            <div key={i} className="flex gap-2 items-baseline mt-0.5">
              <span className="text-[#003cc3] text-xs font-bold flex-shrink-0 min-w-[18px]">
                {numMatch[1]}.
              </span>
              <span className="text-slate-800">{renderInline(numMatch[2])}</span>
            </div>
          );
        }

        // Bullet list: - or •
        if (line.startsWith("- ") || line.startsWith("• ")) {
          const content = line.slice(2);
          return (
            <div key={i} className="flex gap-2 items-baseline mt-0.5">
              <span className="text-[#003cc3] flex-shrink-0 select-none font-bold text-xs">
                •
              </span>
              <span className="text-slate-800">{renderInline(content)}</span>
            </div>
          );
        }

        // Regular paragraph
        return (
          <div key={i} className="text-slate-800 mt-0.5 first:mt-0">
            {renderInline(line)}
          </div>
        );
      })}
    </div>
  );
}

// ─── Typing animation — renders markdown live as characters arrive ────────────
function TypingText({ text, onComplete }: { text: string; onComplete?: () => void }) {
  const [charCount, setCharCount] = React.useState(0);
  const onCompleteRef = React.useRef(onComplete);
  onCompleteRef.current = onComplete;

  React.useEffect(() => {
    setCharCount(0);
    let i = 0;
    const timer = setInterval(() => {
      i++;
      setCharCount(i);
      if (i >= text.length) {
        clearInterval(timer);
        onCompleteRef.current?.();
      }
    }, 14);
    return () => clearInterval(timer);
  }, [text]);

  const done = charCount >= text.length;
  const partial = done ? text : text.slice(0, charCount);

  return (
    <div>
      <MarkdownContent text={partial} />
      {!done && (
        <span className="inline-block w-[2px] h-[14px] bg-slate-400 ml-0.5 align-middle animate-pulse" />
      )}
    </div>
  );
}

// ─── Message bubble ───────────────────────────────────────────────────────────
const Message: React.FC<{
  text: string;
  isUser: boolean;
  isTyping?: boolean;
  onTypingComplete?: () => void;
}> = ({ text, isUser, isTyping, onTypingComplete }) => {
  if (isUser) {
    return (
      <div className="flex justify-end items-end gap-2.5 mb-3">
        <div className="bg-gradient-to-br from-[#003cc3] to-[#001a66] px-4 py-3 rounded-2xl rounded-br-sm max-w-[72%] shadow-sm">
          <p className="text-sm text-white leading-relaxed whitespace-pre-wrap">{text}</p>
        </div>
        <div className="w-8 h-8 flex-shrink-0 rounded-full bg-slate-200 flex items-center justify-center text-slate-500">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
          </svg>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-start gap-2.5 mb-3">
      <div className="w-8 h-8 flex-shrink-0 rounded-[10px] bg-gradient-to-br from-[#003cc3] to-[#001a66] flex items-center justify-center shadow-sm">
        <IAIcon className="w-4 h-4 text-white" />
      </div>
      <div className="bg-white px-4 py-3 rounded-2xl rounded-bl-sm max-w-[72%] shadow-[0_2px_8px_rgba(0,60,195,0.08)] border border-slate-100">
        {isTyping ? (
          <TypingText text={text} onComplete={onTypingComplete} />
        ) : (
          <MarkdownContent text={text} />
        )}
      </div>
    </div>
  );
};

export default Message;
