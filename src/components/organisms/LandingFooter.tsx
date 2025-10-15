import React from 'react';
import { Github, Instagram, Linkedin, Twitter } from 'lucide-react';
import LogoType from '@/src/components/atoms/LogoType';
import SocialLink from '../molecules/SocialLink';


const LandingFooter: React.FC = () => {
  const socialLinks = [
    { href: '#', icon: Github, color: 'text-blue-600' },
    { href: '#', icon: Twitter, color: 'text-blue-400' },
    { href: '#', icon: Linkedin, color: 'text-blue-700' },
    { href: '#', icon: Instagram, color: 'text-pink-600' }
  ];

  return (
    <>
      {/* Desktop Footer */}
      <footer className="hidden md:block bg-white text-gray-800 py-16 border-2 m-2 border-gray-100 shadow-2xs">
        <div className=" mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            {/* Company Description */}
            <div>
              <div className="flex items-center space-x-2 mb-6">
                <LogoType />
              </div>
              <p className="text-gray-600 text-lg leading-relaxed mb-6">
                Transformando a maneira como as pessoas gerenciam suas finanças pessoais com tecnologia intuitiva e insights inteligentes.
              </p>

              {/* Social Media */}
              <div className="flex space-x-4">
                {socialLinks.map((link, index) => (
                  <SocialLink key={index} href={link.href} icon={link.icon} color={link.color} />
                ))}
              </div>
            </div>

            {/* Recursos */}
            <div>
              <h4 className="font-bold text-xl mb-6 text-gray-900">Recursos</h4>
              <ul className="space-y-4 text-lg">
                <li><a href="#" className="text-gray-600 hover:text-blue-600 transition-all duration-300 hover:translate-x-2 block">Blog</a></li>
                <li><a href="#" className="text-gray-600 hover:text-blue-600 transition-all duration-300 hover:translate-x-2 block">Documentação</a></li>
                <li><a href="#" className="text-gray-600 hover:text-blue-600 transition-all duration-300 hover:translate-x-2 block">GitHub</a></li>
                <li><a href="#" className="text-gray-600 hover:text-blue-600 transition-all duration-300 hover:translate-x-2 block">FAQs</a></li>
              </ul>
            </div>

            {/* Empresa */}
            <div>
              <h4 className="font-bold text-xl mb-6 text-gray-900">Empresa</h4>
              <ul className="space-y-4 text-lg">
                <li><a href="#" className="text-gray-600 hover:text-blue-600 transition-all duration-300 hover:translate-x-2 block">Sobre nós</a></li>
                <li><a href="#" className="text-gray-600 hover:text-blue-600 transition-all duration-300 hover:translate-x-2 block">Planos e funcionalidades</a></li>
                <li><a href="#" className="text-gray-600 hover:text-blue-600 transition-all duration-300 hover:translate-x-2 block">Contactos</a></li>
              </ul>
            </div>

            {/* Contacto */}
            <div>
              <h4 className="font-bold text-xl mb-6 text-gray-900">Contacto</h4>
              <ul className="space-y-4 text-lg text-gray-600">
                <li className="flex items-center space-x-3 hover:text-blue-600 transition-all duration-300">
                  <span>📧</span>
                  <span>suporte@wundu.tech</span>
                </li>
                <li className="flex items-center space-x-3 hover:text-blue-600 transition-all duration-300">
                  <span>📍</span>
                  <span>Angola, Luanda</span>
                </li>
                <li className="flex items-center space-x-3 hover:text-blue-600 transition-all duration-300">
                  <span>🔗</span>
                  <span>github.com/wundu</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t-2 border-gray-300 pt-8 flex flex-col md:flex-row justify-between items-center text-lg">
            <p className="text-gray-600 mb-4 md:mb-0">© 2025 WUNDU. Todos os direitos reservados.</p>
            <div className="flex space-x-8">
              <a href="#" className="text-gray-600 hover:text-blue-600 transition-all duration-300">Termos de Uso</a>
              <a href="#" className="text-gray-600 hover:text-blue-600 transition-all duration-300">Política de privacidade</a>
              <a href="#" className="text-gray-600 hover:text-blue-600 transition-all duration-300">Configurações de Cookies</a>
            </div>
          </div>
        </div>
      </footer>

      {/* Mobile Footer */}
      <footer className="md:hidden bg-gradient-to-br from-blue-900 to-blue-800 text-white py-12 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Logo and Description */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <LogoType />
            </div>
            <p className="text-blue-100 text-lg leading-relaxed mb-6">
              Transformando a maneira como as pessoas gerenciam suas finanças pessoais com tecnologia intuitiva e insights inteligentes.
            </p>

            {/* Social Media */}
            <div className="flex justify-center space-x-6 mb-8">
              {socialLinks.map((link, index) => (
                <a key={index} href={link.href} className={`text-blue-200 hover:text-white transition-all duration-300 transform hover:scale-110`}>
                  <link.icon className="w-6 h-6" />
                </a>
              ))}
            </div>
          </div>

          {/* Links Grid */}
          <div className="grid grid-cols-2 gap-8 mb-8">
            {/* Recursos */}
            <div>
              <h4 className="font-bold text-lg mb-4 text-white">Recursos</h4>
              <ul className="space-y-3 text-blue-100">
                <li><a href="#" className="hover:text-white transition-all duration-300 block">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-all duration-300 block">Documentação</a></li>
                <li><a href="#" className="hover:text-white transition-all duration-300 block">GitHub</a></li>
                <li><a href="#" className="hover:text-white transition-all duration-300 block">FAQs</a></li>
              </ul>
            </div>

            {/* Empresa */}
            <div>
              <h4 className="font-bold text-lg mb-4 text-white">Empresa</h4>
              <ul className="space-y-3 text-blue-100">
                <li><a href="#" className="hover:text-white transition-all duration-300 block">Sobre nós</a></li>
                <li><a href="#" className="hover:text-white transition-all duration-300 block">Planos e funcionalidades</a></li>
                <li><a href="#" className="hover:text-white transition-all duration-300 block">Contactos</a></li>
              </ul>
            </div>
          </div>

          {/* Contacto */}
          <div className="mb-8">
            <h4 className="font-bold text-lg mb-4 text-white">Contacto</h4>
            <ul className="space-y-3 text-blue-100">
              <li className="flex items-center space-x-3 hover:text-white transition-all duration-300">
                <span>📧</span>
                <span>suporte@wundu.tech</span>
              </li>
              <li className="flex items-center space-x-3 hover:text-white transition-all duration-300">
                <span>📍</span>
                <span>Angola, Luanda</span>
              </li>
              <li className="flex items-center space-x-3 hover:text-white transition-all duration-300">
                <span>🔗</span>
                <span>github.com/wundu</span>
              </li>
            </ul>
          </div>

          {/* Bottom Section */}
          <div className="border-t border-blue-700 pt-6 text-center">
            <p className="text-blue-200 mb-4">© 2025 WUNDU. Todos os direitos reservados.</p>
            <div className="flex flex-wrap justify-center gap-4 text-blue-200 text-sm">
              <a href="#" className="hover:text-white transition-all duration-300">Termos de Uso</a>
              <a href="#" className="hover:text-white transition-all duration-300">Política de privacidade</a>
              <a href="#" className="hover:text-white transition-all duration-300">Configurações de Cookies</a>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default LandingFooter;