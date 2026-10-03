"use client";

import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type ReactNode,
  type RefObject,
} from "react";
import { createPortal } from "react-dom";

type FloatingMenuProps = {
  isOpen: boolean;
  /** Elemento âncora (ex. o botão que abre o menu). */
  anchorRef: RefObject<HTMLElement | null>;
  align?: "left" | "right";
  /** Por omissão o menu fica com a largura da âncora. */
  matchWidth?: boolean;
  offset?: number;
  /** Mostra a pontinha estilo tooltip virada para a âncora. */
  pointer?: boolean;
  children: ReactNode;
};

const TRANSITION_MS = 150;

/**
 * Renderiza o conteúdo num portal acima de tudo (`position: fixed`),
 * ancorado ao elemento de referência — flutua por cima sem empurrar
 * nem ser cortado por contentores com scroll. Abre/fecha com
 * fade + escala suaves.
 */
export default function FloatingMenu({
  isOpen,
  anchorRef,
  align = "left",
  matchWidth = true,
  offset = 8,
  pointer = false,
  children,
}: FloatingMenuProps) {
  const contentRef = useRef<HTMLDivElement>(null);
  const closeTimer = useRef<number | null>(null);
  const [render, setRender] = useState(isOpen);
  const [shown, setShown] = useState(false);
  const [style, setStyle] = useState<{
    top: number;
    left?: number;
    right?: number;
    width?: number;
    caretEdgeOffset?: number;
  } | null>(null);

  useLayoutEffect(() => {
    if (!isOpen) {
      setStyle(null);
      return;
    }
    const update = () => {
      const anchor = anchorRef.current;
      if (!anchor) return;
      const rect = anchor.getBoundingClientRect();
      const menuHeight = contentRef.current?.offsetHeight ?? 0;
      const menuWidth = contentRef.current?.offsetWidth ?? 0;
      const spaceBelow = window.innerHeight - rect.bottom;
      const openUp =
        menuHeight > 0 &&
        spaceBelow < menuHeight + offset &&
        rect.top > spaceBelow;
      const width = matchWidth ? rect.width : undefined;
      const maxLeft = Math.max(
        8,
        window.innerWidth - (width ?? menuWidth) - 8,
      );
      const pos =
        align === "right"
          ? { right: Math.max(8, window.innerWidth - rect.right) }
          : { left: Math.min(Math.max(8, rect.left), maxLeft) };
      setStyle({
        ...pos,
        width,
        top: openUp
          ? Math.max(8, rect.top - menuHeight - offset)
          : rect.bottom + offset,
        caretEdgeOffset: Math.max(12, rect.width / 2 - 5),
      });
    };
    update();
    window.addEventListener("resize", update);
    window.addEventListener("scroll", update, true);
    return () => {
      window.removeEventListener("resize", update);
      window.removeEventListener("scroll", update, true);
    };
  }, [isOpen, anchorRef, align, matchWidth, offset, children, render]);

  useEffect(() => {
    if (closeTimer.current !== null) {
      window.clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
    if (isOpen) {
      setRender(true);
      const frame = requestAnimationFrame(() => setShown(true));
      return () => cancelAnimationFrame(frame);
    }
    setShown(false);
    closeTimer.current = window.setTimeout(() => {
      setRender(false);
      closeTimer.current = null;
    }, TRANSITION_MS);
    return () => {
      if (closeTimer.current !== null) {
        window.clearTimeout(closeTimer.current);
        closeTimer.current = null;
      }
    };
  }, [isOpen]);

  if (!render || typeof document === "undefined") return null;

  return createPortal(
    <div
      ref={contentRef}
      style={{
        position: "fixed",
        zIndex: 70,
        top: style?.top ?? -9999,
        left: style?.left,
        right: style?.right,
        width: style?.width,
        maxWidth: "calc(100vw - 16px)",
        visibility: style ? "visible" : "hidden",
      }}
      className={`transition-all duration-150 ease-out ${
        shown && style
          ? "scale-100 opacity-100"
          : "scale-95 opacity-0"
      } ${align === "right" ? "origin-top-right" : "origin-top-left"}`}
    >
      {pointer && style ? (
        <span
          aria-hidden="true"
          className="absolute -top-[5px] size-2.5 rotate-45 border-l border-t border-(--card-barras) bg-(--background)"
          style={
            align === "right"
              ? { right: style.caretEdgeOffset }
              : { left: style.caretEdgeOffset }
          }
        />
      ) : null}
      {children}
    </div>,
    document.body,
  );
}
