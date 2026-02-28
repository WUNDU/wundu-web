"use client";
import React, { useState, useEffect } from "react";
import { Menu, X, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/constants/routes";
import LogoType from "../logo-type";

export const WunduLogo = () => (
  <div className="flex items-center gap-2 group cursor-pointer relative z-10">
    <div className="w-8 h-8 rounded-full bg-yellow-400 flex items-center justify-center group-hover:rotate-12 transition-transform duration-500 shadow-sm group-hover:shadow-glow-primary border border-white/40">
      <span className="text-white font-black text-sm">W</span>
    </div>
    <span className="font-bold text-gray-900 text-lg tracking-tight">
      Wundu
    </span>
  </div>
);

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { name: "Início", href: ROUTES.LANDINGPAGE },
    { name: "Sobre nós", href: ROUTES.ABOUT },
    { name: "Funcionalidades", href: "/#funcionalidades" },
    { name: "FAQ", href: "/#faq" },
  ];

  const handleHome = () => {
    router.push(ROUTES.LANDINGPAGE);
  };

  return (
    <div className="fixed top-6 left-0 right-0 z-50 flex justify-center px-4 pointer-events-none">
      <nav
        className={`
        pointer-events-auto
        w-full max-w-6xl flex items-center justify-between 
        px-6 md:px-8 py-3 transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] 
        rounded-full border border-yellow-400/30 shadow-[0_8px_32px_0_rgba(255,255,255,0.08)]
        backdrop-blur-xl bg-yellow-400/10
        ${scrolled ? "-translate-y-1 shadow-[0_20px_40px_rgba(0,0,0,0.1)] py-2 scale-[0.98] border-yellow-400/60 bg-white/20" : "py-4"}
      `}
      >
        {/* Shine effect overlay */}
        <div className="absolute inset-0 rounded-full bg-linear-to-tr from-white/10 via-white/5 to-transparent pointer-events-none" />
        <div className="absolute top-0 inset-x-0 h-px bg-linear-to-r from-transparent via-white/40 to-transparent pointer-events-none" />

        {/* Logo */}
        <div
          onClick={handleHome}
          className="relative z-10 transition-transform active:scale-95"
        >
          <div>
            <LogoType />
          </div>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-10 text-md font-bold text-gray-400 relative z-10">
          {navItems.map((item) => (
            <a
              key={item.name}
              href={item.href}
              className="hover:text-yellow-600 transition-all duration-300 relative group py-2"
            >
              {item.name}
              <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-1 bg-yellow-400 rounded-full transition-all duration-500 group-hover:w-1 group-hover:h-1" />
            </a>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-2 relative z-10">
          <button
            onClick={() => router.push(ROUTES.LOGIN)}
            className="bg-gray-900 px-6 py-2.5 text-[13px] font-black text-white transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] rounded-lg hover:bg-gray-800 hover:shadow-lg active:scale-95 flex items-center gap-2"
          >
            Entrar
          </button>
        </div>

        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="md:hidden relative z-10 p-2.5 rounded-full bg-white/20 hover:bg-white/40 border border-white/20 transition-all active:scale-90 shadow-sm"
        >
          {isMenuOpen ? (
            <X className="w-5 h-5 text-gray-700" />
          ) : (
            <Menu className="w-5 h-5 text-gray-700" />
          )}
        </button>
      </nav>

      {/* Mobile Menu (Liquid Glass Style) */}
      {isMenuOpen && (
        <div className="fixed inset-x-4 top-28 backdrop-blur-2xl bg-white/40 z-40 md:hidden rounded-[2.5rem] shadow-2xl border border-white/40 p-8 pointer-events-auto animate-scale-in origin-top overflow-hidden">
          <div className="absolute inset-0 bg-linear-to-b from-white/30 to-transparent pointer-events-none" />
          <div className="relative z-10 flex flex-col gap-5">
            {navItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                onClick={() => setIsMenuOpen(false)}
                className="text-2xl font-black text-gray-800 hover:text-yellow-600 transition-all active:translate-x-2"
              >
                {item.name}
              </a>
            ))}
            <div className="pt-6 flex flex-col gap-3">
              <button
                onClick={() => {
                  setIsMenuOpen(false);
                  router.push(ROUTES.LOGIN);
                }}
                className="w-full py-4 text-center font-bold text-gray-800 bg-white/20 rounded-2xl active:scale-95 transition-transform border border-white/30"
              >
                Entrar
              </button>
              <button
                onClick={() => {
                  setIsMenuOpen(false);
                  router.push(ROUTES.REGISTER);
                }}
                className="w-full py-4 text-center font-black text-white bg-yellow-400 rounded-2xl shadow-glow-primary active:scale-95 transition-transform border border-white/30"
              >
                Criar Conta
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
