"use client";
import React, { useState, useEffect, useCallback } from "react";
import { Menu, X } from "lucide-react";
import { LogoType } from "@/shared/components";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/constants/routes";

const LandingHeader: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);
  const router = useRouter();

  const handleScroll = useCallback(() => {
    const currentScrollY = window.scrollY;
    setScrollY(currentScrollY);
    setIsScrolled(currentScrollY > 50);
  }, []);

  useEffect(() => {
    // Chama uma vez para definir o estado inicial
    handleScroll();

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  const navItems = [
    { href: ROUTES.FEATURES, label: "Funcionalidades" },
    // { href: '/planos', label: 'Planos' },
    { href: ROUTES.CONTACTS, label: "Contactos" },
    { href: ROUTES.ABOUT, label: "Sobre" },
  ];

  const handleHome = () => {
    router.push(ROUTES.LANDINGPAGE);
  };

  const handleLogin = () => {
    setIsMenuOpen(false);
    router.push(ROUTES.LOGIN);
  };

  const handleRegister = () => {
    setIsMenuOpen(false);
    router.push(ROUTES.REGISTER);
  };
  return (
    <header
      className={`bg-white/95 backdrop-blur-md border-2 m-2 border-gray-100 shadow-2xs rounded-2xl z-50 transition-all duration-500 ${
        isScrolled
          ? "fixed top-2 left-0 right-0 shadow-xl scale-[0.98] bg-white/98"
          : "absolute top-2 left-0 right-0 shadow-2xs"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div
            onClick={handleHome}
            className="flex items-center space-x-2 cursor-pointer group transition-all duration-300 ease-out hover:scale-105 active:scale-95"
          >
            <div className="transition-all duration-300 group-hover:drop-shadow-lg">
              <LogoType />
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navItems.map((item, index) => (
              <a
                key={item.href}
                href={item.href}
                className="relative px-4 py-2 text-gray-700 hover:text-secondary font-medium rounded-lg transition-all duration-300 ease-out hover:scale-105 active:scale-95 hover:bg-gray-50/80 group"
              >
                <span className="relative z-10">{item.label}</span>
                <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </a>
            ))}
          </nav>

          {/* Desktop Buttons */}
          <div className="hidden md:flex items-center space-x-3">
            <button
              onClick={handleLogin}
              className="relative px-6 py-2.5 text-secondary font-semibold rounded-xl gradient-border hover:bg-secondary hover:text-white transition-all duration-300 ease-out hover:scale-105 active:scale-95 hover:shadow-glow-secondary group overflow-hidden"
            >
              <span className="relative z-10">Entrar</span>
              <div className="absolute inset-0 bg-gradient-to-r from-secondary/0 via-secondary/10 to-secondary/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
            </button>
            <button
              onClick={handleRegister}
              className="relative px-6 py-2.5 text-white font-semibold rounded-xl bg-gradient-to-r from-[#ffd400] via-[#ffb100] to-[#003cc3] transition-all duration-300 ease-out hover:scale-105 active:scale-95 hover:shadow-glow-primary"
            >
              Criar Conta
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden relative p-3 rounded-xl bg-gray-50/80 hover:bg-gray-100/80 transition-all duration-300 ease-out hover:scale-110 active:scale-95 group"
          >
            <div className="relative w-6 h-6 flex items-center justify-center">
              <div
                className={`absolute transition-all duration-300 ${isMenuOpen ? "rotate-180 opacity-0" : "rotate-0 opacity-100"}`}
              >
                <Menu className="w-6 h-6 text-gray-700 group-hover:text-secondary" />
              </div>
              <div
                className={`absolute transition-all duration-300 ${isMenuOpen ? "rotate-0 opacity-100" : "rotate-180 opacity-0"}`}
              >
                <X className="w-6 h-6 text-gray-700 group-hover:text-secondary" />
              </div>
            </div>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white/95 backdrop-blur-xl border-t border-gray-200/50 animate-slide-up">
          <div className="px-6 py-6 space-y-2">
            {navItems.map((item, index) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setIsMenuOpen(false)}
                className="block px-4 py-3 text-gray-700 hover:text-secondary font-medium rounded-xl transition-all duration-300 ease-out hover:scale-105 active:scale-95 hover:bg-gradient-to-r hover:from-primary/5 hover:to-secondary/5"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {item.label}
              </a>
            ))}
            <div className="pt-4 space-y-3 border-t border-gray-200/50">
              <button
                onClick={handleLogin}
                className="w-full px-6 py-3 text-secondary font-semibold rounded-xl gradient-border hover:bg-secondary hover:text-white transition-all duration-300 ease-out hover:scale-105 active:scale-95"
              >
                Entrar
              </button>
              <button
                onClick={handleRegister}
                className="w-full px-6 py-3 text-white font-semibold rounded-xl bg-gradient-to-r from-[#ffd400] via-[#ffb100] to-[#003cc3] transition-all duration-300 ease-out hover:scale-105 active:scale-95 hover:shadow-glow-primary"
              >
                Criar Conta
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default LandingHeader;
