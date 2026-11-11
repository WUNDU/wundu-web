"use client";

/* Wundu Landing v2 — réplica exata de "Landing Page/Wundu Landing v2.dc.html".
   Estrutura, textos, estilos inline, dados e interações portados 1:1 do original
   (classe DCLogic + tokens/estilos do _ds bundle). Links "Wundu Auth.dc.html"
   apontam para as rotas reais da wundu-web (/login e /register). */

import { useEffect, useRef, useState } from "react";
import { useThemeStore } from "../../store/theme-store";
import { SunIcon } from "@/constants/icons";
import {
  Apple as AppleIcon,
  Activity,
  ArrowDown,
  ArrowRight,
  ArrowUp,
  ArrowUpRight,
  BookOpen,
  Car,
  Clock,
  Gamepad2,
  Monitor,
  Moon,
  PiggyBank,
  Plus,
  Repeat,
  Smartphone,
  Sparkles,
  Tag,
  Target,
  Wallet,
  type LucideIcon,
} from "lucide-react";

const A = "/landing-v2/";

const ICONS: Record<string, LucideIcon> = {
  apple: AppleIcon,
  activity: Activity,
  "arrow-down": ArrowDown,
  "arrow-right": ArrowRight,
  "arrow-up": ArrowUp,
  "arrow-up-right": ArrowUpRight,
  "book-open": BookOpen,
  car: Car,
  clock: Clock,
  "gamepad-2": Gamepad2,
  monitor: Monitor,
  "piggy-bank": PiggyBank,
  plus: Plus,
  repeat: Repeat,
  smartphone: Smartphone,
  sparkles: Sparkles,
  tag: Tag,
  target: Target,
  wallet: Wallet,
};

function WdIcon({ name, size = 20 }: { name: string; size?: number }) {
  const C = ICONS[name];
  if (!C) return null;
  return (
    <span
      aria-hidden="true"
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        width: size,
        height: size,
        flex: "0 0 auto",
        color: "currentColor",
      }}
    >
      <C size={size} strokeWidth={2} style={{ width: "100%", height: "100%" }} />
    </span>
  );
}

function WdButton({
  variant = "primary",
  size = "md",
  iconRight,
  href,
  children,
  ...rest
}: {
  variant?: string;
  size?: string;
  iconRight?: string;
  href: string;
  children: React.ReactNode;
  [k: string]: unknown;
}) {
  return (
    <a
      href={href}
      className={`wd-btn wd-btn--${size} wd-btn--${variant}`}
      {...(rest as object)}
    >
      {children}
      {iconRight ? (
        <WdIcon name={iconRight} size={size === "sm" ? 16 : 18} />
      ) : null}
    </a>
  );
}

const TILE_TONES: Record<string, [string, string]> = {
  green: ["--cat-1", "--cat-1-tint"],
  red: ["--cat-2", "--cat-2-tint"],
  orange: ["--cat-3", "--cat-3-tint"],
  yellow: ["--tone-gold", "--cat-4-tint"],
  purple: ["--cat-5", "--cat-5-tint"],
  cyan: ["--cat-6", "--cat-6-tint"],
  blue: ["--cat-7", "--cat-7-tint"],
  neutral: ["--text-secondary", "--cat-8-tint"],
  brand: ["--on-soft-brand", "--primary-light"],
  in: ["--money-in", "--money-in-tint"],
  out: ["--money-out", "--money-out-tint"],
  balance: ["--tone-gold", "--money-neutral-tint"],
};
const TILE_SIZES: Record<string, [number, number]> = {
  sm: [32, 16],
  md: [40, 20],
  lg: [48, 24],
};

function WdIconTile({
  icon,
  tone = "brand",
  size = "md",
}: {
  icon: string;
  tone?: string;
  size?: string;
}) {
  const [fg, bg] = TILE_TONES[tone] || TILE_TONES.brand;
  const [box, glyph] = TILE_SIZES[size] || TILE_SIZES.md;
  return (
    <span
      className="wd-tile"
      style={{
        width: box,
        height: box,
        background: `var(${bg})`,
        color: `var(${fg})`,
      }}
    >
      <WdIcon name={icon} size={glyph} />
    </span>
  );
}

const PROG_TONES: Record<string, string> = {
  green: "--cat-1",
  red: "--cat-2",
  orange: "--cat-3",
  yellow: "--secondary",
  purple: "--cat-5",
  cyan: "--cat-6",
  blue: "--brand-line",
  dark: "--primary-dark",
  neutral: "--neutral",
};

function WdProgressBar({
  value = 0,
  tone = "blue",
  height = 8,
}: {
  value?: number;
  tone?: string;
  height?: number;
}) {
  const pct = Math.max(0, Math.min(100, value));
  return (
    <div
      className="wd-prog"
      style={{ height }}
      role="progressbar"
      aria-valuenow={pct}
    >
      <div
        className="wd-prog__fill"
        style={{
          width: `${pct}%`,
          background: `var(${PROG_TONES[tone] || PROG_TONES.blue})`,
        }}
      />
    </div>
  );
}

const BADGE_TONES: Record<string, [string, string]> = {
  green: ["--cat-1", "--cat-1-tint"],
  red: ["--cat-2", "--cat-2-tint"],
  orange: ["--cat-3", "--cat-3-tint"],
  yellow: ["--tone-gold", "--cat-4-tint"],
  purple: ["--cat-5", "--cat-5-tint"],
  cyan: ["--cat-6", "--cat-6-tint"],
  blue: ["--cat-7", "--cat-7-tint"],
  neutral: ["--text-secondary", "--cat-8-tint"],
  success: ["--success", "--success-tint"],
  danger: ["--danger", "--danger-tint"],
  warning: ["--tone-gold", "--warning-tint"],
  info: ["--info", "--info-tint"],
  brand: ["--on-soft-brand", "--primary-light"],
};

function WdBadge({
  tone = "neutral",
  icon,
  size = "md",
  children,
}: {
  tone?: string;
  icon?: string;
  size?: string;
  children: React.ReactNode;
}) {
  const [fg, bg] = BADGE_TONES[tone] || BADGE_TONES.neutral;
  return (
    <span
      className={`wd-badge${size === "sm" ? " wd-badge--sm" : ""}`}
      style={{ background: `var(${bg})`, color: `var(${fg})` }}
    >
      {icon ? <WdIcon name={icon} size={size === "sm" ? 12 : 14} /> : null}
      {children}
    </span>
  );
}

function WdTransactionRow({
  title,
  amount,
  direction = "out",
  category,
  categoryIcon,
  categoryTone = "neutral",
  account,
}: {
  title: string;
  amount: string;
  direction?: string;
  category?: string;
  categoryIcon?: string;
  categoryTone?: string;
  account?: string;
}) {
  return (
    <div className="wd-txn">
      <WdIconTile
        icon={direction === "in" ? "arrow-down" : "arrow-up"}
        tone={direction === "in" ? "in" : "out"}
      />
      <div className="wd-txn__main">
        <div className="wd-txn__title">{title}</div>
        <div className="wd-txn__meta">
          {category ? (
            <WdBadge tone={categoryTone} icon={categoryIcon} size="sm">
              {category}
            </WdBadge>
          ) : null}
          {account ? (
            <span
              style={{
                fontSize: "var(--text-sm)",
                color: "var(--text-tertiary)",
              }}
            >
              {account}
            </span>
          ) : null}
        </div>
      </div>
      <span className={`wd-txn__amount wd-txn__amount--${direction}`}>
        {amount}
      </span>
    </div>
  );
}

const SEV: Record<string, string> = {
  urgent: "--danger",
  attention: "--tone-gold",
  positive: "--success",
};

function WdInsightRow({
  severity = "positive",
  label,
  children,
}: {
  severity?: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="wd-insight">
      <p className="wd-insight__text">{children}</p>
      <span
        className="wd-insight__tag"
        style={{ color: `var(${SEV[severity] || SEV.positive})` }}
      >
        {label}
      </span>
    </div>
  );
}

