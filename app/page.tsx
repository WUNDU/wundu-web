"use client";
import { Navbar } from "@/components/layout";
import Link from "next/link";
import { ROUTES } from "@/constants/routes";
import {
  RefreshCw,
  BarChart3,
  TrendingUp,
  Target,
  CircleDollarSign,
  CreditCard,
  Flame,
  Globe,
  ChevronDown,
  Wallet,
  PieChart,
  FileText,
  ArrowRight,
  Zap,
  TrendingDown,
  Coins,
} from "lucide-react";
import { LogoType } from "@/components/ui";
import {
  AppleIcon,
  PlayStoreIcon,
  SettingsRightBarIcon,
} from "@/constants/icons";
import HeroSection from "@/components/ui/hero-section";
import { Footer } from "@/components/layout";
import { useCountUp } from "@/hooks/use-count-up";
import { useCountdown } from "@/hooks/use-countdown";
import { ScrollAnimationWrapper } from "@/components/layout";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { imgDashboard } from "@/constants/images";
import { Smartphone } from "lucide-react";

const LAUNCH_DATE = new Date("2026-06-08T18:00:00");

const StatCounter = ({ end, label }: { end: string; label: string }) => {
  const [startCount, setStartCount] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const count = useCountUp(parseInt(end), 2000, startCount);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStartCount(true);
          observer.disconnect();
        }
      },
      { threshold: 0.5 },
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className="text-center group">
      <p className="text-4xl md:text-5xl font-black text-gray-900 group-hover:text-yellow-400 transition-colors tracking-tighter tabular-nums">
        <span>+</span> {count}
      </p>
      <p className="text-[10px] md:text-xs font-black text-gray-400 uppercase tracking-[0.2em] mt-3">
        {label}
      </p>
    </div>
  );
};

const stats = [
  { value: "200", label: "Usuários cadastrados" },
  { value: "193", label: "Usuários activos" },
  { value: "10", label: "Utilizadores recorrentes" },
];

const features = [
  {
    icon: <RefreshCw className="w-6 h-6" />,
    title: "Gestão de gastos",
    desc: "Registe automaticamente detalhes com categorização. Analise por filtros e controle suas despesas e gastos, sempre.",
  },
  {
    icon: <BarChart3 className="w-6 h-6" />,
    title: "Gestão de Orçamento",
    desc: "Defina limites mensais e organize os seus gastos por categoria para manter suas finanças pessoais organizadas.",
  },
  {
    icon: <TrendingUp className="w-6 h-6" />,
    title: "Metas Financeiras",
    desc: "Defina objectivos, controle suas economias e relatórios em tempo real. Inclui informações, gráficos e análises.",
  },
];

const faqs = [
  {
    question: "1. O que é a Wundu e como ela funciona?",
    answer:
      "A Wundu é uma aplicação para gerir o teu dinheiro. Registas o que ganhas e o que gastas, defines categorias e acompanhas as tuas metas — tudo num só lugar, de forma simples.",
  },
  {
    question: "2. A Wundu é segura para guardar os meus dados financeiros?",
    answer:
      "Sim, os teus dados estão protegidos. Ninguém tem acesso à tua conta a não ser tu, e nunca partilhamos as tuas informações com terceiros.",
  },
  {
    question: "3. Posso controlar despesas e receber em diferentes categorias?",
    answer:
      "Claro! Podes organizar cada gasto por categoria — Alimentação, Transporte, Saúde, Lazer e muito mais. Também podes criar as tuas próprias categorias se precisares.",
  },
  {
    question: "4. A Wundu ajuda com o acompanhamento das minhas metas financeiras?",
    answer:
      "Sim! Defines um valor que queres poupar e uma data limite. A Wundu mostra-te quanto já poupaste e quanto falta, para te manteres motivado.",
  },
  {
    question: "5. O que acontece se não vejo os gastos actualizados?",
    answer:
      "Experimenta fechar e abrir a aplicação novamente. Se continuar sem actualizar, verifica a tua ligação à internet. Ainda com problemas? O nosso suporte ajuda-te.",
  },
];

