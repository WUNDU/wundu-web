"use client";
import React, { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/constants/routes";
import LogoType from "@/components/ui/logo-type";
import Link from "next/link";

export const WunduLogo = () => (
  <div className="flex items-center gap-2 group cursor-pointer relative z-10">
    <div className="w-8 h-8 rounded-full bg-yellow-400 flex items-center justify-center group-hover:rotate-12 transition-transform duration-200 shadow-sm group-hover:shadow-glow-primary border border-white/40">
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
        w-full max-w-3xl flex items-center justify-between 
        px-3 md:px-4 py-1.5 transition-all duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] 
        rounded-full border shadow-[0_8px_32px_0_rgba(255,255,255,0.08)] backdrop-blur-xl
        ${
          scrolled
            ? "-translate-y-1 scale-[0.98] bg-yellow-400/20 border-yellow-400/70 shadow-[0_20px_40px_rgba(255,199,39,0.15)]"
            : "bg-white/10 border-white/20"
        }
      `}
      >
        {/* Shine effect overlay */}
        <div className="absolute inset-0 rounded-full bg-linear-to-tr from-white/10 via-white/5 to-transparent pointer-events-none" />
        <div className="absolute top-0 inset-x-0 h-px bg-linear-to-r from-transparent via-white/40 to-transparent pointer-events-none" />

        {/* Logo */}
        <div
          onClick={handleHome}
          className="relative z-10 transition-transform active:scale-95 shrink-0"
        >
          <div className="h-15 overflow-hidden">
            <LogoType />
          </div>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8 relative z-10">
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="text-[16px] font-extrabold text-secondary-dark hover:text-primary-dark transition-all duration-200 relative group py-2"
            >
              {item.name}
              <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-1 bg-yellow-400 rounded-full transition-all duration-150 group-hover:w-1 group-hover:h-1" />
            </Link>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-2 relative z-10">
          <Link
            href={ROUTES.LOGIN}
            className="bg-gray-900 px-5 py-2 text-[14px] font-black text-white transition-all duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] rounded-lg hover:bg-gray-800 hover:shadow-lg active:scale-95 flex items-center gap-2"
          >
            Entrar
          </Link>
        </div>

        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label={isMenuOpen ? "Fechar menu" : "Abrir menu"}
          aria-expanded={isMenuOpen}
          className="md:hidden flex items-center justify-center relative z-10 w-11 h-11 rounded-full bg-white/20 hover:bg-white/40 border border-white/20 transition-all active:scale-90 shadow-sm"
        >
          {isMenuOpen ? (
            <X className="w-5 h-5 text-gray-700" />
          ) : (
            <Menu className="w-5 h-5 text-gray-700" />
          )}
        </button>
      </nav>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="fixed inset-x-4 top-32 bg-white/90 backdrop-blur-2xl z-40 md:hidden rounded-4xl shadow-2xl border border-white/60 p-5 pointer-events-auto animate-scale-in origin-top overflow-hidden">
          <div className="relative z-10 flex flex-col gap-2">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setIsMenuOpen(false)}
                className="text-base font-bold text-secondary-dark hover:text-primary-dark transition-all duration-150 px-3 py-2.5 rounded-xl hover:bg-secondary/5 active:translate-x-1"
              >
                {item.name}
              </Link>
            ))}
            <div className="pt-3 flex flex-col gap-2.5 border-t border-slate-100 mt-1">
              <Link
                href={ROUTES.LOGIN}
                onClick={() => setIsMenuOpen(false)}
                className="w-full py-3 text-center font-bold text-secondary-dark bg-white/60 rounded-xl active:scale-95 transition-transform border border-slate-200/60"
              >
                Entrar
              </Link>
              <Link
                href={ROUTES.REGISTER}
                onClick={() => setIsMenuOpen(false)}
                className="w-full py-3 text-center font-black text-white bg-secondary rounded-xl active:scale-95 transition-transform"
              >
                Criar Conta
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
