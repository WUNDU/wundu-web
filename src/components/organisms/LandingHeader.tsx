'use client';
import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import LogoType from '@/src/components/atoms/LogoType';
import LandingButton from '@/src/components/atoms/LandingButton';
import NavItem from '@/src/components/atoms/NavItem';

const LandingHeader: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`bg-white/95 backdrop-blur-md border-2 m-2 border-gray-100 shadow-2xs rounded-2xl sticky top-2 z-50 transition-all duration-300 ${scrollY > 100 ? 'shadow-lg scale-[0.98]' : ''
        }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-2">
            <LogoType />
          </div>

          <nav className="hidden md:flex items-center space-x-8">
            <NavItem href="#">Funcionalidades</NavItem>
            <NavItem href="#">Planos</NavItem>
            <NavItem href="#">Contactos</NavItem>
            <NavItem href="#">Sobre</NavItem>
          </nav>

          <div className="hidden md:flex items-center space-x-4">
            <LandingButton variant="secondary">Entrar</LandingButton>
            <LandingButton variant="primary">Criar Conta</LandingButton>
          </div>

          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden transition-all duration-300 hover:scale-110"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {isMenuOpen && (
        <div className="md:hidden bg-white border-t animate-slideDown">
          <div className="px-4 py-4 space-y-4">
            <NavItem href="#">Funcionalidades</NavItem>
            <NavItem href="#">Planos</NavItem>
            <NavItem href="#">Contactos</NavItem>
            <NavItem href="#">Sobre</NavItem>
            <LandingButton variant="secondary" className="w-full">Entrar</LandingButton>
            <LandingButton variant="primary" className="w-full">Criar Conta</LandingButton>
          </div>
        </div>
      )}
    </header>
  );
};

export default LandingHeader;