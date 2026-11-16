import { CheckIcon, CloseIcon } from "@/constants/icons";
import React, { useEffect, useRef } from "react";
import type { GoalDTO } from "../../types/dto/goal.dto";
import { formatAOA } from "../../utils/format-AOA";

type GoalCompleteCelebrationProps = {
  /** Meta concluída (null fecha a celebração). */
  goal: GoalDTO | null;
  onClose: () => void;
  onNewGoal: () => void;
  onViewGoals: () => void;
};

const CONFETTI_COLORS = [
  "#053DC4",
  "#F8DC4E",
  "#06C270",
  "#FF3B3B",
  "#FF8800",
  "#B090F4",
  "#0EA5E9",
  "#4B74D4",
];

const CONFETTI_COUNT = 220;

type ConfettiPiece = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  delay: number;
  w: number;
  h: number;
  shape: "rect" | "circle" | "ribbon";
  color: string;
  rot: number;
  vr: number;
  flip: number;
  vf: number;
  wob: number;
  vw: number;
  wa: number;
  term: number;
};

/**
 * Tela completa "Meta concluída" com chuva de confetes (canvas) — espelha o
 * ficheiro `Meta concluída — confetes.html` (web, 1280×800). A física é a
 * mesma do artefacto: explosão a partir dos cantos inferiores + chuva do
 * topo, gravidade 0.32, velocidade terminal, respeito por
 * `prefers-reduced-motion` e DPR.
 */
