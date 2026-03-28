import { MirantesIcon, XIcon } from "@/constants/icons";
import { Instagram, Linkedin, Facebook, Mail } from "lucide-react";
import React from "react";
import LogoType from "../logo-type";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full py-8 border-t border-gray-100 bg-white">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6 text-sm font-medium text-gray-500">
        {/* Lado Esquerdo: Copyright e Nome */}
        <div className="flex items-center gap-2">
          <span className="font-black w-20 text-yellow-400 tracking-tighter">
            <LogoType />
          </span>
          <span className="text-gray-300">|</span>
          <p>© {currentYear} Todos os direitos reservados.</p>
        </div>

        {/* Centro: Redes Sociais */}
        <div className="flex items-center gap-6">
          <a
            href="https://mirantes.io/profile/pt/wundu-6af8c1ba"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-yellow-500 transition-colors"
            aria-label="Mirantes"
          >
            <MirantesIcon className="w-5 h-5 fill-current" />
          </a>
          <a
            href="https://www.instagram.com/onewundu/"
            className="hover:text-yellow-500 transition-colors"
            aria-label="Instagram"
          >
            <Instagram className="w-5 h-5" />
          </a>
          <a
            href="https://www.linkedin.com/company/onewundu/"
            className="hover:text-yellow-500 transition-colors"
            aria-label="Linkedin"
          >
            <Linkedin className="w-5 h-5" />
          </a>
          <a
            href="https://x.com/onewundu"
            className="hover:text-yellow-500 transition-colors"
            aria-label="X"
          >
            <XIcon className="w-5 h-5" />
          </a>
          <a
            href="https://web.facebook.com/people/Wundu/61574847264364/"
            className="hover:text-yellow-500 transition-colors"
            aria-label="Facebook"
          >
            <Facebook className="w-5 h-5" />
          </a>
        </div>

        {/* Lado Direito: Suporte e Status */}
        <div className="flex items-center gap-6">
          <a
            href="mailto:Support@wundu.tech"
            className="flex items-center gap-2 hover:text-gray-900 transition-colors"
          >
            <Mail className="w-4 h-4" />
            <span>Support@wundu.tech</span>
          </a>
          <div className="hidden lg:flex items-center gap-2 text-[10px] uppercase tracking-widest text-gray-400 font-bold">
            <div className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </div>
            <span>Online</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
