"use client";

import { useEffect, useRef, useState } from "react";
import { DsIcon, DsIconTile } from "./ds";

const E = "cubic-bezier(.2,.8,.2,1)";
const IN = "cubic-bezier(.5,0,.9,.4)";
const SPRING = "cubic-bezier(.3,1.45,.55,1)";

const SLIDES = [
  {
    icon: "wallet",
    title: "Todas as tuas contas num só lugar",
    text: "Junta as contas do BAI, BFA, Banco Sol e Atlântico e acompanha o teu património em Kwanza.",
  },
  {
    icon: "target",
    title: "Metas que avançam contigo",
    text: "Define quanto queres poupar e até quando. O progresso actualiza a cada movimento registado.",
  },
  {
    icon: "sparkles",
    title: "A Wundu AI lê os teus gastos",
    text: "Recebe análises sobre onde o teu dinheiro foi gasto e o que isso significa para o fim do mês.",
  },
];

function Badge({
  bg,
  fg,
  children,
}: {
  bg: string;
  fg: string;
  children: string;
}) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        height: 24,
        padding: "0 10px",
        borderRadius: 999,
        fontSize: 12,
        fontWeight: 600,
        background: bg,
        color: fg,
        whiteSpace: "nowrap",
      }}
    >
      {children}
    </span>
  );
}

function MiniBar({ value, color, height }: { value: number; color: string; height: number }) {
  return (
    <div
      role="progressbar"
      aria-valuenow={value}
      style={{ width: "100%", height, background: "var(--surface-track)", borderRadius: 999, overflow: "hidden" }}
    >
      <div style={{ width: `${value}%`, height: "100%", background: color, borderRadius: 999 }} />
    </div>
  );
}

function cardStyle(extra?: React.CSSProperties): React.CSSProperties {
  return {
    background: "var(--surface-card)",
    border: "1px solid var(--border-subtle)",
    borderRadius: 14,
    ...extra,
  };
}

function HeroA() {
  return (
    <div style={{ position: "relative", width: "100%", maxWidth: 340, display: "flex", flexDirection: "column", gap: 14 }} className="wa-panel-hero">
      <div style={{ ...cardStyle({ padding: 18, display: "flex", flexDirection: "column", gap: 14 }), transform: "rotate(-3deg)" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ fontSize: 12, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--text-tertiary)" }}>
            Património líquido
          </span>
          <DsIconTile icon="wallet" tone="brand" size="sm" />
        </div>
        <span style={{ fontSize: 26, fontWeight: 700, letterSpacing: "-0.02em", fontVariantNumeric: "tabular-nums" }}>
          5.120.000,00 Kz
        </span>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          <Badge bg="var(--cat-7-tint)" fg="var(--on-soft-brand)">BAI</Badge>
          <Badge bg="var(--cat-3-tint)" fg="var(--cat-3)">BFA</Badge>
          <Badge bg="var(--cat-4-tint)" fg="var(--tone-gold)">SOL</Badge>
          <Badge bg="var(--cat-5-tint)" fg="var(--cat-5)">Atlântico</Badge>
        </div>
      </div>
      <div style={{ ...cardStyle({ padding: "12px 14px", display: "flex", alignItems: "center", gap: 12 }), marginLeft: 40, transform: "rotate(2deg)" }}>
        <DsIconTile icon="arrow-down" tone="in" />
        <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column" }}>
          <span style={{ fontSize: 14, fontWeight: 600 }}>Salário</span>
          <span style={{ fontSize: 12, color: "var(--text-secondary)" }}>BAI · Hoje</span>
        </div>
        <span style={{ fontSize: 14, fontWeight: 700, color: "var(--money-in)", fontVariantNumeric: "tabular-nums" }}>
          +450.000 Kz
        </span>
      </div>
    </div>
  );
}

function HeroB() {
  return (
    <div style={{ position: "relative", width: "100%", maxWidth: 340, display: "flex", flexDirection: "column", gap: 14 }} className="wa-panel-hero">
      <div style={{ ...cardStyle({ padding: 18, display: "flex", flexDirection: "column", gap: 14 }), transform: "rotate(-2deg)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <DsIconTile icon="piggy-bank" tone="yellow" />
          <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column" }}>
            <span style={{ fontSize: 15, fontWeight: 600 }}>Fundo de emergência</span>
            <span style={{ fontSize: 12, color: "var(--text-secondary)" }}>Expira 26/09/2027</span>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 8 }}>
          <span style={{ fontSize: 22, fontWeight: 700, letterSpacing: "-0.02em", fontVariantNumeric: "tabular-nums" }}>
            320.000 Kz
          </span>
          <span style={{ fontSize: 13, color: "var(--text-secondary)", fontVariantNumeric: "tabular-nums" }}>
            de 500.000 Kz
          </span>
        </div>
        <MiniBar value={64} color="#eab308" height={8} />
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "var(--text-secondary)" }}>
          <span>64% concluído</span>
          <span>Falta 180.000 Kz</span>
        </div>
      </div>
      <div style={{ ...cardStyle({ alignSelf: "flex-end", padding: "10px 14px", display: "flex", alignItems: "center", gap: 10 }), transform: "rotate(3deg)" }}>
        <DsIconTile icon="target" tone="green" size="sm" />
        <span style={{ fontSize: 13, fontWeight: 600 }}>Viagem a Benguela · 100%</span>
      </div>
    </div>
  );
}

