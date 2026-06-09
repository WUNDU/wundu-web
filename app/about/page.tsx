"use client";
import { useState } from "react";
import { Navbar } from "@/components/layout";
import {
  Star,
  Award,
  Users,
  Target,
  Layout,
  ArrowRight,
  ChevronDown,
} from "lucide-react";
import HeroSection from "@/components/ui/hero-section";
import { Footer } from "@/components/layout";
import Image from "next/image";
import {
  img130,
  img2place,
  imgCodepoint,
  imgFinal,
  imgFounders,
  imgGreatSolution,
  imgRanking,
  imgTop3,
  imgWundu,
} from "@/constants/images";

const faqs = [
  "1. O que é a Wundu e como ela funciona?",
  "2. A Wundu é segura para guardar os meus dados financeiros?",
  "3. Posso controlar despesas e receber em diferentes categorias?",
  "4. A Wundu ajuda com o acompanhamento das minhas metas financeiras?",
  "5. O que acontece se não vejo os gastos em informação real?",
];

export default function AboutLandingPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="font-sans bg-white text-gray-800 selection:bg-yellow-100 selection:text-yellow-900">
      <Navbar />
      <HeroSection backgroundImage={imgWundu} />

      <section className="pt-40 pb-20 px-8 text-center bg-linear-to-b relative overflow-hidden">
        <div className="inline-flex items-center gap-2 bg-yellow-50 border border-yellow-200 text-yellow-600 text-xs px-4 py-2 rounded-full mb-8">
          <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
          <span className="font-black tracking-tight uppercase">
            Nossa comunidade, experiências e projecto
          </span>
        </div>

        <h1 className="text-5xl md:text-7xl font-black text-gray-900 mb-8 leading-[1.05] tracking-tighter max-w-4xl mx-auto">
          <span className="text-yellow-400">"</span>Conheça nos melhor
          <span className="text-yellow-400">"</span>
        </h1>

        <p className="text-yellow-500 font-black text-sm uppercase tracking-[0.3em] mb-4">
          Somos
        </p>

        <p className="text-gray-500 max-w-2xl mx-auto text-lg md:text-xl leading-relaxed font-medium">
          Uma startup angolana que conquistou o{" "}
          <span className="font-mono tabular-nums font-bold text-gray-900">
            2º
          </span>{" "}
          lugar no Codepoint, concurso promovido pela Mirantes, reforçando a
          nossa capacidade de inovação, execução e impacto.
        </p>
      </section>

      {/* ── FOTO DA EQUIPA ── */}
      <section className="px-8 pb-24">
        <div className="max-w-6xl mx-auto rounded-xl overflow-hidden shadow-xl shadow-black/5 border border-black/3 relative group">
          <Image
            src={imgFounders}
            alt="founders"
            className="w-full h-auto object-cover"
            priority
          />
        </div>
      </section>

      {/* ── TEXTO DE MISSÃO ── */}
      <section className="px-8 py-20 max-w-4xl mx-auto text-center">
        <p className="text-gray-900 text-xl md:text-2xl leading-relaxed font-semibold italic tracking-tight">
          Através de tecnologia acessível e um design intuitivo, oferecemos uma
          experiência simples, rápida e personalizada, permitindo que cada
          utilizador compreenda para onde vai o seu dinheiro e tome decisões
          mais conscientes.
        </p>
      </section>

      {/* ── CODEPOINT AWARD + MISSÃO ── */}
      <section className="px-8 py-24 max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center">
        <div className="rounded-xl overflow-hidden shadow-2xl shadow-black/5 border border-black/3 w-full relative group animate-in fade-in slide-in-from-left">
          <Image
            src={imgTop3}
            alt="Top 3 Codepoint"
            className="w-full h-auto"
            quality={100}
          />
          <div className="absolute inset-0 bg-linear-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>

        <div className="animate-in fade-in slide-in-from-right duration-300">
          <div className="flex items-center gap-3 mb-8">
            <div className="h-px w-12 bg-yellow-400" />
            <span className="font-black text-gray-900 text-2xl tracking-tighter uppercase">
              WUNDU
            </span>
          </div>
          <p className="text-gray-500 text-lg md:text-xl leading-relaxed font-medium">
            A Wundu tem como finalidade ajudar jovens e trabalhadores a
            organizarem melhor o seu núcleo financeiro, promovendo educação
            financeira prática, controlo de despesas e construção de hábitos
            saudáveis de poupança.
          </p>
        </div>
      </section>

      {/* ── GALERIA DE IMAGENS ── */}
      <section className="px-8 py-24 bg-gray-50/50">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="rounded-xl overflow-hidden bg-white border border-black/3 shadow-md shadow-black/5 lg:col-span-2 group relative animate-in fade-in zoom-in-95">
              <Image
                src={imgRanking}
                alt="Ranking"
                className="w-full h-auto"
                quality={100}
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/10 to-transparent" />
            </div>

            <div className="flex flex-col gap-8 h-full animate-in fade-in zoom-in-95 duration-300 delay-150">
              <div className="flex-1 rounded-xl overflow-hidden bg-white border border-black/3 shadow-md shadow-black/5 group relative">
                <Image
                  src={img2place}
                  alt="2nd Place"
                  fill
                  className="object-cover"
                  quality={100}
                />
              </div>
              <div className="flex-1 rounded-xl overflow-hidden bg-white border border-black/3 shadow-md shadow-black/5 group relative">
                <Image
                  src={img130}
                  alt="130"
                  fill
                  className="object-cover"
                  quality={100}
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
            <div className="rounded-xl overflow-hidden bg-white border border-black/3 shadow-md shadow-black/5 group relative h-80 md:h-112.5 animate-in fade-in zoom-in-95 delay-300">
              <Image
                src={imgGreatSolution}
                alt="Great Solution"
                fill
                className="object-cover"
                quality={100}
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/10 to-transparent" />
            </div>
            <div className="rounded-xl overflow-hidden bg-white border border-black/3 shadow-md shadow-black/5 group relative h-80 md:h-112.5 animate-in fade-in zoom-in-95 delay-450">
              <Image
                src={imgCodepoint}
                alt="Codepoint"
                fill
                className="object-cover"
                quality={100}
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/10 to-transparent" />
            </div>
          </div>
        </div>
      </section>

      {/* ── GRANDE FINAL BANNER ── */}
      <section className="px-8 py-24">
        <div className="max-w-6xl mx-auto rounded-2xl overflow-hidden shadow-2xl shadow-blue-900/20 bg-blue-950 w-full relative group border border-blue-900">
          <Image
            src={imgFinal}
            alt="Grande Final"
            className="w-full h-auto opacity-60"
            quality={100}
          />
          <div className="absolute inset-0 bg-linear-to-br from-blue-900/80 via-blue-950/40 to-transparent" />
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-12">
            <h3 className="text-3xl md:text-5xl font-black text-white mb-6 tracking-tighter drop-shadow-2xl">
              GRANDE FINAL
            </h3>
            <p className="text-yellow-400 text-xl md:text-3xl font-mono tabular-nums font-black tracking-[0.2em] drop-shadow-lg">
              PRÉMIO 20 MILHÕES
            </p>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-32 px-8 bg-blue-950 text-center text-white relative overflow-hidden">
        <h2 className="text-4xl md:text-6xl font-extrabold mb-8 relative tracking-tighter">
          Pronto para assumir o controle?
        </h2>
        <p className="text-blue-200 text-xl max-w-2xl mx-auto mb-12 font-medium relative leading-relaxed">
          Junte-se a nós e comece hoje a transformar a tua relação com o
          dinheiro, com mais controlo, clareza e confiança.
        </p>
        <button className="bg-yellow-400 text-white px-14 py-5 rounded-full font-black text-xl hover:bg-yellow-500 hover:scale-105 active:scale-95 transition-all duration-300 shadow-2xl hover:shadow-glow-primary relative flex items-center gap-3 mx-auto">
          Começar agora
          <ArrowRight className="w-6 h-6" />
        </button>
      </section>

      {/* ── FAQ ── */}
      <section id="faq" className="py-32 px-8 bg-white">
        <h2 className="text-4xl md:text-5xl font-black text-center mb-20 text-gray-900 tracking-tighter">
          Perguntas frequentes <span className="text-yellow-400">(FAQ)</span>
        </h2>
        <div className="max-w-3xl mx-auto space-y-6">
          {faqs.map((faq, i) => (
            <div
              key={i}
              className={`border rounded-xl overflow-hidden transition-[transform,box-shadow,border-color,background-color] duration-200 ${openFaq === i ? "border-yellow-200 shadow-soft-lg ring-1 ring-yellow-100" : "border-gray-100 hover:border-gray-200 shadow-sm"}`}
            >
              <button
                className="w-full text-left px-8 py-6 text-base md:text-lg font-black text-gray-800 flex items-center justify-between hover:bg-gray-50/50 transition-colors group"
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
              >
                <span className="tracking-tight">{faq}</span>
                <div
                  className={`w-10 h-10 rounded-lg flex items-center justify-center transition-[transform,box-shadow,border-color,background-color] duration-200 ${openFaq === i ? "bg-yellow-400 text-white rotate-180" : "bg-gray-100 text-gray-400 group-hover:bg-gray-200"}`}
                >
                  <ChevronDown className="w-5 h-5" />
                </div>
              </button>
              {openFaq === i && (
                <div className="px-8 pb-8 pt-2 text-base text-gray-500 leading-relaxed font-medium">
                  A Wundu oferece funcionalidades completas para gerir as suas
                  finanças pessoais com segurança e simplicidade. A nossa
                  plataforma foi desenvolvida com as melhores práticas de
                  segurança para proteger os seus dados.
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ── BIG TEXT FOOTER ── */}
      <div className="py-24 text-center overflow-hidden bg-gray-50/50">
        <p
          className="font-black tracking-widest select-none text-gray-100/60"
          style={{ fontSize: "clamp(3rem, 15vw, 12rem)" }}
        >
          WUNDU
        </p>
      </div>

      <Footer />
    </div>
  );
}
