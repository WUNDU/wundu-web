import Link from "next/link";
import {
  imgMountain,
  imgAvatarCeo,
  imgAvatarCfo,
  imgAvatarUiux,
  imgScreenHome,
  imgScreenAI,
  imgScreenScan,
} from "@/constants/images";
import { useCountUp } from "@/hooks/use-count-up";
import { Flame } from "lucide-react";
import Image, { StaticImageData } from "next/image";
import React from "react";

interface HeroSectionProps {
  backgroundImage?: string | StaticImageData;
}

const avatars = [
  { src: imgAvatarCeo, alt: "CEO Wundu" },
  { src: imgAvatarCfo, alt: "CFO Wundu" },
  { src: imgAvatarUiux, alt: "UI/UX Wundu" },
];

export default function HeroSection({
  backgroundImage = imgMountain,
}: HeroSectionProps) {
  const count = useCountUp(200);

  return (
    <section className="relative w-full overflow-hidden min-h-[560px] md:min-h-[650px] lg:min-h-[900px]">
      <Image
        src={backgroundImage}
        alt="Hero Background"
        fill
        className="object-cover"
        priority
        placeholder="blur"
        sizes="100vw"
        quality={85}
      />

      <div className="absolute inset-0 bg-black/55 flex flex-col">
        {/* Main text content */}
        <div className="flex flex-col items-center text-center px-6 pt-36 md:pt-44 pb-10 md:pb-8 flex-1 justify-center">
          {/* Social proof badge */}
          <div className="inline-flex items-center gap-3 bg-yellow-400/10 border border-yellow-400/30 text-yellow-400 text-xs px-3 py-2 rounded-xl mb-8 relative z-20 animate-in fade-in slide-in-from-top duration-700">
            <div className="flex -space-x-3">
              {avatars.map((avatar, i) => (
                <div
                  key={i}
                  className="relative w-8 h-8 rounded-full overflow-hidden border-2 border-white/80 shrink-0"
                  style={{ zIndex: avatars.length - i }}
                >
                  <Image
                    src={avatar.src}
                    alt={avatar.alt}
                    fill
                    className="object-cover object-top"
                    sizes="32px"
                    priority={false}
                    loading="lazy"
                  />
                </div>
              ))}
            </div>
            <Flame className="w-3.5 h-3.5 animate-pulse" />
            <span className="text-white font-mono tabular-nums font-black tracking-tight">
              +{count} Pessoas estão a usar a{" "}
              <span className="text-yellow-400">Wundu</span>
            </span>
          </div>

          <h1 className="text-4xl md:text-7xl lg:text-8xl font-black text-white mb-6 leading-[1.05] tracking-tighter relative z-20 animate-in fade-in slide-in-from-bottom duration-700">
            O futuro das suas <span className="text-yellow-400">finanças</span>
          </h1>

          <p className="text-white/90 max-w-xl mx-auto mb-10 text-base md:text-xl leading-relaxed font-medium relative z-20 animate-in fade-in slide-in-from-bottom duration-700 delay-150">
            Com o WUNDU, controlar os teus gastos, definir metas e organizar os
            teus cartões torna-se simples e{" "}
            <span className="text-yellow-400 font-bold italic underline decoration-yellow-400/30 underline-offset-4">
              intuitivo
            </span>
            .
          </p>

          <div className="relative z-20 animate-in fade-in slide-in-from-bottom duration-700 delay-300 w-full flex justify-center">
            <Link href="/register" className="bg-yellow-400 text-white px-10 sm:px-12 py-4 sm:py-5 rounded-full font-black text-lg sm:text-xl hover:bg-yellow-500 hover:scale-105 active:scale-95 transition-all duration-300 shadow-2xl hover:shadow-yellow-400/20">
              Comece aqui
            </Link>
          </div>
        </div>

        {/* App mockups — pinned to bottom of hero */}
        <div className="hidden sm:flex mt-auto items-end justify-center gap-4 lg:gap-10 px-8 pb-0 relative z-20 animate-in fade-in slide-in-from-bottom duration-1000 delay-500">
          {/* Left: AI screen — desktop only */}
          <div className="hidden lg:block w-52 xl:w-64 flex-shrink-0 drop-shadow-2xl self-end -translate-y-8 rotate-[-6deg] origin-bottom opacity-90">
            <Image
              src={imgScreenAI}
              alt="Wundu IA"
              className="w-full rounded-[2rem] ring-1 ring-white/20"
              priority={false}
              placeholder="blur"
              sizes="(max-width: 1280px) 208px, 256px"
              loading="lazy"
            />
          </div>

          {/* Center: Home screen */}
          <div className="w-48 sm:w-60 lg:w-72 xl:w-80 flex-shrink-0 drop-shadow-2xl self-end">
            <Image
              src={imgScreenHome}
              alt="App Wundu"
              className="w-full rounded-[2.5rem] ring-2 ring-white/30"
              priority={false}
              placeholder="blur"
              sizes="(max-width: 640px) 192px, (max-width: 1024px) 240px, (max-width: 1280px) 288px, 320px"
              loading="lazy"
            />
          </div>

          {/* Right: Scan screen — desktop only */}
          <div className="hidden lg:block w-52 xl:w-64 flex-shrink-0 drop-shadow-2xl self-end -translate-y-8 rotate-[6deg] origin-bottom opacity-90">
            <Image
              src={imgScreenScan}
              alt="Wundu - Importar dados"
              className="w-full rounded-[2rem] ring-1 ring-white/20"
              priority={false}
              placeholder="blur"
              sizes="(max-width: 1280px) 208px, 256px"
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
