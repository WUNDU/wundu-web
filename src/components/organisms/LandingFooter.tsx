// src/components/organisms/LandingFooter/index.tsx
'use client';
import React from 'react';
import { Facebook, Github, Instagram, Linkedin, Twitter } from 'lucide-react';
import LogoType from '@/src/components/atoms/LogoType';
import { EmailIcon, GithubIcon, LocationIcon, MirantesIcon, XIcon } from '@/src/constants/icons';

const LandingFooter: React.FC = () => {
  const socialLinks = [
    {
      href: 'https://github.com/wundu',
      icon: GithubIcon,
      name: 'GitHub'
    },
    {
      href: 'https://x.com/onewundu',
      icon: XIcon,
      name: 'Twitter'
    },
    {
      href: 'https://www.linkedin.com/company/onewundu/',
      icon: Linkedin,
      name: 'LinkedIn'
    },
    {
      href: 'https://www.instagram.com/onewundu/#',
      icon: Instagram,
      name: 'Instagram'
    },
    {
      href: 'https://web.facebook.com/people/Wundu/61574847264364/',
      icon: Facebook,
      name: 'Instagram'
    },
    {
      href: 'https://mirantes.io/profile/pt/wundu-6af8c1ba',
      icon: MirantesIcon,
      name: 'Mirantes'
    }
  ];

  const recursosLinks = [
    { href: '#', label: 'Blog' },
    { href: '#', label: 'Documentação' },
    { href: '#', label: 'GitHub' },
    { href: '#', label: 'FAQs' }
  ];

  const empresaLinks = [
    { href: '/sobre', label: 'Sobre nós' },
    { href: '/funcionalidades', label: 'Planos e funcionalidades' },
    { href: '/contactos', label: 'Contactos' }
  ];

  const legalLinks = [
    { href: '#', label: 'Termos de Uso' },
    { href: '#', label: 'Política de privacidade' },
    { href: '#', label: 'Configurações de Cookies' }
  ];

  return (
    <>
      {/* Desktop Footer */}
      <footer className="hidden md:block bg-white text-gray-800 py-16 border-2 m-2 border-gray-100 shadow-2xs rounded-2xl">
        <div className="mx-auto px-4 sm:px-6 lg:px-8">
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
                  <a
                    key={index}
                    href={link.href}
                    target='_blank'
                    className="text-gray-500 hover:text-blue-600 transition-all duration-300 transform hover:scale-110"
                    aria-label={link.name}
                  >
                    <link.icon className="w-6 h-6" />
                  </a>
                ))}
              </div>
            </div>

            {/* Recursos */}
            <div>
              <h4 className="font-bold text-xl mb-6 text-gray-900">Recursos</h4>
              <ul className="space-y-4 text-lg">
                {recursosLinks.map((link, index) => (
                  <li key={index}>
                    <a
                      href={link.href}
                      className="text-gray-600 hover:text-blue-600 transition-all duration-300 hover:translate-x-2 block"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Empresa */}
            <div>
              <h4 className="font-bold text-xl mb-6 text-gray-900">Empresa</h4>
              <ul className="space-y-4 text-lg">
                {empresaLinks.map((link, index) => (
                  <li key={index}>
                    <a
                      href={link.href}
                      className="text-gray-600 hover:text-blue-600 transition-all duration-300 hover:translate-x-2 block"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contacto */}
            <div>
              <h4 className="font-bold text-xl mb-6 text-gray-900">Contacto</h4>
              <ul className="space-y-4 text-lg text-gray-600">
                <li className="flex items-center space-x-3 hover:text-blue-600 transition-all duration-300">
                  <span className='text-yellow-700'><EmailIcon /></span>
                  <span>suporte@wundu.tech</span>
                </li>
                <li className="flex items-center space-x-3 hover:text-blue-600 transition-all duration-300">
                  <span className='text-yellow-700'><LocationIcon /></span>
                  <span>Angola, Luanda</span>
                </li>
                <li className="flex items-center space-x-3 hover:text-blue-600 transition-all duration-300">
                  <span className='text-yellow-700'><GithubIcon /></span>
                  <span>github.com/wundu</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="border-t-2 border-gray-300 pt-8 flex flex-col md:flex-row justify-between items-center text-lg">
            <p className="text-gray-600 mb-4 md:mb-0">© 2025 WUNDU. Todos os direitos reservados.</p>
            <div className="flex space-x-8">
              {legalLinks.map((link, index) => (
                <a
                  key={index}
                  href={link.href}
                  className="text-gray-600 hover:text-blue-600 transition-all duration-300"
                >
                  {link.label}
                </a>
              ))}
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
                <a
                  key={index}
                  href={link.href}
                  className="text-blue-200 hover:text-white transition-all duration-300 transform hover:scale-110"
                  aria-label={link.name}
                >
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
                {recursosLinks.map((link, index) => (
                  <li key={index}>
                    <a
                      href={link.href}
                      className="hover:text-white transition-all duration-300 block"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Empresa */}
            <div>
              <h4 className="font-bold text-lg mb-4 text-white">Empresa</h4>
              <ul className="space-y-3 text-blue-100">
                {empresaLinks.map((link, index) => (
                  <li key={index}>
                    <a
                      href={link.href}
                      className="hover:text-white transition-all duration-300 block"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
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
              {legalLinks.map((link, index) => (
                <a
                  key={index}
                  href={link.href}
                  className="hover:text-white transition-all duration-300"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default LandingFooter;