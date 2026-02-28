import { imgMountain } from "@/constants/images";
import { useCountUp } from "@/hooks/use-count-up";
import { Flame } from "lucide-react";
import Image, { StaticImageData } from "next/image";
import React from "react";

interface HeroSectionProps {
  backgroundImage?: string | StaticImageData;
}

export default function HeroSection({ backgroundImage = imgMountain }: HeroSectionProps) {
  const count = useCountUp(100);

  return (
    <section className="relative w-full overflow-hidden">
      <Image
        src={backgroundImage}
        alt="Hero Background"
        className="w-full h-125 md:h-162.5 lg:h-187.5 object-cover"
        priority
      />

      {/* Overlay de conteúdo que acompanha o tamanho da imagem */}
      <div className="absolute inset-0 bg-black/50 flex flex-col justify-center items-center text-center px-6 py-12">
        <div className="inline-flex items-center gap-2 bg-yellow-400/10 border border-yellow-400/30 text-yellow-400 text-xs px-4 py-2 rounded-full mb-8 relative z-20 backdrop-blur-sm animate-in fade-in slide-in-from-top duration-700">
          <Flame className="w-3.5 h-3.5 animate-pulse" />
          <span className="font-mono tabular-nums font-black tracking-tight">
            +{count} Pessoas estão a usar a Wundu
          </span>
        </div>

        <h1 className="text-4xl md:text-8xl font-black text-white mb-6 leading-[1.05] tracking-tighter relative z-20 animate-in fade-in slide-in-from-bottom duration-700">
          O futuro das suas <span className="text-yellow-400">finanças</span>
        </h1>

        <p className="text-white/90 max-w-xl mx-auto mb-10 text-base md:text-xl leading-relaxed font-medium relative z-20 animate-in fade-in slide-in-from-bottom duration-700 delay-150">
          Com o WUNDU, controlar os teus gastos, definir metas e organizar os teus
          cartões torna-se simples e{" "}
          <span className="text-yellow-400 font-bold italic underline decoration-yellow-400/30 underline-offset-4">
            intuitivo
          </span>
          .
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 relative z-20 animate-in fade-in slide-in-from-bottom duration-700 delay-300">
          <button className="bg-yellow-400 text-white px-12 py-5 rounded-full font-black text-xl hover:bg-yellow-500 hover:scale-105 active:scale-95 transition-all duration-300 shadow-2xl hover:shadow-yellow-400/20">
            Comece aqui
          </button>
        </div>
      </div>
    </section>
  );
}