/* Fundo de ondas three.js — portado 1:1 de components/wrapped/WavesBackground.jsx */
const NOISE_GLSL = `
vec3 mod289(vec3 x){return x-floor(x*(1.0/289.0))*289.0;}
vec4 mod289(vec4 x){return x-floor(x*(1.0/289.0))*289.0;}
vec4 permute(vec4 x){return mod289(((x*34.0)+1.0)*x);}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159-0.85373472095314*r;}
float snoise(vec3 v){
  const vec2 C=vec2(1.0/6.0,1.0/3.0);
  const vec4 D=vec4(0.0,0.5,1.0,2.0);
  vec3 i=floor(v+dot(v,C.yyy));
  vec3 x0=v-i+dot(i,C.xxx);
  vec3 g=step(x0.yzx,x0.xyz);
  vec3 l=1.0-g;
  vec3 i1=min(g.xyz,l.zxy);
  vec3 i2=max(g.xyz,l.zxy);
  vec3 x1=x0-i1+C.xxx;
  vec3 x2=x0-i2+C.yyy;
  vec3 x3=x0-D.yyy;
  i=mod289(i);
  vec4 p=permute(permute(permute(i.z+vec4(0.0,i1.z,i2.z,1.0))+i.y+vec4(0.0,i1.y,i2.y,1.0))+i.x+vec4(0.0,i1.x,i2.x,1.0));
  vec4 j=p-49.0*floor(p*(1.0/49.0));
  vec4 x_=floor(j*(1.0/7.0));
  vec4 y_=floor(j-7.0*x_);
  vec4 x=x_*(1.0/7.0)+0.5/7.0;
  vec4 y=y_*(1.0/7.0)+0.5/7.0;
  vec4 h=1.0-abs(x)-abs(y);
  vec4 b0=vec4(x.xy,y.xy);
  vec4 b1=vec4(x.zw,y.zw);
  vec4 s0=floor(b0)*2.0+1.0;
  vec4 s1=floor(b1)*2.0+1.0;
  vec4 sh=-step(h,vec4(0.0));
  vec4 a0=b0.xzyw+s0.xzyw*sh.xxyy;
  vec4 a1=b1.xzyw+s1.xzyw*sh.zzww;
  vec3 p0=vec3(a0.xy,h.x);
  vec3 p1=vec3(a0.zw,h.y);
  vec3 p2=vec3(a1.xy,h.z);
  vec3 p3=vec3(a1.zw,h.w);
  vec4 norm=taylorInvSqrt(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));
  p0*=norm.x;p1*=norm.y;p2*=norm.z;p3*=norm.w;
  vec4 m=max(0.6-vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)),0.0);
  m=m*m;
  return 42.0*dot(m*m,vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));
}`;
const VERT =
  NOISE_GLSL +
  `
varying float vNoise;
varying vec2 vUv;
uniform float u_time;
uniform float u_speed_x;
uniform float u_speed_y;
uniform float u_amp;
uniform float u_noise_freq;
void main(){
  vUv=uv;
  vec3 noisePos=vec3(position.xy*u_noise_freq-vec2(u_time*u_speed_x,0.0),u_time*u_speed_y);
  float noise=snoise(noisePos);
  vNoise=noise;
  vec3 pos=position;
  pos.z+=noise*u_amp;
  gl_Position=projectionMatrix*modelViewMatrix*vec4(pos,1.0);
}`;
const FRAG = `
varying vec2 vUv;
varying float vNoise;
uniform vec3 u_color_1;
uniform vec3 u_color_2;
uniform vec3 u_color_3;
void main(){
  float n=vNoise*0.5+0.5;
  vec3 color;
  if(n<0.5){color=mix(u_color_3,u_color_1,smoothstep(0.0,0.5,n));}
  else{color=mix(u_color_1,u_color_2,smoothstep(0.6,1.0,n));}
  gl_FragColor=vec4(color,1.0);
}`;

function WavesBackground({
  color1 = "#00216b",
  color2 = "#003cc3",
  color3 = "#ffd500",
  backgroundColor = "#040916",
  speedX = 0.125,
  speedY = 0.05,
  amp = 1.5,
  noiseFreq = 0.25,
  style,
}: {
  color1?: string;
  color2?: string;
  color3?: string;
  backgroundColor?: string;
  speedX?: number;
  speedY?: number;
  amp?: number;
  noiseFreq?: number;
  style?: React.CSSProperties;
}) {
  const hostRef = useRef<HTMLDivElement>(null);
  const [live, setLive] = useState(false);
  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    if (
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    )
      return;
    const init = (THREE: any) => {
    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        powerPreference: "low-power",
      });
    } catch {
      return;
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
    const canvas = renderer.domElement;
    Object.assign(canvas.style, {
      position: "absolute",
      inset: "0",
      width: "100%",
      height: "100%",
      display: "block",
    });
    host.appendChild(canvas);
    setLive(true);
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(backgroundColor);
    const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 100);
    camera.position.set(0, 0, 4);
    const material = new THREE.ShaderMaterial({
      vertexShader: VERT,
      fragmentShader: FRAG,
      uniforms: {
        u_time: { value: 0 },
        u_color_1: { value: new THREE.Color(color1) },
        u_color_2: { value: new THREE.Color(color2) },
        u_color_3: { value: new THREE.Color(color3) },
        u_speed_x: { value: speedX },
        u_speed_y: { value: speedY },
        u_amp: { value: amp },
        u_noise_freq: { value: noiseFreq },
      },
    });
    const mesh = new THREE.Mesh(
      new THREE.PlaneGeometry(1, 1, 128, 128),
      material
    );
    mesh.rotation.set(-0.2, 0, 0);
    scene.add(mesh);
    const resize = () => {
      const w = host.clientWidth || 1,
        h = host.clientHeight || 1;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      const vh =
        2 * Math.tan(((camera.fov as number) * Math.PI) / 360) * 4;
      const vw = vh * camera.aspect;
      mesh.geometry.dispose();
      mesh.geometry = new THREE.PlaneGeometry(vw * 1.5, vh * 1.5, 128, 128);
    };
    resize();
    let raf = 0,
      running = false,
      elapsed = 0,
      t0 = 0;
    const tick = (now: number) => {
      if (!running) return;
      elapsed = (now - t0) / 1000;
      material.uniforms.u_time.value = elapsed;
      renderer.render(scene, camera);
      raf = requestAnimationFrame(tick);
    };
    const start = () => {
      if (running) return;
      running = true;
      t0 = performance.now() - elapsed * 1000;
      raf = requestAnimationFrame(tick);
    };
    const stop = () => {
      running = false;
      cancelAnimationFrame(raf);
    };
    let onScreen = true;
    const sync = () => {
      if (onScreen && !document.hidden) start();
      else stop();
    };
    const io =
      typeof IntersectionObserver !== "undefined"
        ? new IntersectionObserver(
            (e) => {
              onScreen = e[0].isIntersecting;
              sync();
            },
            { threshold: 0.01 }
          )
        : null;
    if (io) io.observe(host);
    else start();
    document.addEventListener("visibilitychange", sync);
    const ro =
      typeof ResizeObserver !== "undefined"
        ? new ResizeObserver(resize)
        : null;
    if (ro) ro.observe(host);
    else window.addEventListener("resize", resize);
    const onLost = (e: Event) => {
      e.preventDefault();
      stop();
      setLive(false);
      canvas.style.display = "none";
    };
    canvas.addEventListener("webglcontextlost", onLost);
    sync();
    return () => {
      stop();
      canvas.removeEventListener("webglcontextlost", onLost);
      document.removeEventListener("visibilitychange", sync);
      if (io) io.disconnect();
      if (ro) ro.disconnect();
      else window.removeEventListener("resize", resize);
      mesh.geometry.dispose();
      material.dispose();
      renderer.dispose();
      if (canvas.parentNode) canvas.parentNode.removeChild(canvas);
      setLive(false);
    };
    };
    /* three.js via CDN sob demanda (uma tag por página, partilhada) */
    let cleanup: void | (() => void);
    let cancelled = false;
    const ready = (window as unknown as { THREE?: any }).THREE;
    if (ready) {
      cleanup = init(ready);
    } else {
      const THREE_SRC = "https://unpkg.com/three@0.160.0/build/three.min.js";
      const onLoad = () => {
        if (cancelled) return;
        const T = (window as unknown as { THREE?: any }).THREE;
        if (T) cleanup = init(T);
      };
      const existing = document.querySelector(
        "script[data-wl2-three]"
      ) as HTMLScriptElement | null;
      if (existing) {
        existing.addEventListener("load", onLoad);
        cleanup = () => existing.removeEventListener("load", onLoad);
      } else {
        const s = document.createElement("script");
        s.src = THREE_SRC;
        s.async = true;
        s.setAttribute("data-wl2-three", "");
        s.addEventListener("load", onLoad);
        document.head.appendChild(s);
        cleanup = () => {
          s.removeEventListener("load", onLoad);
        };
      }
    }
    return () => {
      cancelled = true;
      if (cleanup) cleanup();
    };
  }, [color1, color2, color3, backgroundColor, speedX, speedY, amp, noiseFreq]);
  return (
    <div
      ref={hostRef}
      aria-hidden="true"
      data-waves={live ? "webgl" : "gradient"}
      style={{
        position: "absolute",
        inset: 0,
        overflow: "hidden",
        pointerEvents: "none",
        background: live
          ? backgroundColor
          : `linear-gradient(160deg,${color1} 0%,${backgroundColor} 52%,${color3} 150%)`,
        ...style,
      }}
    />
  );
}

/* Bloco com style-hover do original (atributo style-hover do runtime DC) */
/* Divide "1px solid <cor>" nos longhands para nunca misturar
   shorthand (border) com longhand (borderColor) entre renders. */
