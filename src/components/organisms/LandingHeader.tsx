// src/components/organisms/LandingHeader/index.tsx
"use client";
import React, { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import LogoType from "@/src/components/atoms/LogoType";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/src/constants/routes";
import Button from "../atoms/Button";

const LandingHeader: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
    router.push(ROUTES.LOGIN);
  };

  const handleRegister = () => {
    router.push(ROUTES.REGISTER);
  };
  return (
    <header
      className={`bg-white/95 backdrop-blur-md border-2 m-2 border-gray-100 shadow-2xs rounded-2xl sticky top-2 z-50 transition-all duration-500 ${
        isScrolled ? "shadow-xl scale-[0.98] bg-white/98" : "shadow-2xs"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div onClick={handleHome} className="flex items-center space-x-2">
            <LogoType />
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navItems.map((item, index) => (
              <a
                key={item.href}
                href={item.href}
                className="text-gray-700 hover:text-blue-900 transition-all duration-300 hover:scale-105 font-medium"
              >
                {item.label}
              </a>
            ))}
          </nav>

          {/* Desktop Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <Button
              onClick={handleLogin}
              variant="secondary"
              className="hover:scale-105 transition-all duration-300"
            >
              Entrar
            </Button>
            <Button
              onClick={handleRegister}
              variant="landing"
              className="hover:scale-105 transition-all duration-300"
            >
              Criar Conta
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden transition-all duration-300 hover:scale-110 p-2 rounded-lg hover:bg-gray-100"
          >
            {isMenuOpen ? (
              <X className="w-6 h-6 text-gray-700" />
            ) : (
              <Menu className="w-6 h-6 text-gray-700" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t animate-slideDown">
          <div className="px-4 py-4 space-y-4">
            {navItems.map((item, index) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setIsMenuOpen(false)}
                className="block text-gray-700 hover:text-blue-900 transition-all duration-300 py-2 hover:scale-105 font-medium"
              >
                {item.label}
              </a>
            ))}
            <div className="pt-4 space-y-3 border-t border-gray-200">
              <Button
                variant="landing"
                className="w-full justify-center hover:scale-105 transition-all duration-300"
              >
                Entrar
              </Button>
              <Button
                variant="landing"
                className="w-full justify-center hover:scale-105 transition-all duration-300"
              >
                Criar Conta
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default LandingHeader;
