'use client';

import { useState } from 'react';
import LandingButton from '../atoms/LandingButton';
import LogoType from '../atoms/LogoType';
import NavLink from '../atoms/NavLink';
import { CloseIcon } from "@/src/constants/icons";
import { MenuIcon } from 'lucide-react';

const LandingHeader = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-white/90 border-b border-gray-100/20 backdrop-blur-md sticky top-0 z-50 shadow-lg">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <LogoType />
        <nav className="hidden md:flex items-center space-x-8">
          <NavLink href="#">Funcionalidades</NavLink>
          <NavLink href="#">Planos</NavLink>
          <NavLink href="#">Contactos</NavLink>
          <NavLink href="#">Sobre</NavLink>
        </nav>
        <div className="hidden md:flex items-center space-x-4">
          <LandingButton variant="secondary">Entrar</LandingButton>
          <LandingButton variant="primary" className="bg-orange-500 text-white hover:bg-orange-600">
            Criar Conta
          </LandingButton>
        </div>
        <div className="md:hidden">
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-blue-900">
            {isMenuOpen ? <CloseIcon className="w-8 h-8" /> : <MenuIcon className="w-8 h-8" />}
          </button>
        </div>
      </div>
      <div className={`fixed top-0 left-0 w-full bg-white h-screen p-8 transform ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out md:hidden shadow-lg`}>
        <nav className="flex flex-col items-center justify-center h-full space-y-8">
          <NavLink href="#">Funcionalidades</NavLink>
          <NavLink href="#">Planos</NavLink>
          <NavLink href="#">Contactos</NavLink>
          <NavLink href="#">Sobre</NavLink>
          <div className="flex flex-col space-y-4 w-full items-center mt-8 pt-8 border-t">
            <LandingButton variant="secondary">Entrar</LandingButton>
            <LandingButton variant="primary" className="bg-orange-500 text-white w-full">
              Criar Conta
            </LandingButton>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default LandingHeader;