function splitBorder(border: string) {
  const parts = border.trim().split(/\s+/);
  if (parts.length < 3) return null;
  return {
    borderWidth: parts[0],
    borderStyle: parts[1],
    borderColor: parts.slice(2).join(" "),
  };
}

function HV({
  hover,
  style,
  children,
  onMouseEnter,
  onMouseLeave,
  ...rest
}: {
  hover: React.CSSProperties;
  style?: React.CSSProperties;
  children: React.ReactNode;
  onMouseEnter?: (e: React.MouseEvent) => void;
  onMouseLeave?: (e: React.MouseEvent) => void;
  [k: string]: unknown;
} & ({ href: string } | { href?: undefined })) {
  const [h, setH] = useState(false);
  const Tag = (rest as { href?: string }).href ? "a" : "div";
  /* expande o shorthand nos dois estados: hover e base usam sempre
     os mesmos longhands, sem mistura que o React acuse */
  const expand = (
    s: React.CSSProperties | undefined
  ): React.CSSProperties | undefined => {
    if (!s || typeof s.border !== "string") return s;
    const split = splitBorder(s.border);
    if (!split) return s;
    const { border, ...rest } = s as unknown as Record<string, unknown>;
    void border;
    return { ...(rest as React.CSSProperties), ...split };
  };
  const base = expand(style);
  const merged = h ? { ...base, ...expand(hover) } : base;
  return (
    <Tag
      {...(rest as object)}
      style={merged}
      onMouseEnter={(e: React.MouseEvent) => {
        setH(true);
        onMouseEnter?.(e);
      }}
      onMouseLeave={(e: React.MouseEvent) => {
        setH(false);
        onMouseLeave?.(e);
      }}
    >
      {children}
    </Tag>
  );
}

const MODULES = [
  { name: "Receitas", icon: "arrow-down", tone: "in" },
  { name: "Despesas", icon: "arrow-up", tone: "out" },
  { name: "Metas", icon: "target", tone: "yellow" },
  { name: "Contas", icon: "wallet", tone: "brand" },
  { name: "Análises", icon: "activity", tone: "cyan" },
  { name: "Orçamento", icon: "tag", tone: "green" },
  { name: "Poupança", icon: "piggy-bank", tone: "orange" },
  { name: "Wundu AI", icon: "sparkles", tone: "purple" },
];
const FROM: Record<string, string> = {
  up: "translate3d(0,32px,0)",
  down: "translate3d(0,-16px,0)",
  left: "translate3d(-48px,0,0)",
  right: "translate3d(48px,0,0)",
  word: "translate3d(0,0.6em,0) rotate(4deg)",
  rise: "translate3d(0,80px,0) rotateX(24deg) scale(.94)",
  scale: "scale(.94)",
  spin: "rotate(-120deg) scale(.6)",
  fade: "none",
};
const E = "cubic-bezier(.2,.8,.2,1)";
const kz = (n: number) =>
  Math.round(n)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ".") + ",00 Kz";

const NAV_LINKS: Array<[string, string]> = [
  ["#sobre", "Sobre nós"],
  ["#funcionalidades", "Funcionalidades"],
  ["#contas", "Contas"],
  ["#disponivel", "App"],
  ["#faq", "FAQ"],
];
const GOALS = [
  {
    name: "Comprar apartamento T2 - Kilamba",
    pct: 100,
    tone: "green",
    color: "var(--success)",
    note: "Concluído · 4.000.000,00 Kz",
  },
  {
    name: "Depósito à prazo",
    pct: 80,
    tone: "cyan",
    color: "var(--info)",
    note: "Falta 400.000,00 Kz",
  },
  {
    name: "Carro BMW X6",
    pct: 50,
    tone: "yellow",
    color: "var(--warning)",
    note: "Falta 5.000.000,00 Kz",
  },
];
const BUDGETS = [
  {
    name: "Alimentação",
    icon: "apple",
    tone: "green",
    spent: "86.400 Kz",
    limit: "120.000 Kz",
    pct: 72,
  },
  {
    name: "Transporte",
    icon: "car",
    tone: "red",
    spent: "55.200 Kz",
    limit: "60.000 Kz",
    pct: 92,
  },
  {
    name: "Lazer",
    icon: "gamepad-2",
    tone: "yellow",
    spent: "18.000 Kz",
    limit: "50.000 Kz",
    pct: 36,
  },
];
const ACCOUNTS = [
  {
    name: "Banco Angolano de Investimento",
    value: "1.248.000,00 Kz",
    pct: "40%",
    share: 40,
    color: "#053dc4",
  },
  {
    name: "Banco Sol",
    value: "780.000,00 Kz",
    pct: "25%",
    share: 25,
    color: "#f8dc4e",
  },
  {
    name: "BFA",
    value: "561.600,00 Kz",
    pct: "18%",
    share: 18,
    color: "#ff8800",
  },
  {
    name: "Standard Bank Angola",
    value: "374.400,00 Kz",
    pct: "12%",
    share: 12,
    color: "#0ea5e9",
  },
  {
    name: "Conta manual",
    value: "156.000,00 Kz",
    pct: "5%",
    share: 5,
    color: "#a1acbb",
  },
];
const FAQ = [
  {
    q: "O que é a Wundu e como funciona?",
    a: "A Wundu é uma aplicação para gerir o teu dinheiro. Registas o que ganhas e o que gastas, defines categorias e acompanhas as tuas metas, tudo num só lugar.",
  },
  {
    q: "A Wundu é segura para guardar os meus dados financeiros?",
    a: "Sim, os teus dados estão protegidos. Ninguém tem acesso à tua conta a não ser tu, e as tuas informações nunca são partilhadas com terceiros.",
  },
  {
    q: "Posso organizar despesas e receitas por categoria?",
    a: "Sim. Podes organizar cada movimento por categoria, como Alimentação, Transporte, Saúde ou Lazer, e criar as tuas próprias categorias.",
  },
  {
    q: "A Wundu ajuda a acompanhar as minhas metas financeiras?",
    a: "Sim. Defines um valor que queres poupar e uma data limite. A Wundu mostra quanto já poupaste e quanto falta.",
  },
  {
    q: "O que faço se os gastos não aparecem actualizados?",
    a: "Fecha e volta a abrir a aplicação. Se continuar sem actualizar, verifica a tua ligação à internet. Se o problema persistir, escreve para support@wundu.tech.",
  },
];
const TXNS = [
  {
    title: "Transferência interna de salário",
    amount: "500.000,00 Kz",
    direction: "in",
    category: "Salário",
    categoryIcon: "repeat",
    categoryTone: "green",
    account: "BAI",
  },
  {
    title: "Compras no supermercado",
    amount: "1.000,00 Kz",
    direction: "out",
    category: "Alimentação",
    categoryIcon: "apple",
    categoryTone: "orange",
    account: "SOL",
  },
  {
    title: "Livro Pai Rico, Pai Pobre",
    amount: "1.000,00 Kz",
    direction: "out",
    category: "Educação",
    categoryIcon: "book-open",
    categoryTone: "purple",
    account: "SBA",
  },
];
const INSIGHTS = [
  {
    severity: "attention",
    label: "Atenção",
    text: "Domkandembe, os teus gastos em alimentação aumentaram 24% este mês.",
  },
  {
    severity: "positive",
    label: "Positivo",
    text: "Mantendo este ritmo, concluis o Depósito à prazo em Setembro.",
  },
  {
    severity: "urgent",
    label: "Urgente",
    text: "Transporte já usou 92% do orçamento de Julho.",
  },
];