export default function GoalCompleteCelebration({
  goal,
  onClose,
  onNewGoal,
  onViewGoals,
}: GoalCompleteCelebrationProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!goal) return;
    const cv = canvasRef.current;
    if (!cv) return;

    const W = window.innerWidth;
    const H = window.innerHeight;
    const dpr = window.devicePixelRatio || 1;
    cv.width = W * dpr;
    cv.height = H * dpr;
    const ctx = cv.getContext("2d");
    if (!ctx) return;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const g = 0.32;
    const rnd = (a: number, b: number) => a + Math.random() * (b - a);
    const make = (
      x: number,
      y: number,
      vx: number,
      vy: number,
      delay: number,
    ): ConfettiPiece => {
      const r = Math.random();
      return {
        x,
        y,
        vx,
        vy,
        delay,
        w: rnd(6, 10),
        h: rnd(10, 16),
        shape: r < 0.7 ? "rect" : r < 0.85 ? "circle" : "ribbon",
        color:
          CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
        rot: rnd(0, Math.PI * 2),
        vr: rnd(-0.18, 0.18),
        flip: rnd(0, Math.PI * 2),
        vf: rnd(0.08, 0.22),
        wob: rnd(0, Math.PI * 2),
        vw: rnd(0.03, 0.08),
        wa: rnd(0.6, 1.8),
        term: rnd(2.2, 3.6),
      };
    };

    const pieces: ConfettiPiece[] = [];
    const vBase = Math.sqrt(2 * g * H);
    const burst = Math.round(CONFETTI_COUNT * 0.7);
    for (let i = 0; i < burst; i++) {
      const left = i % 2 === 0;
      const ang = (rnd(58, 82) * Math.PI) / 180;
      const sp = vBase * rnd(0.75, 1.35);
      const vx = Math.cos(ang) * sp * (left ? 1 : -1) * rnd(0.8, 1.6);
      pieces.push(
        make(left ? -8 : W + 8, H + 8, vx, -Math.sin(ang) * sp, rnd(0, 260)),
      );
    }
    for (let j = 0; j < CONFETTI_COUNT - burst; j++) {
      pieces.push(
        make(rnd(0, W), rnd(-200, -20), rnd(-1, 1), rnd(0.5, 2), rnd(350, 1400)),
      );
    }

    const draw = (p: ConfettiPiece) => {
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.scale(1, Math.cos(p.flip));
      ctx.fillStyle = p.color;
      if (p.shape === "circle") {
        ctx.beginPath();
        ctx.arc(0, 0, p.w * 0.5, 0, Math.PI * 2);
        ctx.fill();
      } else if (p.shape === "ribbon") {
        ctx.fillRect(-p.w * 0.25, -p.h, p.w * 0.5, p.h * 2);
      } else {
        ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
      }
      ctx.restore();
    };

    if (
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      ctx.clearRect(0, 0, W, H);
      pieces.forEach((p) => {
        p.x = rnd(0, W);
        p.y = rnd(0, H * 0.35);
        draw(p);
      });
      return;
    }

    let raf: number | null = null;
    let last = performance.now();
    const start = last;
    const tick = (now: number) => {
      const f = Math.min((now - last) / 16.667, 3);
      last = now;
      const t = now - start;
      ctx.clearRect(0, 0, W, H);
      let alive = 0;
      for (const p of pieces) {
        if (t < p.delay) {
          alive++;
          continue;
        }
        if (p.y > H + 40) continue;
        alive++;
        p.vx *= Math.pow(0.975, f);
        p.vy += g * f;
        if (p.vy > p.term) p.vy = p.term + (p.vy - p.term) * Math.pow(0.85, f);
        p.wob += p.vw * f;
        p.rot += p.vr * f;
        p.flip += p.vf * f;
        const falling = p.vy > 0;
        p.x += (p.vx + (falling ? Math.sin(p.wob) * p.wa : 0)) * f;
        p.y += p.vy * f;
        draw(p);
      }
      if (alive > 0) {
        raf = requestAnimationFrame(tick);
      } else {
        ctx.clearRect(0, 0, W, H);
        raf = null;
      }
    };
    raf = requestAnimationFrame(tick);
    return () => {
      if (raf) cancelAnimationFrame(raf);
    };
  }, [goal]);

  if (!goal) return null;

  return (
    <div className="fixed inset-0 z-[60] flex flex-col items-center overflow-hidden bg-(--background) px-5 pb-6 pt-24 sm:px-8 lg:pt-[150px] lg:pb-14">
      <button
        type="button"
        onClick={onClose}
        aria-label="Fechar"
        className="absolute top-4 right-4 flex h-11 w-11 cursor-pointer items-center justify-center rounded-full bg-(--background-variant) text-(--text-title) transition-colors hover:bg-neutrals-300/20 lg:top-6 lg:right-6"
      >
        <CloseIcon width={20} className="text-(--text-title)" />
      </button>

      <div className="flex w-full max-w-[480px] flex-col items-center gap-6 text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-success text-white">
          <CheckIcon width={40} height={40} className="text-white" />
        </div>
        <div className="flex flex-col gap-2.5">
          <h1 className="m-0 text-[28px] leading-[34px] font-bold tracking-[-0.02em] text-(--text-title) lg:text-[32px] lg:leading-[38px]">
            Parabéns por ter completado a sua meta!
          </h1>
          <p className="m-0 text-[15px] leading-[22px] text-(--text-description)">
            Atingiste o valor definido para esta meta. O montante continua na
            conta associada.
          </p>
        </div>
      </div>

      <div className="flex-1" />

      <div className="flex w-full max-w-[480px] flex-col gap-4">
        <div className="flex w-full flex-col gap-2.5 rounded-xl border border-(--card-barras) bg-(--bg-card) p-4 text-left">
          <div className="flex items-center justify-between gap-3">
            <span className="truncate text-[15px] leading-[22px] font-semibold text-(--text-title)">
              {goal.title}
            </span>
            <span className="shrink-0 rounded-full bg-success/10 px-2.5 py-1 text-[13px] leading-[18px] font-semibold text-success-text">
              Concluída
            </span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-(--background-variant)">
            <div
              role="progressbar"
              aria-valuenow={100}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label={`Progresso de ${goal.title}`}
              className="h-full w-full rounded-full bg-success"
            />
          </div>
          <div className="flex items-center justify-between text-[13px] leading-[18px] text-(--text-description)">
            <span>
              {formatAOA(goal.targetAmount)} de {formatAOA(goal.targetAmount)}
            </span>
            <span>100%</span>
          </div>
        </div>
        <div className="flex w-full flex-col gap-2.5 sm:flex-row sm:gap-3">
          <button
            type="button"
            onClick={onNewGoal}
            className="flex h-12 flex-1 cursor-pointer items-center justify-center rounded-xl border border-(--border-button) bg-transparent text-[15px] leading-[22px] font-bold text-(--text-title) transition-colors hover:bg-neutrals-300/10 active:scale-[0.98]"
          >
            Criar nova meta
          </button>
          <button
            type="button"
            onClick={onViewGoals}
            className="flex h-12 flex-1 cursor-pointer items-center justify-center rounded-xl bg-primary-300 text-[15px] leading-[22px] font-bold text-white transition-opacity hover:opacity-90 active:scale-[0.98]"
          >
            Ver as minhas metas
          </button>
        </div>
      </div>

      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 h-full w-full"
      />
    </div>
  );
}