function HeroC() {
  return (
    <div style={{ position: "relative", width: "100%", maxWidth: 340, display: "flex", flexDirection: "column", gap: 14 }} className="wa-panel-hero">
      <div style={{ ...cardStyle({ padding: 18, display: "flex", flexDirection: "column", gap: 12 }), transform: "rotate(-2deg)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <DsIconTile icon="sparkles" tone="purple" size="sm" />
          <span style={{ fontSize: 15, fontWeight: 600 }}>Wundu AI</span>
        </div>
        <p style={{ margin: 0, fontSize: 14, lineHeight: 1.5, color: "var(--text-primary)" }}>
          Domkandembe, os teus gastos em alimentação aumentaram 24% este mês.
        </p>
        <div style={{ display: "flex" }}>
          <Badge bg="var(--warning-tint)" fg="var(--warning)">Atenção</Badge>
        </div>
      </div>
      <div style={{ ...cardStyle({ padding: "12px 14px", display: "flex", flexDirection: "column", gap: 8 }), marginLeft: 36, transform: "rotate(2deg)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}>
          <span style={{ fontWeight: 600 }}>Alimentação</span>
          <span style={{ color: "var(--text-secondary)", fontVariantNumeric: "tabular-nums" }}>86.400 Kz</span>
        </div>
        <MiniBar value={82} color="#06c270" height={6} />
      </div>
    </div>
  );
}

type Phase = null | "leave" | "enter";

export function AuthBrandPanel() {
  const [slide, setSlide] = useState(0);
  const [ph, setPh] = useState<Phase>(null);
  const [dir, setDir] = useState(1);
  const [drag, setDrag] = useState<number | null>(null);
  const slideT = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastNav = useRef(0);
  const swipe = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    return () => {
      if (slideT.current) clearTimeout(slideT.current);
    };
  }, []);

  const reducedMotion = () =>
    typeof window !== "undefined" &&
    !!window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const goTo = (i: number, d?: number, auto = false) => {
    if (!auto) lastNav.current = Date.now();
    if (i === slide || ph) return;
    const dirn = d ?? (i > slide ? 1 : -1);
    if (reducedMotion()) {
      setSlide(i);
      return;
    }
    setDir(dirn);
    setPh("leave");
    if (slideT.current) clearTimeout(slideT.current);
    slideT.current = setTimeout(() => {
      setSlide(i);
      setPh("enter");
      setDrag(null);
      requestAnimationFrame(() => requestAnimationFrame(() => setPh(null)));
    }, 240);
  };

  const slideRef = useRef(slide);
  const phRef = useRef(ph);
  useEffect(() => {
    slideRef.current = slide;
    phRef.current = ph;
  });
  const goToRef = useRef(goTo);
  goToRef.current = goTo;

  useEffect(() => {
    const id = setInterval(() => {
      if (!phRef.current && Date.now() - lastNav.current > 6000) {
        goToRef.current((slideRef.current + 1) % 3, 1, true);
      }
    }, 6000);
    return () => clearInterval(id);
  }, []);

  const dragging = drag !== null && !ph;

  const hero =
    ph === "leave"
      ? { x: `${-40 * dir}px`, r: `${-90 * dir}deg`, s: 0.92, t: `transform 240ms ${IN}` }
      : ph === "enter"
        ? { x: `${40 * dir}px`, r: `${90 * dir}deg`, s: 0.92, t: "none" }
        : dragging
          ? {
              x: `${(drag ?? 0) * 0.25}px`,
              r: `${Math.max(-60, Math.min(60, (drag ?? 0) / 3))}deg`,
              s: 1,
              t: "none",
            }
          : { x: "0px", r: "0deg", s: 1, t: `transform 760ms ${SPRING}` };

  const tx =
    ph === "leave"
      ? { x: `${-120 * dir}px`, o: 0, t: `transform 240ms ${IN}, opacity 200ms ${IN}` }
      : ph === "enter"
        ? { x: `${140 * dir}px`, o: 0, t: "none" }
        : dragging
          ? {
              x: `${(drag ?? 0) * 0.5}px`,
              o: Math.max(0.3, 1 - Math.abs(drag ?? 0) / 300),
              t: "none",
            }
          : { x: "0px", o: 1, t: `transform 560ms ${E} 60ms, opacity 420ms ${E} 60ms` };

  const current = SLIDES[slide];

  const endSwipe = (clientX: number, clientY: number) => {
    const st = swipe.current;
    swipe.current = null;
    if (!st) return;
    const dx = clientX - st.x;
    const dy = clientY - st.y;
    const nxt = Math.max(0, Math.min(2, slide + (dx < 0 ? 1 : -1)));
    if (!(Math.abs(dx) > 65 && Math.abs(dx) > 1.5 * Math.abs(dy) && nxt !== slide)) {
      setDrag(null);
      return;
    }
    goTo(nxt, dx < 0 ? 1 : -1);
  };

  return (
    <div
      style={{
        flex: "0 0 50%",
        maxWidth: 760,
        margin: 16,
        borderRadius: 20,
        overflow: "hidden",
        position: "relative",
        background: "var(--surface-muted)",
        flexDirection: "column",
      }}
      className="hidden lg:flex"
    >
      <div style={{ height: 96, flex: "0 0 auto", padding: "24px 40px 0", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
        <img
          src="/assets/wundu-logo-horizontal.svg"
          alt="Wundu, O Caminho Para a Liberdade Financeira"
          width={223}
          height={72}
          style={{ height: 72, width: "auto", display: "block", flexShrink: 0 }}
        />
        <span style={{ fontSize: 13, color: "var(--text-tertiary)", fontVariantNumeric: "tabular-nums" }}>
          {slide + 1} de 3
        </span>
      </div>

      <div
        onPointerDown={(e) => {
          swipe.current = { x: e.clientX, y: e.clientY };
        }}
        onPointerMove={(e) => {
          if (!swipe.current) return;
          const dx = e.clientX - swipe.current.x;
          if (Math.abs(dx) > 6) setDrag(dx);
        }}
        onPointerUp={(e) => endSwipe(e.clientX, e.clientY)}
        onPointerCancel={(e) => endSwipe(e.clientX, e.clientY)}
        onPointerLeave={(e) => endSwipe(e.clientX, e.clientY)}
        style={{
          flex: 1,
          minHeight: 0,
          position: "relative",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "0 40px",
          touchAction: "pan-y",
          userSelect: "none",
        }}
      >
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            width: 380,
            height: 380,
            borderRadius: 999,
            background: "var(--primary-light)",
            transform: `scale(${ph ? 0.88 : 1})`,
            transition: ph === "enter" ? "none" : `transform 700ms ${SPRING}`,
          }}
        />
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            width: 260,
            height: 260,
            borderRadius: 999,
            border: "1px dashed var(--brand-line)",
            transform: `translate(110px,-110px) rotate(${slide * 120 + (drag ?? 0) / 2}deg)`,
            transition: `transform 900ms ${E}`,
          }}
        />
        <div
          style={{
            position: "relative",
            width: "100%",
            maxWidth: 340,
            display: "flex",
            flexDirection: "column",
            gap: 14,
            transformStyle: "preserve-3d",
            transform: `perspective(900px) translateX(${hero.x}) rotateY(${hero.r}) scale(${hero.s})`,
            transition: hero.t,
          }}
        >
          {slide === 0 ? <HeroA /> : null}
          {slide === 1 ? <HeroB /> : null}
          {slide === 2 ? <HeroC /> : null}
        </div>
      </div>

      <div className="wa-panel-bottom">
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 10,
            minHeight: 124,
            maxWidth: 480,
            transform: `translateX(${tx.x})`,
            opacity: tx.o,
            transition: tx.t,
          }}
        >
          <h2 className="wa-panel-title">{current.title}</h2>
          <p style={{ margin: 0, fontSize: 16, lineHeight: 1.55, color: "var(--text-secondary)" }}>
            {current.text}
          </p>
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, height: 56 }}>
          <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
            {SLIDES.map((s, i) => (
              <button
                key={s.title}
                aria-label={`Ir para o ecrã ${i + 1}`}
                onClick={() => goTo(i)}
                className="wa-dot"
                style={{
                  width: i === slide ? 24 : 8,
                  background: i === slide ? "var(--primary)" : "var(--border-strong)",
                }}
              />
            ))}
          </div>
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <button
              aria-label="Anterior"
              onClick={() => goTo((slide + 2) % 3, -1)}
              className="wa-roundbtn"
            >
              <DsIcon name="arrow-left" size={22} />
            </button>
            <button
              aria-label="Seguinte"
              onClick={() => goTo((slide + 1) % 3, 1)}
              className="wa-roundbtn wa-roundbtn--primary"
            >
              <DsIcon name="arrow-right" size={22} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