export default function WunduLandingV2() {
  /* Tema global da app (zustand persistido, aplicado no <html data-theme>) */
  const theme = useThemeStore((s) => s.theme);
  const toggleTheme = useThemeStore((s) => s.toggleTheme);
  /* 1280 fixo no primeiro render (== servidor); medido no efeito após montar */
  const [w, setW] = useState<number>(1280);
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);
  const [seen, setSeen] = useState<Record<string, number>>({});
  const [open, setOpen] = useState(0);
  const [hero, setHero] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLElement>(null);
  const tiltRef = useRef<HTMLDivElement>(null);
  const marqueeRef = useRef<HTMLDivElement>(null);
  const countRef = useRef<HTMLSpanElement>(null);
  const pausedRef = useRef(false);
  const tiltReadyRef = useRef(false);

  const wide = w >= 1040;
  const xl = w >= 1300;
  /* antes de montar, força light (== servidor) para não divergir na hidratação */
  const isDark = mounted && theme === "dark";
  const isLight = !isDark;

  /* largura do bloco (== breakpoints wide/xl do original) */
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const measure = () => setW(root.clientWidth || window.innerWidth);
    measure();
    const ro =
      typeof ResizeObserver !== "undefined"
        ? new ResizeObserver(measure)
        : null;
    if (ro) ro.observe(root);
    else window.addEventListener("resize", measure);
    return () => {
      if (ro) ro.disconnect();
      else window.removeEventListener("resize", measure);
    };
  }, []);

  /* reveals + marquee + float + tilt + header (== DCLogic.setup) */
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const reduced =
      (window.matchMedia &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches) ||
      false;
    if (reduced) {
      setSeen({ goals: 1, budgets: 1, accounts: 1 });
      setHero(true);
      tiltReadyRef.current = true;
      return;
    }
    const timers: Array<ReturnType<typeof setTimeout>> = [];
    const setup = () => {
      const els = Array.from(root.querySelectorAll("[data-reveal]"));
      els.forEach((el) => {
        const e = el as HTMLElement;
        const d = e.dataset.delay || "0";
        const k = e.dataset.reveal || "up";
        e.style.opacity = "0";
        e.style.transform = FROM[k] || FROM.up;
        e.style.transition = `opacity 700ms ${E} ${d}ms, transform ${
          k === "rise" ? 1300 : 900
        }ms ${E} ${d}ms`;
      });
      const io = new IntersectionObserver(
        (es) =>
          es.forEach((en) => {
            if (!en.isIntersecting) return;
            const el = en.target as HTMLElement;
            io.unobserve(el);
            el.style.opacity = "1";
            el.style.transform = "";
            const done = () => {
              el.style.transition = "";
              el.style.willChange = "";
              if (el.dataset.reveal === "rise") tiltReadyRef.current = true;
            };
            timers.push(
              setTimeout(done, 1400 + Number(el.dataset.delay || 0))
            );
            if (el.dataset.key)
              timers.push(
                setTimeout(
                  () =>
                    setSeen((s) => ({ ...s, [el.dataset.key as string]: 1 })),
                  250
                )
              );
            el.querySelectorAll("[data-count]").forEach((c) =>
              countUp(c as HTMLElement)
            );
          }),
        { threshold: 0.12, rootMargin: "0px 0px -6% 0px" }
      );
      requestAnimationFrame(() => els.forEach((el) => io.observe(el)));
      timers.push(setTimeout(() => setHero(true), 1600));
      let mx = 0;
      const t0 = performance.now();
      let raf = 0;
      const loop = (t: number) => {
        const m = marqueeRef.current;
        if (m) {
          if (!pausedRef.current) mx -= 0.45;
          const half = m.scrollWidth / 2;
          if (half && -mx >= half) mx += half;
          m.style.transform = `translate3d(${mx}px,0,0)`;
        }
        const sec = (t - t0) / 1000;
        root.querySelectorAll("[data-float]").forEach((f) => {
          const fe = f as HTMLElement;
          const r = (fe.parentElement as HTMLElement).getBoundingClientRect();
          const par = r.top * Number(fe.dataset.float);
          fe.style.transform = `translate3d(0,${
            par + Math.sin(sec * 1.1 + Number(fe.dataset.phase)) * 6
          }px,0)`;
        });
        const tilt = tiltRef.current;
        if (tilt && tiltReadyRef.current) {
          const vh = window.innerHeight || 800,
            top = tilt.getBoundingClientRect().top;
          const p = Math.max(0, Math.min(1, (vh * 0.9 - top) / (vh * 0.6)));
          tilt.style.transform = `rotateX(${(1 - p) * 14}deg) scale(${
            0.95 + p * 0.05
          })`;
        }
        const h = headerRef.current;
        if (h) {
          const sc = root.getBoundingClientRect().top < -8;
          h.style.borderBottomColor = sc
            ? "var(--border-subtle)"
            : "transparent";
        }
        raf = requestAnimationFrame(loop);
      };
      raf = requestAnimationFrame(loop);
      return () => {
        cancelAnimationFrame(raf);
        io.disconnect();
      };
    };
    let cleanup: void | (() => void);
    const t = setTimeout(() => {
      cleanup = setup();
    }, 30);
    return () => {
      clearTimeout(t);
      timers.forEach(clearTimeout);
      if (cleanup) cleanup();
    };
  }, []);

  function countUp(el: HTMLElement) {
    const to = Number(el.dataset.count),
      t0 = performance.now(),
      dur = 1400;
    const step = (t: number) => {
      const p = Math.min(1, (t - t0) / dur),
        e = 1 - Math.pow(1 - p, 3);
      el.textContent = kz(to * e);
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }

  /* count-up do património quando o cartão de contas revela */
  useEffect(() => {
    if (seen.accounts && countRef.current && !reducedMotion())
      countUp(countRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [seen.accounts]);

  function reducedMotion() {
    return (
      typeof window !== "undefined" &&
      !!window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    );
  }

  const goals = GOALS.map((g) => ({ ...g, live: seen.goals ? g.pct : 0 }));
  const budgets = BUDGETS.map((b) => ({
    ...b,
    live: seen.budgets ? b.pct : 0,
  }));
  const accounts = ACCOUNTS.map((a) => ({
    ...a,
    live: seen.accounts ? a.share : 0.001,
  }));
  const faqs = FAQ.map((f, i) => {
    const isOpen = open === i;
    return {
      ...f,
      open: isOpen,
      delay: i * 60,
      rows: isOpen ? "1fr" : "0fr",
      rot: isOpen ? "45deg" : "0deg",
      iconBg: isOpen ? "var(--primary)" : "var(--surface-muted)",
      iconColor: isOpen ? "#fff" : "var(--text-primary)",
      toggle: () => setOpen(isOpen ? -1 : i),
    };
  });

  return (
    <div
      ref={rootRef}
      className="wl2"
      style={{
        background: "var(--surface-page)",
        color: "var(--text-primary)",
        fontFamily: "var(--font-core)",
        minHeight: "100vh",
        overflowX: "clip",
      }}
    >
      <header
        ref={headerRef}
        style={{
          position: "sticky",
          top: 0,
          zIndex: 20,
          background: "var(--surface-page)",
          borderBottom: "1px solid transparent",
          transition:
            "border-color 180ms cubic-bezier(.2,.8,.2,1), box-shadow 180ms cubic-bezier(.2,.8,.2,1)",
        }}
      >
        <div
          style={{
            maxWidth: 1200,
            margin: "0 auto",
            padding: "0 24px",
            height: 76,
            display: "flex",
            alignItems: "center",
            gap: 32,
          }}
        >
          <a
            href="#inicio"
            data-reveal="down"
            style={{ display: "flex", alignItems: "center" }}
          >
            <img
              src="/assets/wundu-logo-horizontal.svg"
              alt="Wundu"
              style={{ height: 34, width: "auto" }}
            />
          </a>
          {wide ? (
            <nav style={{ display: "flex", gap: 4, flex: 1 }}>
              {NAV_LINKS.map(([href, label], i) => (
                <HV
                  key={href}
                  href={href}
                  data-reveal="down"
                  data-delay={60 + i * 50}
                  style={{
                    height: 40,
                    padding: "0 14px",
                    display: "flex",
                    alignItems: "center",
                    borderRadius: 10,
                    whiteSpace: "nowrap",
                    fontSize: 15,
                    fontWeight: 500,
                    color: "var(--text-secondary)",
                    transition:
                      "background-color 120ms cubic-bezier(.2,.8,.2,1), color 120ms cubic-bezier(.2,.8,.2,1)",
                  }}
                  hover={{
                    background: "var(--surface-hover)",
                    color: "var(--text-primary)",
                  }}
                >
                  {label}
                </HV>
              ))}
            </nav>
          ) : null}
          {!wide ? <div style={{ flex: 1 }} /> : null}
          <div
            data-reveal="down"
            data-delay="200"
            style={{ display: "flex", gap: 8, alignItems: "center" }}
          >
            <button
              type="button"
              onClick={toggleTheme}
              className="group flex size-11 items-center justify-center rounded-xl bg-(--background-variant) text-(--menu-icon) transition-colors hover:text-(--menu-hover) lg:size-10 lg:bg-transparent lg:hover:bg-(--background-variant)"
              aria-label={isDark ? "Ativar tema claro" : "Ativar tema escuro"}
              title={isDark ? "Tema claro" : "Tema escuro"}
              aria-pressed={isDark}
            >
              {isDark ? (
                <SunIcon className="size-8" aria-hidden="true" />
              ) : (
                <Moon className="size-8" strokeWidth={1.5} aria-hidden="true" />
              )}
            </button>
            {wide ? (
              <WdButton href="/login" variant="ghost" size="md">
                Entrar
              </WdButton>
            ) : null}
            <WdButton href="/register" variant="primary" size="md">
              Criar conta
            </WdButton>
          </div>
        </div>
      </header>

      <section id="inicio" data-screen-label="Hero" style={{ position: "relative" }}>
        <div
          style={{
            maxWidth: 1200,
            margin: "0 auto",
            padding: "96px 24px 0",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
            gap: 28,
            position: "relative",
            zIndex: 1,
          }}
        >
          <h1
            style={{
              margin: 0,
              maxWidth: 960,
              fontSize: "clamp(42px,7vw,88px)",
              lineHeight: 1.02,
              fontWeight: 700,
              letterSpacing: "-0.04em",
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "center",
              columnGap: "0.24em",
            }}
          >
            <span data-reveal="word" data-delay="80" style={{ display: "inline-block" }}>O</span>
            <span data-reveal="word" data-delay="140" style={{ display: "inline-block" }}>caminho</span>
            <span data-reveal="word" data-delay="200" style={{ display: "inline-block" }}>para</span>
            <span data-reveal="word" data-delay="260" style={{ display: "inline-block" }}>a</span>
            <span data-reveal="word" data-delay="340" style={{ display: "inline-block", color: "var(--on-soft-brand)" }}>liberdade</span>
            <span data-reveal="word" data-delay="420" style={{ display: "inline-block", color: "var(--on-soft-brand)" }}>financeira</span>
          </h1>
          <p
            data-reveal="up"
            data-delay="560"
            style={{
              margin: 0,
              maxWidth: 620,
              fontSize: "clamp(17px,1.6vw,20px)",
              lineHeight: 1.55,
              color: "var(--text-secondary)",
              textWrap: "pretty",
            }}
          >
            Junta as tuas contas, regista entradas e gastos, define metas e
            percebe para onde vai o teu dinheiro. Tudo em Kwanza, num só lugar.
          </p>
          <div
            data-reveal="up"
            data-delay="660"
            style={{
              display: "flex",
              gap: 12,
              flexWrap: "wrap",
              justifyContent: "center",
            }}
          >
            <WdButton href="/register" variant="primary" size="lg" iconRight="arrow-right">
              Começar grátis
            </WdButton>
            <WdButton href="#funcionalidades" variant="outline" size="lg">
              Ver funcionalidades
            </WdButton>
          </div>
          <span
            data-reveal="up"
            data-delay="740"
            style={{ fontSize: 14, color: "var(--text-tertiary)" }}
          >
            Disponível na Web e Android · iOS em breve
          </span>
        </div>

        <div style={{ position: "relative", marginTop: 72 }}>
          <div
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              top: "26%",
              bottom: 0,
              background: "#040916",
              overflow: "hidden",
            }}
          >
            <WavesBackground />
          </div>
          <div
            style={{
              position: "relative",
              maxWidth: 1200,
              margin: "0 auto",
              padding: "0 24px 104px",
              perspective: 1800,
            }}
          >
            <div
              ref={tiltRef}
              data-reveal="rise"
              data-delay="820"
              style={{ transformOrigin: "50% 0%", willChange: "transform" }}
            >
              <div
                style={{
                  borderRadius: 16,
                  overflow: "hidden",
                  border: "1px solid var(--border-strong)",
                  background: "var(--surface-card)",
                  boxShadow: "var(--shadow-xl)",
                }}
              >
                <div
                  style={{
                    height: 40,
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    padding: "0 16px",
                    background: "var(--surface-muted)",
                    borderBottom: "1px solid var(--border-strong)",
                  }}
                >
                  <span style={{ width: 11, height: 11, borderRadius: 999, background: "var(--border-strong)" }} />
                  <span style={{ width: 11, height: 11, borderRadius: 999, background: "var(--border-strong)" }} />
                  <span style={{ width: 11, height: 11, borderRadius: 999, background: "var(--border-strong)" }} />
                  <span
                    style={{
                      margin: "0 auto",
                      fontSize: 12,
                      color: "var(--text-secondary)",
                      background: "var(--surface-card)",
                      borderRadius: 8,
                      padding: "4px 16px",
                    }}
                  >
                    wundu.tech/home/dashboard
                  </span>
                </div>
                {isLight ? (
                  <img
                    src={`${A}dashboard.png`}
                    alt="Dashboard da Wundu com entradas, gastos, saldo do mês, património, transações recentes e metas financeiras"
                    style={{ display: "block", width: "100%", height: "auto" }}
                  />
                ) : null}
                {isDark ? (
                  <img
                    src={`${A}dashboard-dark.png`}
                    alt="Dashboard da Wundu com entradas, gastos, saldo do mês, património, transações recentes e metas financeiras"
                    style={{ display: "block", width: "100%", height: "auto" }}
                  />
                ) : null}
              </div>
            </div>

            {xl ? (
              <>
                <div data-float="0.06" data-phase="0" style={{ position: "absolute", left: -24, top: "18%", zIndex: 2 }}>
                  <div
                    data-reveal="left"
                    data-delay="1100"
                    style={{
                      background: "var(--surface-card)",
                      border: "1px solid var(--border-subtle)",
                      borderRadius: 14,
                      boxShadow: "var(--shadow-lg)",
                      padding: "12px 16px",
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                      width: 280,
                    }}
                  >
                    <WdIconTile icon="arrow-down" tone="in" />
                    <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", textAlign: "left" }}>
                      <span style={{ fontSize: 14, fontWeight: 600 }}>Salário</span>
                      <span style={{ fontSize: 12, color: "var(--text-secondary)" }}>BAI · Hoje</span>
                    </div>
                    <span
                      style={{
                        fontSize: 14,
                        fontWeight: 700,
                        color: "var(--money-in)",
                        fontVariantNumeric: "tabular-nums",
                      }}
                    >
                      +500.000 Kz
                    </span>
                  </div>
                </div>
                <div data-float="-0.05" data-phase="1.8" style={{ position: "absolute", right: -24, top: "40%", zIndex: 2 }}>
                  <div
                    data-reveal="right"
                    data-delay="1250"
                    style={{
                      background: "var(--surface-card)",
                      border: "1px solid var(--border-subtle)",
                      borderRadius: 14,
                      boxShadow: "var(--shadow-lg)",
                      padding: 16,
                      display: "flex",
                      flexDirection: "column",
                      gap: 10,
                      width: 290,
                      textAlign: "left",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <WdIconTile icon="sparkles" tone="purple" size="sm" />
                      <span style={{ fontSize: 14, fontWeight: 600 }}>Wundu AI</span>
                    </div>
                    <span style={{ fontSize: 13, lineHeight: 1.5, color: "var(--text-primary)", textWrap: "pretty" }}>
                      Os teus gastos em alimentação aumentaram 24% este mês.
                    </span>
                  </div>
                </div>
                <div data-float="0.09" data-phase="3.4" style={{ position: "absolute", left: "6%", bottom: 64, zIndex: 2 }}>
                  <div
                    data-reveal="up"
                    data-delay="1400"
                    style={{
                      background: "var(--surface-card)",
                      border: "1px solid var(--border-subtle)",
                      borderRadius: 14,
                      boxShadow: "var(--shadow-lg)",
                      padding: "14px 16px",
                      display: "flex",
                      flexDirection: "column",
                      gap: 10,
                      width: 250,
                      textAlign: "left",
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}>
                      <span style={{ fontWeight: 600 }}>Carro BMW X6</span>
                      <span style={{ fontWeight: 700, color: "var(--warning)" }}>50%</span>
                    </div>
                    <WdProgressBar value={hero ? 50 : 0} tone="yellow" height={6} />
                  </div>
                </div>
              </>
            ) : null}
          </div>
        </div>
      </section>

      <section
        data-screen-label="Módulos"
        style={{ borderBottom: "1px solid var(--border-subtle)", padding: "28px 0", overflow: "hidden" }}
        onMouseEnter={() => {
          pausedRef.current = true;
        }}
        onMouseLeave={() => {
          pausedRef.current = false;
        }}
      >
        <div ref={marqueeRef} style={{ display: "flex", gap: 12, width: "max-content", willChange: "transform" }}>
          {[...MODULES, ...MODULES].map((m, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                height: 48,
                padding: "0 18px 0 8px",
                border: "1px solid var(--border-subtle)",
                borderRadius: 999,
                background: "var(--surface-card)",
                flex: "0 0 auto",
              }}
            >
              <WdIconTile icon={m.icon} tone={m.tone} size="sm" />
              <span style={{ fontSize: 15, fontWeight: 600, whiteSpace: "nowrap" }}>{m.name}</span>
            </div>
          ))}
        </div>
      </section>

      <section
        id="funcionalidades"
        data-screen-label="Funcionalidades"
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: "120px 24px",
          display: "flex",
          flexDirection: "column",
          gap: 56,
        }}
      >
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "24px 56px",
            alignItems: "flex-end",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 14, maxWidth: 620 }}>
            <span
              data-reveal="up"
              style={{
                fontSize: 12,
                fontWeight: 600,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: "var(--on-soft-brand)",
              }}
            >
              Funcionalidades
            </span>
            <h2
              data-reveal="up"
              data-delay="80"
              style={{
                margin: 0,
                fontSize: "clamp(32px,4.4vw,56px)",
                lineHeight: 1.05,
                fontWeight: 700,
                letterSpacing: "-0.03em",
                textWrap: "balance",
              }}
            >
              Mais controlo. Menos preocupação.
            </h2>
          </div>
          <p
            data-reveal="up"
            data-delay="160"
            style={{
              margin: 0,
              maxWidth: 400,
              fontSize: 17,
              lineHeight: 1.55,
              color: "var(--text-secondary)",
              textWrap: "pretty",
            }}
          >
            Quatro ferramentas que trabalham sobre os mesmos dados: o que
            registas numa aparece logo nas outras.
          </p>
        </div>

        <div style={{ display: "flex", flexWrap: "wrap", gap: 20 }}>
          <HV
            data-reveal="up"
            style={{
              flex: "7 1 460px",
              minWidth: 0,
              border: "1px solid var(--border-subtle)",
              borderRadius: 14,
              background: "var(--surface-card)",
              display: "flex",
              flexDirection: "column",
              transition:
                "transform 280ms cubic-bezier(.2,.8,.2,1), border-color 120ms cubic-bezier(.2,.8,.2,1), box-shadow 280ms cubic-bezier(.2,.8,.2,1)",
            }}
            hover={{
              transform: "translateY(-4px)",
              borderColor: "var(--brand-line)",
              boxShadow: "var(--shadow-lg)",
            }}
          >
            <div style={{ padding: "28px 28px 0", display: "flex", flexDirection: "column", gap: 10 }}>
              <WdIconTile icon="repeat" tone="brand" />
              <h3 style={{ margin: 0, fontSize: 24, fontWeight: 700, letterSpacing: "-0.015em" }}>
                Gestão de gastos
              </h3>
              <p
                style={{
                  margin: 0,
                  maxWidth: 460,
                  fontSize: 15,
                  lineHeight: 1.55,
                  color: "var(--text-secondary)",
                  textWrap: "pretty",
                }}
              >
                Regista cada movimento com categoria e conta. Filtra por data,
                banco ou categoria e vê o que entrou e saiu.
              </p>
            </div>
            <div
              className="wl2-panel"
              style={{
                margin: "24px 28px 28px",
                padding: "8px 16px 16px",
                background: "var(--surface-muted)",
                borderRadius: 12,
                display: "flex",
                flexDirection: "column",
              }}
            >
              {TXNS.map((t) => (
                <WdTransactionRow key={t.title} {...t} />
              ))}
            </div>
          </HV>

          <HV
            data-reveal="up"
            data-delay="100"
            style={{
              flex: "5 1 360px",
              minWidth: 0,
              border: "1px solid var(--border-subtle)",
              borderRadius: 14,
              background: "var(--surface-card)",
              display: "flex",
              flexDirection: "column",
              transition:
                "transform 280ms cubic-bezier(.2,.8,.2,1), border-color 120ms cubic-bezier(.2,.8,.2,1), box-shadow 280ms cubic-bezier(.2,.8,.2,1)",
            }}
            hover={{
              transform: "translateY(-4px)",
              borderColor: "var(--brand-line)",
              boxShadow: "var(--shadow-lg)",
            }}
          >
            <div style={{ padding: "28px 28px 0", display: "flex", flexDirection: "column", gap: 10 }}>
              <WdIconTile icon="target" tone="yellow" />
              <h3 style={{ margin: 0, fontSize: 24, fontWeight: 700, letterSpacing: "-0.015em" }}>
                Metas financeiras
              </h3>
              <p
                style={{
                  margin: 0,
                  fontSize: 15,
                  lineHeight: 1.55,
                  color: "var(--text-secondary)",
                  textWrap: "pretty",
                }}
              >
                Define quanto queres poupar e até quando. A Wundu mostra quanto
                já poupaste e quanto falta.
              </p>
            </div>
            <div
              className="wl2-panel"
              data-key="goals"
              data-reveal="fade"
              style={{
                margin: "24px 28px 28px",
                padding: 20,
                background: "var(--surface-muted)",
                borderRadius: 12,
                display: "flex",
                flexDirection: "column",
                gap: 20,
                flex: 1,
              }}
            >
              {goals.map((g) => (
                <div key={g.name} style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", gap: 8, fontSize: 14 }}>
                    <span style={{ fontWeight: 600, minWidth: 0, flex: "1 1 auto" }}>{g.name}</span>
                    <span style={{ flex: "0 0 auto", fontWeight: 700, color: g.color, fontVariantNumeric: "tabular-nums" }}>
                      {g.pct}%
                    </span>
                  </div>
                  <WdProgressBar value={g.live} tone={g.tone} height={8} />
                  <span style={{ fontSize: 12, color: "var(--text-secondary)", fontVariantNumeric: "tabular-nums" }}>
                    {g.note}
                  </span>
                </div>
              ))}
            </div>
          </HV>

          <HV
            data-reveal="up"
            style={{
              flex: "5 1 360px",
              minWidth: 0,
              border: "1px solid var(--border-subtle)",
              borderRadius: 14,
              background: "var(--surface-card)",
              display: "flex",
              flexDirection: "column",
              transition:
                "transform 280ms cubic-bezier(.2,.8,.2,1), border-color 120ms cubic-bezier(.2,.8,.2,1), box-shadow 280ms cubic-bezier(.2,.8,.2,1)",
            }}
            hover={{
              transform: "translateY(-4px)",
              borderColor: "var(--brand-line)",
              boxShadow: "var(--shadow-lg)",
            }}
          >
            <div style={{ padding: "28px 28px 0", display: "flex", flexDirection: "column", gap: 10 }}>
              <WdIconTile icon="tag" tone="green" />
              <h3 style={{ margin: 0, fontSize: 24, fontWeight: 700, letterSpacing: "-0.015em" }}>
                Orçamento por categoria
              </h3>
              <p
                style={{
                  margin: 0,
                  fontSize: 15,
                  lineHeight: 1.55,
                  color: "var(--text-secondary)",
                  textWrap: "pretty",
                }}
              >
                Define limites mensais e acompanha o que já gastaste em cada
                categoria.
              </p>
            </div>
            <div
              className="wl2-panel"
              data-key="budgets"
              data-reveal="fade"
              style={{
                margin: "24px 28px 28px",
                padding: 20,
                background: "var(--surface-muted)",
                borderRadius: 12,
                display: "flex",
                flexDirection: "column",
                gap: 18,
                flex: 1,
              }}
            >
              {budgets.map((b) => (
                <div key={b.name} style={{ display: "flex", alignItems: "center", gap: 14 }}>
                  <WdIconTile icon={b.icon} tone={b.tone} />
                  <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: 8 }}>
                    <div
                      style={{
                        display: "flex",
                        flexWrap: "wrap",
                        justifyContent: "space-between",
                        gap: "2px 12px",
                        fontSize: 14,
                      }}
                    >
                      <span style={{ fontWeight: 600 }}>{b.name}</span>
                      <span style={{ whiteSpace: "nowrap", color: "var(--text-secondary)", fontVariantNumeric: "tabular-nums" }}>
                        {b.spent} de {b.limit}
                      </span>
                    </div>
                    <WdProgressBar value={b.live} tone={b.tone} height={6} />
                  </div>
                </div>
              ))}
            </div>
          </HV>

          <HV
            data-reveal="up"
            data-delay="100"
            style={{
              flex: "7 1 460px",
              minWidth: 0,
              border: "1px solid var(--border-subtle)",
              borderRadius: 14,
              background: "var(--surface-card)",
              display: "flex",
              flexDirection: "column",
              transition:
                "transform 280ms cubic-bezier(.2,.8,.2,1), border-color 120ms cubic-bezier(.2,.8,.2,1), box-shadow 280ms cubic-bezier(.2,.8,.2,1)",
            }}
            hover={{
              transform: "translateY(-4px)",
              borderColor: "var(--brand-line)",
              boxShadow: "var(--shadow-lg)",
            }}
          >
            <div style={{ padding: "28px 28px 0", display: "flex", flexDirection: "column", gap: 10 }}>
              <WdIconTile icon="sparkles" tone="purple" />
              <h3 style={{ margin: 0, fontSize: 24, fontWeight: 700, letterSpacing: "-0.015em" }}>
                Wundu AI
              </h3>
              <p
                style={{
                  margin: 0,
                  maxWidth: 460,
                  fontSize: 15,
                  lineHeight: 1.55,
                  color: "var(--text-secondary)",
                  textWrap: "pretty",
                }}
              >
                Lê os teus movimentos e diz-te o que mudou e o que isso
                significa para o fim do mês.
              </p>
            </div>
            <div
              className="wl2-panel"
              style={{
                margin: "24px 28px 28px",
                padding: "8px 16px 16px",
                background: "var(--surface-muted)",
                borderRadius: 12,
                display: "flex",
                flexDirection: "column",
              }}
            >
              {INSIGHTS.map((s) => (
                <WdInsightRow key={s.label} severity={s.severity} label={s.label}>
                  {s.text}
                </WdInsightRow>
              ))}
            </div>
          </HV>
        </div>
      </section>

      <section
        id="sobre"
        data-screen-label="Sobre nós"
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: "0 24px 120px",
          display: "flex",
          flexDirection: "column",
          gap: 56,
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,440px),1fr))",
            gap: "32px 56px",
            alignItems: "start",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <span
              data-reveal="up"
              style={{
                fontSize: 12,
                fontWeight: 600,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: "var(--on-soft-brand)",
              }}
            >
              Sobre nós
            </span>
            <h2
              data-reveal="up"
              data-delay="80"
              style={{
                margin: 0,
                fontSize: "clamp(32px,4.4vw,56px)",
                lineHeight: 1.05,
                fontWeight: 700,
                letterSpacing: "-0.03em",
                textWrap: "balance",
              }}
            >
              Somos uma startup angolana
            </h2>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <p
              data-reveal="up"
              data-delay="160"
              style={{
                margin: 0,
                fontSize: 17,
                lineHeight: 1.6,
                color: "var(--text-secondary)",
                textWrap: "pretty",
              }}
            >
              Através de tecnologia acessível e um design intuitivo, oferecemos
              uma experiência simples, rápida e personalizada, permitindo que
              cada utilizador compreenda para onde vai o seu dinheiro e tome
              decisões mais conscientes.
            </p>
            <div
              data-reveal="up"
              data-delay="240"
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 8,
                padding: "20px 24px",
                borderRadius: 14,
                background: "var(--primary-light)",
              }}
            >
              <span
                style={{
                  fontSize: 12,
                  fontWeight: 600,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  color: "var(--on-soft-brand)",
                }}
              >
                Missão
              </span>
              <p
                style={{
                  margin: 0,
                  fontSize: 16,
                  lineHeight: 1.6,
                  color: "var(--text-primary)",
                  textWrap: "pretty",
                }}
              >
                A Wundu tem como finalidade ajudar jovens e trabalhadores a
                organizarem melhor o seu núcleo financeiro, promovendo educação
                financeira prática, controlo de despesas e construção de hábitos
                saudáveis de poupança.
              </p>
            </div>
          </div>
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 16 }}>
          {[
            {
              icon: "book-open",
              tone: "purple",
              delay: "0",
              title: "Educação financeira prática",
              text: "Aprender a gerir dinheiro a partir dos teus próprios movimentos, não de teoria.",
            },
            {
              icon: "repeat",
              tone: "brand",
              delay: "80",
              title: "Controlo de despesas e receitas",
              text: "Saber todos os dias quanto entrou, quanto saiu e para onde foi.",
            },
            {
              icon: "piggy-bank",
              tone: "yellow",
              delay: "160",
              title: "Hábitos de poupança",
              text: "Metas com prazo e progresso visível para poupar com consistência.",
            },
          ].map((c) => (
            <HV
              key={c.title}
              data-reveal="up"
              data-delay={c.delay}
              style={{
                flex: "1 1 220px",
                minWidth: 0,
                display: "flex",
                flexDirection: "column",
                gap: 12,
                padding: 24,
                border: "1px solid var(--border-subtle)",
                borderRadius: 14,
                background: "var(--surface-card)",
                transition:
                  "transform 280ms cubic-bezier(.2,.8,.2,1), border-color 120ms cubic-bezier(.2,.8,.2,1)",
              }}
              hover={{
                transform: "translateY(-4px)",
                borderColor: "var(--brand-line)",
              }}
            >
              <WdIconTile icon={c.icon} tone={c.tone} />
              <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700, letterSpacing: "-0.01em" }}>
                {c.title}
              </h3>
              <p
                style={{
                  margin: 0,
                  fontSize: 14,
                  lineHeight: 1.55,
                  color: "var(--text-secondary)",
                  textWrap: "pretty",
                }}
              >
                {c.text}
              </p>
            </HV>
          ))}
        </div>
      </section>

      <section id="contas" data-screen-label="Contas" style={{ background: "var(--surface-muted)" }}>
        <div
          style={{
            maxWidth: 1200,
            margin: "0 auto",
            padding: "120px 24px",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,420px),1fr))",
            gap: 64,
            alignItems: "center",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <span
              data-reveal="up"
              style={{
                fontSize: 12,
                fontWeight: 600,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: "var(--on-soft-brand)",
              }}
            >
              Centralização
            </span>
            <h2
              data-reveal="up"
              data-delay="80"
              style={{
                margin: 0,
                fontSize: "clamp(32px,4.4vw,56px)",
                lineHeight: 1.05,
                fontWeight: 700,
                letterSpacing: "-0.03em",
                textWrap: "balance",
              }}
            >
              Todas as tuas contas num só lugar
            </h2>
            <p
              data-reveal="up"
              data-delay="160"
              style={{
                margin: 0,
                fontSize: 17,
                lineHeight: 1.55,
                color: "var(--text-secondary)",
                textWrap: "pretty",
              }}
            >
              Adiciona as contas do BAI, Standard Bank, Banco Sol, BFA e
              Atlântico, ou cria uma conta manual para o dinheiro em mão. O teu
              património líquido é a soma de todas.
            </p>
          </div>
          <div
            data-reveal="right"
            data-key="accounts"
            style={{
              border: "1px solid var(--border-subtle)",
              borderRadius: 14,
              background: "var(--surface-card)",
              padding: 24,
              display: "flex",
              flexDirection: "column",
              gap: 20,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
              <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <span style={{ fontSize: 16, fontWeight: 600 }}>Distribuição das contas</span>
                <span style={{ fontSize: 13, color: "var(--text-secondary)" }}>
                  De onde vem o teu dinheiro.
                </span>
              </div>
              <WdIconTile icon="wallet" tone="brand" />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              <span style={{ fontSize: 13, color: "var(--text-secondary)" }}>Património</span>
              <span
                ref={countRef}
                data-count="3120000"
                style={{
                  fontSize: 36,
                  fontWeight: 700,
                  letterSpacing: "-0.02em",
                  fontVariantNumeric: "tabular-nums",
                }}
              >
                3.120.000,00 Kz
              </span>
            </div>
            <div
              style={{
                display: "flex",
                height: 10,
                borderRadius: 999,
                overflow: "hidden",
                gap: 3,
                background: "var(--surface-track)",
              }}
            >
              {accounts.map((a) => (
                <div
                  key={a.name}
                  style={{
                    flexGrow: a.live,
                    flexBasis: 0,
                    background: a.color,
                    transition: "flex-grow 1100ms cubic-bezier(.2,.8,.2,1)",
                  }}
                />
              ))}
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              {accounts.map((a) => (
                <div
                  key={a.name}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    padding: "12px 0",
                    borderTop: "1px solid var(--border-subtle)",
                  }}
                >
                  <span
                    style={{
                      width: 10,
                      height: 10,
                      borderRadius: 999,
                      background: a.color,
                      flex: "0 0 auto",
                    }}
                  />
                  <span style={{ flex: 1, minWidth: 0, fontSize: 14, fontWeight: 500 }}>
                    {a.name}
                  </span>
                  <span style={{ fontSize: 13, color: "var(--text-secondary)", fontVariantNumeric: "tabular-nums" }}>
                    {a.pct}
                  </span>
                  <span
                    style={{
                      fontSize: 14,
                      fontWeight: 600,
                      minWidth: 120,
                      textAlign: "right",
                      fontVariantNumeric: "tabular-nums",
                    }}
                  >
                    {a.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section
        id="disponivel"
        data-screen-label="Disponível"
        style={{ maxWidth: 1200, margin: "0 auto", padding: "120px 24px" }}
      >
        <div
          data-reveal="scale"
          style={{
            borderRadius: 20,
            background: "#040916",
            color: "#fff",
            overflow: "hidden",
            position: "relative",
          }}
        >
          <div style={{ position: "absolute", top: 0, bottom: 0, right: 0, width: "55%" }}>
            <WavesBackground />
          </div>
          <div
            style={{
              position: "absolute",
              top: 0,
              bottom: 0,
              left: "45%",
              width: "20%",
              background:
                "linear-gradient(90deg,#040916,rgba(4,9,22,0))",
            }}
          />
          <div
            style={{
              position: "relative",
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,380px),1fr))",
              gap: 40,
              padding: "clamp(32px,5vw,72px)",
              alignItems: "center",
            }}
          >
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <h2
                style={{
                  margin: 0,
                  fontSize: "clamp(32px,4.4vw,56px)",
                  lineHeight: 1.05,
                  fontWeight: 700,
                  letterSpacing: "-0.03em",
                  color: "#fff",
                  textWrap: "balance",
                }}
              >
                A Wundu já está disponível
              </h2>
              <p
                style={{
                  margin: 0,
                  fontSize: 17,
                  lineHeight: 1.55,
                  color: "#c2cbd8",
                  textWrap: "pretty",
                }}
              >
                Usa no navegador ou no teu telemóvel Android. Os dados ficam
                sincronizados entre os dois.
              </p>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <HV
                href="https://play.google.com/store/apps/details?id=com.wundu.mobile"
                data-reveal="up"
                data-delay="120"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 16,
                  padding: "18px 20px",
                  borderRadius: 14,
                  background: "#fff",
                  color: "#3b4655",
                  transition:
                    "transform 280ms cubic-bezier(.2,.8,.2,1), background-color 120ms cubic-bezier(.2,.8,.2,1)",
                }}
                hover={{ background: "#f4f4f5", transform: "translateX(6px)" }}
              >
                <WdIconTile icon="smartphone" tone="brand" />
                <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 2 }}>
                  <span style={{ fontSize: 13, color: "#62748e" }}>Disponível no</span>
                  <span style={{ fontSize: 17, fontWeight: 700 }}>Google Play</span>
                </div>
                <WdIcon name="arrow-up-right" size={20} />
              </HV>
              <HV
                href="/login"
                data-reveal="up"
                data-delay="200"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 16,
                  padding: "18px 20px",
                  borderRadius: 14,
                  background: "#fff",
                  color: "#3b4655",
                  transition:
                    "transform 280ms cubic-bezier(.2,.8,.2,1), background-color 120ms cubic-bezier(.2,.8,.2,1)",
                }}
                hover={{ background: "#f4f4f5", transform: "translateX(6px)" }}
              >
                <WdIconTile icon="monitor" tone="brand" />
                <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 2 }}>
                  <span style={{ fontSize: 13, color: "#62748e" }}>Abrir no navegador</span>
                  <span style={{ fontSize: 17, fontWeight: 700 }}>wundu.tech</span>
                </div>
                <WdIcon name="arrow-up-right" size={20} />
              </HV>
              <div
                data-reveal="up"
                data-delay="280"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 16,
                  padding: "18px 20px",
                  borderRadius: 14,
                  background: "#07162b",
                  border: "1px solid #223249",
                  color: "#c2cbd8",
                }}
              >
                <WdIcon name="clock" size={20} />
                <span style={{ fontSize: 15 }}>App Store · em breve</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        id="faq"
        data-screen-label="FAQ"
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: "0 24px 120px",
          display: "flex",
          flexWrap: "wrap",
          gap: 56,
        }}
      >
        <div style={{ flex: "1 1 300px", display: "flex", flexDirection: "column", gap: 14 }}>
          <span
            data-reveal="up"
            style={{
              fontSize: 12,
              fontWeight: 600,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: "var(--on-soft-brand)",
            }}
          >
            FAQ
          </span>
          <h2
            data-reveal="up"
            data-delay="80"
            style={{
              margin: 0,
              fontSize: "clamp(32px,4.4vw,56px)",
              lineHeight: 1.05,
              fontWeight: 700,
              letterSpacing: "-0.03em",
            }}
          >
            Perguntas frequentes
          </h2>
          <p
            data-reveal="up"
            data-delay="160"
            style={{ margin: 0, fontSize: 15, lineHeight: 1.55, color: "var(--text-secondary)" }}
          >
            Não encontraste a resposta? Escreve para{" "}
            <a href="mailto:support@wundu.tech" style={{ fontWeight: 600 }}>
              support@wundu.tech
            </a>
            .
          </p>
        </div>
        <div style={{ flex: "2 1 520px", minWidth: 0, display: "flex", flexDirection: "column" }}>
          {faqs.map((q) => (
            <div
              key={q.q}
              data-reveal="up"
              data-delay={q.delay}
              style={{ borderTop: "1px solid var(--border-subtle)" }}
            >
              <button
                type="button"
                onClick={q.toggle}
                aria-expanded={q.open}
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 16,
                  padding: "24px 0",
                  border: 0,
                  background: "none",
                  font: "inherit",
                  textAlign: "left",
                  color: "var(--text-primary)",
                  cursor: "pointer",
                }}
              >
                <span style={{ fontSize: 18, fontWeight: 600, textWrap: "pretty" }}>{q.q}</span>
                <span
                  style={{
                    width: 36,
                    height: 36,
                    flex: "0 0 auto",
                    borderRadius: 999,
                    background: q.iconBg,
                    color: q.iconColor,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    transform: `rotate(${q.rot})`,
                    transition:
                      "transform 280ms cubic-bezier(.2,.8,.2,1), background-color 120ms cubic-bezier(.2,.8,.2,1)",
                  }}
                >
                  <WdIcon name="plus" size={18} />
                </span>
              </button>
              <div
                style={{
                  display: "grid",
                  gridTemplateRows: q.rows,
                  transition: "grid-template-rows 280ms cubic-bezier(.2,.8,.2,1)",
                }}
              >
                <div style={{ overflow: "hidden", minHeight: 0 }}>
                  <p
                    style={{
                      margin: 0,
                      padding: "0 52px 24px 0",
                      fontSize: 15,
                      lineHeight: 1.6,
                      color: "var(--text-secondary)",
                      textWrap: "pretty",
                    }}
                  >
                    {q.a}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section data-screen-label="CTA" style={{ background: "var(--surface-muted)", overflow: "hidden" }}>
        <div
          style={{
            maxWidth: 1200,
            margin: "0 auto",
            padding: "112px 24px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
            gap: 20,
          }}
        >
          <img
            data-reveal="spin"
            src="/assets/logo.svg"
            alt=""
            style={{ height: 64, width: "auto" }}
          />
          <h2
            data-reveal="up"
            data-delay="100"
            style={{
              margin: 0,
              fontSize: "clamp(32px,4.4vw,56px)",
              lineHeight: 1.05,
              fontWeight: 700,
              letterSpacing: "-0.03em",
              textWrap: "balance",
            }}
          >
            Pronto para assumir o controlo?
          </h2>
          <p
            data-reveal="up"
            data-delay="180"
            style={{
              margin: 0,
              maxWidth: 540,
              fontSize: 17,
              lineHeight: 1.55,
              color: "var(--text-secondary)",
              textWrap: "pretty",
            }}
          >
            Cria a tua conta, confirma o email e começa hoje a transformar a
            tua relação com o dinheiro.
          </p>
          <WdButton
            href="/register"
            variant="primary"
            size="lg"
            iconRight="arrow-right"
            data-reveal="up"
            data-delay="260"
          >
            Criar conta
          </WdButton>
        </div>
      </section>

      <footer style={{ borderTop: "1px solid var(--border-subtle)" }}>
        <div
          style={{
            maxWidth: 1200,
            margin: "0 auto",
            padding: "48px 24px",
            display: "flex",
            flexWrap: "wrap",
            gap: 32,
            justifyContent: "space-between",
            alignItems: "flex-start",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <img
              src="/assets/logotype.svg"
              alt="Wundu, O Caminho Para a Liberdade Financeira"
              style={{ height: 44, width: "auto", alignSelf: "flex-start" }}
            />
            <span style={{ fontSize: 13, color: "var(--text-tertiary)" }}>
              © 2026 Wundu · Versão 2.0
            </span>
          </div>
          <div style={{ display: "flex", gap: 56, flexWrap: "wrap" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 10, fontSize: 14 }}>
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 600,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  color: "var(--text-tertiary)",
                }}
              >
                Produto
              </span>
              <a href="#sobre" style={{ color: "var(--text-secondary)" }}>Sobre nós</a>
              <a href="#funcionalidades" style={{ color: "var(--text-secondary)" }}>Funcionalidades</a>
              <a href="#disponivel" style={{ color: "var(--text-secondary)" }}>App</a>
              <a href="#faq" style={{ color: "var(--text-secondary)" }}>FAQ</a>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10, fontSize: 14 }}>
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 600,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  color: "var(--text-tertiary)",
                }}
              >
                Redes
              </span>
              <a href="https://www.instagram.com/onewundu/" target="_blank" rel="noopener noreferrer" style={{ color: "var(--text-secondary)" }}>Instagram</a>
              <a href="https://www.linkedin.com/company/onewundu/" target="_blank" rel="noopener noreferrer" style={{ color: "var(--text-secondary)" }}>LinkedIn</a>
              <a href="https://x.com/onewundu" target="_blank" rel="noopener noreferrer" style={{ color: "var(--text-secondary)" }}>X</a>
              <a
                href="https://web.facebook.com/people/Wundu/61574847264364/"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "var(--text-secondary)" }}
              >
                Facebook
              </a>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10, fontSize: 14 }}>
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 600,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  color: "var(--text-tertiary)",
                }}
              >
                Suporte
              </span>
              <a href="mailto:support@wundu.tech" style={{ color: "var(--text-secondary)" }}>
                support@wundu.tech
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}