// Configuração dos planetas (nós orbitais)
const nucleusNodes = [
  // Órbita Interna (Radius: 130px)
  {
    label: "Receitas",
    icon: <CircleDollarSign className="w-5 h-5" />,
    color: "bg-green-500",
    angle: 0,
    orbit: "var(--orbit-inner)",
    duration: "20s",
  },
  {
    label: "Despesas",
    icon: <TrendingDown className="w-5 h-5" />,
    color: "bg-red-500",
    angle: 120,
    orbit: "var(--orbit-inner)",
    duration: "20s",
  },
  {
    label: "Metas",
    icon: <Target className="w-5 h-5" />,
    color: "bg-yellow-500",
    angle: 240,
    orbit: "var(--orbit-inner)",
    duration: "20s",
  },

  // Órbita Média (Radius: 200px)
  {
    label: "Cartões",
    icon: <CreditCard className="w-5 h-5" />,
    color: "bg-purple-500",
    angle: 60,
    orbit: "var(--orbit-middle)",
    duration: "35s",
  },
  {
    label: "Relatórios",
    icon: <FileText className="w-5 h-5" />,
    color: "bg-blue-500",
    angle: 180,
    orbit: "var(--orbit-middle)",
    duration: "35s",
  },
  {
    label: "Orçamento",
    icon: <PieChart className="w-5 h-5" />,
    color: "bg-pink-500",
    angle: 300,
    orbit: "var(--orbit-middle)",
    duration: "35s",
  },

  // Órbita Externa (Radius: 270px)
  {
    label: "Investir",
    icon: <Coins className="w-5 h-5" />,
    color: "bg-indigo-600",
    angle: 150,
    orbit: "var(--orbit-outer)",
    duration: "50s",
  },
  {
    label: "Poupança",
    icon: <Wallet className="w-5 h-5" />,
    color: "bg-emerald-600",
    angle: 330,
    orbit: "var(--orbit-outer)",
    duration: "50s",
  },
];

const CountdownDisplay = () => {
  const { timeLeft, isLaunched, isLoading } = useCountdown(LAUNCH_DATE);

  if (isLoading || isLaunched) return null;

  const TimeUnit = ({ value, label }: { value: number; label: string }) => (
    <div className="flex flex-col items-center">
      <div className="w-14 h-14 md:w-18 md:h-18 bg-gray-900 rounded-xl flex items-center justify-center mb-2 shadow-inner relative overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-b from-yellow-400/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        <span className="text-lg md:text-xl font-black text-white tabular-nums leading-none relative z-10 font-mono">
          {value.toString().padStart(2, "0")}
        </span>
      </div>
      <span className="text-[8px] font-black text-gray-500 uppercase tracking-widest">
        {label}
      </span>
    </div>
  );

  return (
    <div className="flex gap-3 md:gap-5 justify-center items-end">
      <TimeUnit value={timeLeft.days} label="Dias" />
      <div className="flex flex-col items-center mb-2">
        <div className="w-1.5 h-1.5 bg-gray-300 rounded-full" />
        <div className="w-1.5 h-1.5 bg-gray-300 rounded-full mt-1.5" />
      </div>
      <TimeUnit value={timeLeft.hours} label="Hrs" />
      <div className="flex flex-col items-center mb-2">
        <div className="w-1.5 h-1.5 bg-gray-300 rounded-full" />
        <div className="w-1.5 h-1.5 bg-gray-300 rounded-full mt-1.5" />
      </div>
      <TimeUnit value={timeLeft.minutes} label="Mins" />
      <div className="flex flex-col items-center mb-2">
        <div className="w-1.5 h-1.5 bg-gray-300 rounded-full" />
        <div className="w-1.5 h-1.5 bg-gray-300 rounded-full mt-1.5" />
      </div>
      <TimeUnit value={timeLeft.seconds} label="Segs" />
    </div>
  );
};

