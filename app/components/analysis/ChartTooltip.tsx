/*
 * Speech-bubble dos gráficos (1:1 com o SVG do Figma):
 * caixa de cantos arredondados + seta triangular numa das arestas.
 */
export type BubbleTailSide = "left" | "right" | "top" | "bottom" | "none";

const TAIL_LEN = 8;
const TAIL_HALF = 8;

export function bubblePath(
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
  side: BubbleTailSide,
  pos: number,
): string {
  if (side === "none") {
    return `M ${x + r},${y} H ${x + w - r} A ${r},${r} 0 0 1 ${x + w},${y + r} V ${y + h - r} A ${r},${r} 0 0 1 ${x + w - r},${y + h} H ${x + r} A ${r},${r} 0 0 1 ${x},${y + h - r} V ${y + r} A ${r},${r} 0 0 1 ${x + r},${y} Z`;
  }
  const horizontal = side === "left" || side === "right";
  const edgeStart = horizontal ? y : x;
  const edgeEnd = horizontal ? y + h : x + w;
  const p = Math.max(
    edgeStart + r + TAIL_HALF,
    Math.min(edgeEnd - r - TAIL_HALF, pos),
  );

  if (side === "left") {
    return (
      `M ${x + r},${y} H ${x + w - r} A ${r},${r} 0 0 1 ${x + w},${y + r} ` +
      `V ${y + h - r} A ${r},${r} 0 0 1 ${x + w - r},${y + h} H ${x + r} ` +
      `A ${r},${r} 0 0 1 ${x},${y + h - r} V ${p + TAIL_HALF} ` +
      `L ${x - TAIL_LEN},${p} L ${x},${p - TAIL_HALF} V ${y + r} ` +
      `A ${r},${r} 0 0 1 ${x + r},${y} Z`
    );
  }
  if (side === "right") {
    return (
      `M ${x + r},${y} H ${x + w - r} A ${r},${r} 0 0 1 ${x + w},${y + r} ` +
      `V ${p - TAIL_HALF} L ${x + w + TAIL_LEN},${p} L ${x + w},${p + TAIL_HALF} ` +
      `V ${y + h - r} A ${r},${r} 0 0 1 ${x + w - r},${y + h} H ${x + r} ` +
      `A ${r},${r} 0 0 1 ${x},${y + h - r} V ${y + r} ` +
      `A ${r},${r} 0 0 1 ${x + r},${y} Z`
    );
  }
  if (side === "top") {
    return (
      `M ${x + r},${y} H ${p - TAIL_HALF} L ${p},${y - TAIL_LEN} L ${p + TAIL_HALF},${y} ` +
      `H ${x + w - r} A ${r},${r} 0 0 1 ${x + w},${y + r} V ${y + h - r} ` +
      `A ${r},${r} 0 0 1 ${x + w - r},${y + h} H ${x + r} ` +
      `A ${r},${r} 0 0 1 ${x},${y + h - r} V ${y + r} ` +
      `A ${r},${r} 0 0 1 ${x + r},${y} Z`
    );
  }
  /* bottom */
  return (
    `M ${x + r},${y} H ${x + w - r} A ${r},${r} 0 0 1 ${x + w},${y + r} ` +
    `V ${y + h - r} A ${r},${r} 0 0 1 ${x + w - r},${y + h} H ${p + TAIL_HALF} ` +
    `L ${p},${y + h + TAIL_LEN} L ${p - TAIL_HALF},${y + h} H ${x + r} ` +
    `A ${r},${r} 0 0 1 ${x},${y + h - r} V ${y + r} ` +
    `A ${r},${r} 0 0 1 ${x + r},${y} Z`
  );
}

type ChartTooltipProps = {
  /** Caixa em coordenadas de desenho (antes de escala) */
  x: number;
  y: number;
  w: number;
  h: number;
  rx?: number;
  tail?: BubbleTailSide;
  /** Ponto para onde a seta aponta (coordenada absoluta no eixo da aresta) */
  tailPos?: number;
  fill?: string;
  stroke?: string;
  strokeWidth?: number;
};

export default function ChartTooltip({
  x,
  y,
  w,
  h,
  rx = 8,
  tail = "none",
  tailPos = 0,
  fill = "var(--background)",
  stroke,
  strokeWidth = 1,
}: ChartTooltipProps) {
  return (
    <path
      d={bubblePath(x, y, w, h, rx, tail, tailPos)}
      pointerEvents="none"
      style={{
        fill,
        ...(stroke ? { stroke, strokeWidth } : {}),
      }}
    />
  );
}