export default function WunduPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const { isLaunched } = useCountdown(LAUNCH_DATE);

  return (
    <div className="font-sans bg-white text-gray-800 selection:bg-yellow-100 selection:text-yellow-900 overflow-x-hidden">
      <Navbar />

      <HeroSection />

      {/* ── STATS ── */}
      <section className="py-20 px-4 md:px-8 border-y border-gray-50 bg-white">
        <ScrollAnimationWrapper className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-12">
          <div className="text-center md:text-left">
            <h2 className="font-black text-3xl text-gray-900 leading-tight tracking-tighter">
              Mais controle.
              <br />
              <span className="text-yellow-400">Menos preocupação.</span>
            </h2>
          </div>
          <div className="flex flex-wrap justify-center gap-8 md:gap-24">
            {stats.map((s) => (
              <StatCounter key={s.value} end={s.value} label={s.label} />
            ))}
          </div>
        </ScrollAnimationWrapper>
      </section>

      {/* ── FEATURES ── */}
      <section
        id="funcionalidades"
        className="py-20 md:py-32 px-4 md:px-8 text-center bg-white relative overflow-hidden"
      >
        <div className="absolute top-40 left-20 w-80 h-80 bg-yellow-50 rounded-full opacity-50 md:opacity-100" />
        <div className="absolute bottom-40 right-20 w-125 h-125 bg-blue-50/40 rounded-full opacity-50 md:opacity-100" />
        <ScrollAnimationWrapper animation="animate-in fade-in slide-in-from-bottom duration-1000">
          <div className="inline-flex items-center gap-2 bg-yellow-50 border border-yellow-200 text-yellow-600 text-xs px-5 py-2 rounded-full mb-8 relative">
            <SettingsRightBarIcon stroke="fill" />
            <span className="font-black tracking-tight uppercase">
              Funcionalidades
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-black mb-12 md:mb-20 text-gray-900 relative tracking-tighter">
            Transparência. Segurança.
            <br />
            <span className="text-yellow-400">Confiança.</span>
          </h2>
          <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-6 md:gap-8 text-left relative">
            {features.map((f, i) => (
              <ScrollAnimationWrapper
                key={f.title}
                animation="animate-in fade-in zoom-in-95 duration-700"
                delay={i * 200}
                className="h-full"
              >
                <div className="bg-white rounded-4xl md:rounded-[2.5rem] p-8 md:p-10 shadow-soft border border-gray-100 hover:shadow-soft-lg hover:-translate-y-2 md:hover:-translate-y-3 transition-all duration-500 group h-full">
                  <div className="w-14 h-14 md:w-16 md:h-16 bg-yellow-50 border border-yellow-100 rounded-2xl md:rounded-3xl flex items-center justify-center text-yellow-500 mb-6 md:mb-8 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                    {f.icon}
                  </div>
                  <h3 className="font-black text-xl md:text-2xl text-gray-800 mb-4 tracking-tight">
                    {f.title}
                  </h3>
                  <p className="text-sm md:text-base text-gray-500 leading-relaxed font-medium">
                    {f.desc}
                  </p>
                </div>
              </ScrollAnimationWrapper>
            ))}
          </div>
        </ScrollAnimationWrapper>
      </section>

      {/* ── APP PREVIEW ── */}
      <section className="py-20 md:py-32 px-4 md:px-8 bg-gray-50 text-center relative overflow-hidden">
        <ScrollAnimationWrapper>
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-yellow-50 border border-yellow-200 text-yellow-600 text-xs px-5 py-2 rounded-full mb-8">
            <Zap className="w-4 h-4" />
            <span className="font-black tracking-tight uppercase">wunduApp</span>
          </div>

          {/* Title */}
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-black mb-6 text-gray-900 tracking-tighter max-w-3xl mx-auto">
            Produto concebido para oferecer a melhor{" "}
            <span className="text-yellow-400">experiência</span> ao utilizador
          </h2>

          {/* Subtitle */}
          <p className="text-gray-500 max-w-2xl mx-auto mb-10 text-base md:text-lg font-medium leading-relaxed">
            Desenvolvido com foco no utilizador, este produto combina
            simplicidade, usabilidade e eficiência para proporcionar uma
            experiência intuitiva, fluida e orientada a resultados.
          </p>

          {/* CTA */}
          <Link href={ROUTES.REGISTER}>
            <button className="bg-yellow-400 text-white px-10 py-4 rounded-full font-black text-lg hover:bg-yellow-500 hover:scale-105 active:scale-95 transition-all duration-300 shadow-xl mb-16 inline-flex items-center gap-2">
              comece aqui
            </button>
          </Link>

          {/* Dashboard screenshot */}
          <div className="relative max-w-5xl mx-auto rounded-2xl overflow-hidden border-2 border-yellow-400 shadow-2xl shadow-yellow-400/10">
            <Image
              src={imgDashboard}
              alt="Wundu Dashboard"
              className="w-full"
              placeholder="blur"
              sizes="(max-width: 1024px) 100vw, 1024px"
            />
          </div>
        </ScrollAnimationWrapper>
      </section>

      {/* ── NUCLEUS (Advanced Planetary Orbit) ── */}
      <section className="py-20 md:py-32 px-4 md:px-8 text-center bg-white relative overflow-hidden">
        <ScrollAnimationWrapper>
          <div className="inline-flex items-center gap-2 bg-yellow-50 border border-yellow-200 text-yellow-600 text-xs px-5 py-2 rounded-full mb-8">
            <Globe className="w-6 h-6" />
            <span className="font-black tracking-tight uppercase">
              Centralização
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-black mb-6 text-gray-900 tracking-tighter">
            Organize o seu núcleo financeiro
          </h2>
          <p className="text-gray-500 text-base md:text-lg max-w-xl mx-auto mb-16 md:mb-32 font-medium leading-relaxed">
            O centro de todas as suas operações financeiras sincronizado em
            tempo real.
          </p>

          {/* Orbit Stage */}
          <div
            className="relative w-full max-w-[320px] aspect-square md:max-w-none md:w-162.5 md:h-162.5 mx-auto"
            style={{
              // @ts-ignore
              "--orbit-inner": "min(130px, 20vw)",
              "--orbit-middle": "min(200px, 30vw)",
              "--orbit-outer": "min(270px, 40vw)",
            }}
          >
            {/* 1. Outer Orbit (Tracejada) */}
            <div
              className="absolute inset-0 rounded-full border-2 border-dashed border-gray-200 scale-100 opacity-60 animate-spin-slow"
              style={{
                width: "calc(var(--orbit-outer) * 2)",
                height: "calc(var(--orbit-outer) * 2)",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
              }}
            />

            {/* 2. Middle Orbit (Tracejada) */}
            <div
              className="absolute inset-0 rounded-full border-2 border-dashed border-gray-200 opacity-80 animate-spin-reverse-slow"
              style={{
                width: "calc(var(--orbit-middle) * 2)",
                height: "calc(var(--orbit-middle) * 2)",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
              }}
            />

            {/* 3. Inner Orbit (Tracejada) */}
            <div
              className="absolute inset-0 rounded-full border-2 border-dashed border-gray-200 opacity-100 animate-spin-slow"
              style={{
                width: "calc(var(--orbit-inner) * 2)",
                height: "calc(var(--orbit-inner) * 2)",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
              }}
            />

            {/* Center Sun (Wundu Core) */}
            <div className="absolute inset-0 flex items-center justify-center z-30">
              <div className="w-24 h-24 md:w-44 md:h-44 rounded-full bg-white/10 shadow-2xl border border-gray-100 flex flex-col items-center justify-center gap-3 group cursor-pointer hover:scale-110 transition-transform duration-700 animate-pulse-slow">
                <div className="flex items-center justify-center shadow-glow-primary transition-transform duration-1000 group-hover:rotate-360 scale-75 md:scale-100 p-4">
                  <LogoType />
                </div>
              </div>
            </div>

            {/* Planetary Nodes */}
            {nucleusNodes.map((node, i) => (
              <div
                key={node.label}
                className="absolute inset-0 z-20 pointer-events-none"
                style={{ animation: `spin ${node.duration} linear infinite` }}
              >
                <div
                  className="absolute flex flex-col items-center group pointer-events-auto"
                  style={{
                    left: "50%",
                    top: "50%",
                    transform: `rotate(${node.angle}deg) translate(${node.orbit}) rotate(-${node.angle}deg)`,
                  }}
                >
                  {/* Counter-rotation to keep icons upright */}
                  <div
                    className="relative"
                    style={{
                      animation: `spin ${node.duration} linear infinite reverse`,
                    }}
                  >
                    <div
                      className={`w-10 h-10 md:w-18 md:h-18 rounded-full ${node.color} shadow-xl flex items-center justify-center border-[3px] md:border-[5px] border-white/10 group-hover:scale-125 transition-transform cursor-pointer text-white`}
                    >
                      <div className="scale-75 md:scale-100">{node.icon}</div>
                    </div>
                    <div className="absolute top-full mt-2 md:mt-4 left-1/2 -translate-x-1/2 px-2 md:px-4 py-1 md:py-1.5 bg-white/90 md:bg-white/20 shadow-soft rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300">
                      <span className="text-gray-900 font-black text-[8px] md:text-[10px] uppercase tracking-widest whitespace-nowrap">
                        {node.label}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollAnimationWrapper>
      </section>

      {/* ── APP DOWNLOAD & COUNTDOWN ── */}
      <section className="py-20 md:py-24 px-4 md:px-8 bg-gray-50/50 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-6xl h-full pointer-events-none">
          <div className="absolute top-1/4 -left-20 w-72 h-72 bg-yellow-100/30 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 -right-20 w-72 h-72 bg-blue-100/20 rounded-full blur-3xl" />
        </div>

        <ScrollAnimationWrapper className="max-w-5xl mx-auto relative z-10">
          <div className="text-center mb-12 md:mb-16">
            <div className="inline-flex items-center gap-2 bg-white border border-gray-100 shadow-sm text-yellow-600 text-[10px] font-black px-4 py-2 rounded-full mb-6 uppercase tracking-[0.2em]">
              <Smartphone className="w-3.5 h-3.5" />
              <span>Plataforma em Evolução</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-black mb-6 text-gray-900 tracking-tighter">
              Aguarde a grande <span className="text-yellow-400">estreia</span>
            </h2>
            <p className="text-gray-500 text-base md:text-lg font-medium leading-relaxed max-w-2xl mx-auto">
              Estamos a reconstruir a Wundu. No dia 08 de Junho, a nossa
              infraestrutura financeira web e mobile estará disponível para todos.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-4 mb-16">
            {/* Ultra Compact Play Store */}
            <div className="bg-white p-3 md:p-4 rounded-2xl border border-gray-100 shadow-soft hover:shadow-soft-lg transition-all duration-500 group flex items-center gap-3 w-full max-w-[220px]">
              <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center group-hover:bg-yellow-50 transition-colors">
                <div className="scale-110">
                  <PlayStoreIcon />
                </div>
              </div>
              <div className="text-left">
                <p className="text-[7px] font-black text-yellow-600 uppercase tracking-widest leading-none mb-1">
                  Android & Web
                </p>
                <h3 className="text-xs font-black text-gray-900 leading-none">
                  Google Play
                </h3>
              </div>
            </div>

            {/* Ultra Compact App Store */}
            <div className="bg-white p-3 md:p-4 rounded-2xl border border-gray-100 shadow-soft hover:shadow-soft-lg transition-all duration-500 group flex items-center gap-3 w-full max-w-[220px] opacity-60">
              <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center group-hover:bg-gray-100 transition-colors">
                <div className="scale-110">
                  <AppleIcon />
                </div>
              </div>
              <div className="text-left">
                <p className="text-[7px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">
                  iOS em breve
                </p>
                <h3 className="text-xs font-black text-gray-900 leading-none">
                  App Store
                </h3>
              </div>
            </div>
          </div>

          {/* Dedicated Countdown Card */}
          {!isLaunched && (
            <div className="max-w-2xl mx-auto bg-white p-8 md:p-12 rounded-[2.5rem] border border-gray-100 shadow-soft-lg relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-full h-1 bg-yellow-400" />
              <div className="absolute -top-24 -right-24 w-48 h-48 bg-yellow-50 rounded-full blur-3xl opacity-50 group-hover:opacity-100 transition-opacity" />
              
              <div className="relative z-10 text-center">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mb-10">
                  Lançamento Oficial em
                </p>
                
                <CountdownDisplay />
                
                <div className="mt-12 flex flex-col items-center">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse" />
                    <span className="text-xs font-black text-gray-900 uppercase tracking-tighter">
                      08 de Junho, 2026
                    </span>
                  </div>
                  <p className="text-[10px] text-gray-400 font-medium">
                    Site Oficial & Google Play Store
                  </p>
                </div>
              </div>
            </div>
          )}
        </ScrollAnimationWrapper>
      </section>

      {/* ── CTA ── */}
      <section className="py-20 md:py-32 px-6 md:px-8 mx-4 md:mx-10 lg:mx-40 bg-blue-950 text-center text-white relative overflow-hidden rounded-3xl md:rounded-[2.5rem]">
        <ScrollAnimationWrapper animation="animate-in fade-in zoom-in-95 duration-1000">
          <div className="absolute top-0 right-0 w-80 h-80 md:w-150 md:h-150 bg-[#003CC3]/40 rounded-full -mr-40 -mt-40 md:-mr-80 md:-mt-80" />
          <div className="absolute bottom-0 left-0 w-80 h-80 md:w-150 md:h-150 bg-[#FFC727]/20 rounded-full -ml-40 -mb-40 md:-ml-80 md:-mb-80" />
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-extrabold mb-6 md:mb-8 relative z-10 tracking-tighter">
            Pronto para assumir o controle?
          </h2>
          <p className="text-blue-200 text-lg md:text-xl max-w-2xl mx-auto mb-10 md:mb-12 font-medium relative z-10 leading-relaxed">
            Junta-te a nós e começa hoje a transformar a tua relação com o
            dinheiro, com mais controlo, clareza e confiança.
          </p>
          <button className="bg-yellow-400 text-white px-10 md:px-14 py-4 md:py-5 rounded-full font-black text-lg md:text-xl hover:bg-yellow-500 hover:scale-105 active:scale-95 transition-all duration-300 shadow-2xl relative z-10 flex items-center gap-3 mx-auto">
            Começar agora <ArrowRight className="w-6 h-6" />
          </button>
        </ScrollAnimationWrapper>
      </section>

      {/* ── FAQ ── */}
      <section id="faq" className="py-20 md:py-32 px-4 md:px-8 bg-white">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-center mb-12 md:mb-20 text-gray-900 tracking-tighter">
          Perguntas frequentes <span className="text-yellow-400">(FAQ)</span>
        </h2>
        <div className="max-w-3xl mx-auto space-y-4 md:space-y-6">
          {faqs.map((faq, i) => (
            <div
              key={i}
              className={`border rounded-2xl md:rounded-4xl overflow-hidden transition-all duration-500 ${openFaq === i ? "border-yellow-200 shadow-soft-lg ring-1 ring-yellow-100" : "border-gray-100 hover:border-gray-200 shadow-sm"}`}
            >
              <button
                className="w-full text-left px-6 py-5 md:px-8 md:py-6 text-sm md:text-lg font-black text-gray-800 flex items-center justify-between hover:bg-gray-50/50 transition-colors group"
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
              >
                <span className="tracking-tight">{faq.question}</span>
                <div
                  className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center transition-all duration-500 shrink-0 ml-4 ${openFaq === i ? "bg-yellow-400 text-white rotate-180" : "bg-gray-100 text-gray-400 group-hover:bg-gray-200"}`}
                >
                  <ChevronDown className="w-4 h-4 md:w-5 md:h-5" />
                </div>
              </button>
              <div
                className={`overflow-hidden transition-all duration-500 ease-in-out ${openFaq === i ? "max-h-60 opacity-100" : "max-h-0 opacity-0"}`}
              >
                <div className="px-6 pb-6 md:px-8 md:pb-8 pt-2 text-sm md:text-base text-gray-500 leading-relaxed font-medium">
                  {faq.answer}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── BIG TEXT FOOTER ── */}
      <div className="py-10 md:py-20 text-center overflow-hidden bg-gray-50/30">
        <p
          className="font-black tracking-widest select-none text-gray-100/60"
          style={{ fontSize: "clamp(2rem, 15vw, 12rem)" }}
        >
          WUNDU
        </p>
      </div>

      <Footer />
    </div>
  );
}
